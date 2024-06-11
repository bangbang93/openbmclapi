import {decompress} from '@mongodb-js/zstd'
import {ChildProcess, spawn} from 'child_process'
import {MultiBar} from 'cli-progress'
import colors from 'colors/safe.js'
import delay from 'delay'
import express, {type NextFunction, type Request, type Response} from 'express'
import {readFileSync} from 'fs'
import fse from 'fs-extra'
import {mkdtemp, open, readFile, rm} from 'fs/promises'
import got, {type Got, HTTPError} from 'got'
import {createServer, Server} from 'http'
import {createSecureServer} from 'http2'
import http2Express from 'http2-express-bridge'
import {Agent as HttpsAgent} from 'https'
import {template, toString} from 'lodash-es'
import morgan from 'morgan'
import ms from 'ms'
import {constants} from 'node:http2'
import {userInfo} from 'node:os'
import {tmpdir} from 'os'
import pMap from 'p-map'
import pRetry from 'p-retry'
import {basename, dirname, join} from 'path'
import {connect, Socket} from 'socket.io-client'
import {Tail} from 'tail'
import {fileURLToPath} from 'url'
import {config, type OpenbmclapiAgentConfiguration, OpenbmclapiAgentConfigurationSchema} from './config.js'
import {FileListSchema} from './constants.js'
import {validateFile} from './file.js'
import {Keepalive} from './keepalive.js'
import {logger} from './logger.js'
import MeasureRouteFactory from './measure.route.js'
import {getStorage, type IStorage} from './storage/base.storage.js'
import type {TokenManager} from './token.js'
import type {IFileList} from './types.js'
import {setupUpnp} from './upnp.js'
import {checkSign, hashToFilename} from './util.js'

interface ICounters {
  hits: number
  bytes: number
}

const whiteListDomain = ['localhost', 'bangbang93.com']

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url))

export class Cluster {
  public readonly counters: ICounters = {hits: 0, bytes: 0}
  public isEnabled = false
  public wantEnable = false
  public interval?: NodeJS.Timeout
  public nginxProcess?: ChildProcess
  public readonly storage: IStorage

  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI ?? 'https://openbmclapi.bangbang93.com'
  private readonly host?: string
  private _port: number | string
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private readonly tmpDir = join(tmpdir(), 'openbmclapi')
  private readonly keepalive = new Keepalive(ms('1m'), this)
  private readonly downloadPromise = new Map<string, Promise<void>>()
  private socket?: Socket

  private server?: Server

  public constructor(
    private readonly clusterSecret: string,
    private readonly version: string,
    private readonly tokenManager: TokenManager,
  ) {
    this.host = config.clusterIp
    this._port = config.port
    this.publicPort = config.clusterPublicPort ?? config.port
    this.ua = `openbmclapi-cluster/${version}`
    this.got = got.extend({
      prefixUrl: this.prefixUrl,
      headers: {
        'user-agent': this.ua,
      },
      responseType: 'buffer',
      timeout: {
        connect: ms('10s'),
        response: ms('10s'),
        request: ms('5m'),
      },
      agent: {
        https: new HttpsAgent({
          keepAlive: true,
        }),
      },
      hooks: {
        beforeRequest: [
          async (options) => {
            const url = options.url
            if (!url) return
            if (typeof url === 'string') {
              if (
                whiteListDomain.some((domain) => {
                  return url.includes(domain)
                })
              ) {
                options.headers.authorization = `Bearer ${await this.tokenManager.getToken()}`
              }
            } else if (
              whiteListDomain.some((domain) => {
                return url.hostname.includes(domain)
              })
            ) {
              options.headers.authorization = `Bearer ${await this.tokenManager.getToken()}`
            }
          },
        ],
      },
    })
    this.storage = getStorage(config)
  }

  public get port(): number | string {
    return this._port
  }

  public async init(): Promise<void> {
    await this.storage.init?.()
    if (config.enableUpnp) {
      await setupUpnp(config.port, config.clusterPublicPort)
    }
  }

  public async getFileList(lastModified?: number): Promise<IFileList> {
    const res = await this.got.get('openbmclapi/files', {
      responseType: 'buffer',
      cache: this.requestCache,
      searchParams: {
        lastModified,
      },
    })
    if (res.statusCode === constants.HTTP_STATUS_NO_CONTENT) {
      return {
        files: [],
      }
    }
    const decompressed = await decompress(res.body)
    return {
      files: FileListSchema.fromBuffer(Buffer.from(decompressed)) as IFileList['files'],
    }
  }

  public async getConfiguration(): Promise<OpenbmclapiAgentConfiguration> {
    const res = await this.got.get('openbmclapi/configuration', {
      responseType: 'json',
      cache: this.requestCache,
    })
    return OpenbmclapiAgentConfigurationSchema.parse(res.body)
  }

  public async syncFiles(fileList: IFileList, syncConfig: OpenbmclapiAgentConfiguration['sync']): Promise<void> {
    const storageReady = await this.storage.check()
    if (!storageReady) {
      throw new Error('存储异常')
    }
    logger.info('正在检查缺失文件')
    const missingFiles = await this.storage.getMissingFiles(fileList.files)
    if (missingFiles.length === 0) {
      return
    }
    logger.info(`mismatch ${missingFiles.length} files, start syncing`)
    if (process.env.FORCE_NOOPEN) {
      syncConfig = {
        concurrency: 1,
        source: 'center',
      }
    }
    logger.info(syncConfig, '同步策略')
    const multibar = new MultiBar({
      format: ' {bar} | {filename} | {value}/{total}',
      noTTYOutput: !process.stdout.isTTY,
      notTTYSchedule: ms('10s'),
    })
    const totalBar = multibar.create(missingFiles.length, 0, {filename: '总文件数'})
    const parallel = syncConfig.concurrency
    const noopen = syncConfig.source === 'center' ? '1' : ''
    let hasError = false
    await pMap(
      missingFiles,
      async (file) => {
        const bar = multibar.create(file.size, 0, {filename: file.path})
        try {
          const res = await pRetry(
            () => {
              bar.update(0)
              return this.got
                .get<Buffer>(file.path.substring(1), {
                  searchParams: {
                    noopen,
                  },
                  retry: {
                    limit: 0,
                  },
                })
                .on('downloadProgress', (progress) => {
                  bar.update(progress.transferred)
                })
            },
            {
              retries: 10,
              onFailedAttempt: (e) => {
                if (e.cause instanceof HTTPError) {
                  logger.debug(
                    {redirectUrls: e.cause.response.redirectUrls},
                    `下载文件${file.path}失败: ${e.cause.response.statusCode}`,
                  )
                  logger.trace({err: e}, toString(e.cause.response.body))
                } else {
                  logger.debug({err: e}, `下载文件${file.path}失败，正在重试`)
                }
              },
            },
          )
          const isFileCorrect = validateFile(res.body, file.hash)
          if (!isFileCorrect) {
            hasError = true
            logger.error({redirectUrls: res.redirectUrls}, `文件${file.path}校验失败`)
            return
          }
          await this.storage.writeFile(hashToFilename(file.hash), res.body, file)
        } catch (e) {
          hasError = true
          if (e instanceof HTTPError) {
            logger.error(
              {redirectUrls: e.response.redirectUrls},
              `下载文件${file.path}失败: ${e.response.statusCode}, url: ${e.response.url}`,
            )
            logger.trace({err: e}, toString(e.response.body))
          } else {
            logger.error({err: e}, `下载文件${file.path}失败`)
          }
        } finally {
          totalBar.increment()
          bar.stop()
          multibar.remove(bar)
        }
      },
      {
        concurrency: parallel,
      },
    )
    multibar.stop()
    if (hasError) {
      throw new Error('同步失败')
    } else {
      logger.info('同步完成')
    }
  }

  public setupExpress(https: boolean): Server {
    const app = http2Express(express)
    app.enable('trust proxy')

    app.get('/auth', (req: Request, res: Response, next: NextFunction) => {
      try {
        const oldUrl = req.get('x-original-uri')
        if (!oldUrl) return res.status(403).send('invalid sign')

        const url = new URL(oldUrl, 'http://localhost')
        const hash = basename(url.pathname)
        const query = Object.fromEntries(url.searchParams.entries())
        const signValid = checkSign(hash, this.clusterSecret, query)
        if (!signValid) {
          return res.status(403).send('invalid sign')
        }
        res.sendStatus(204)
      } catch (e) {
        return next(e)
      }
    })

    if (!config.disableAccessLog) {
      app.use(morgan('combined'))
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.get('/download/:hash(\\w+)', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash.toLowerCase()
        const signValid = checkSign(hash, this.clusterSecret, req.query as NodeJS.Dict<string>)
        if (!signValid) {
          return res.status(403).send('invalid sign')
        }

        const hashPath = hashToFilename(hash)
        if (!(await this.storage.exists(hashPath))) {
          if (this.downloadPromise.has(hash)) {
            await this.downloadPromise.get(hash)
          } else {
            const promise = this.downloadFile(hash)
            try {
              this.downloadPromise.set(hash, promise)
              await promise
            } finally {
              this.downloadPromise.delete(hash)
            }
          }
        }
        res.set('x-bmclapi-hash', hash)
        const {bytes, hits} = await this.storage.express(hashPath, req, res, next)
        this.counters.bytes += bytes
        this.counters.hits += hits
      } catch (err) {
        if (err instanceof HTTPError) {
          if (err.response.statusCode === 404) {
            return next()
          }
        }
        return next(err)
      }
    })
    app.use('/measure', MeasureRouteFactory(config))
    let server: Server
    if (https) {
      server = createSecureServer(
        {
          key: readFileSync(join(this.tmpDir, 'key.pem'), 'utf8'),
          cert: readFileSync(join(this.tmpDir, 'cert.pem'), 'utf8'),
          allowHTTP1: true,
        },
        app,
      ) as unknown as Server
    } else {
      server = createServer(app)
    }
    this.server = server

    return server
  }

  public async setupNginx(pwd: string, appPort: number, proto: string): Promise<void> {
    this._port = '/tmp/openbmclapi.sock'
    await rm(this._port, {force: true})
    const dir = await mkdtemp(join(tmpdir(), 'openbmclapi'))
    const confFile = `${dir}/nginx/nginx.conf`
    const templateFile = 'nginx.conf'
    const confTemplate = await readFile(join(__dirname, '..', 'nginx', templateFile), 'utf8')
    console.log('nginx conf', confFile)

    await fse.copy(join(__dirname, '..', 'nginx'), dirname(confFile), {recursive: true, overwrite: true})
    await fse.outputFile(
      confFile,
      template(confTemplate)({
        root: pwd,
        port: appPort,
        ssl: proto === 'https',
        sock: this._port,
        user: userInfo().username,
        tmpdir: this.tmpDir,
      }),
    )

    const logFile = join(__dirname, '..', 'access.log')
    const logFd = await open(logFile, 'a')
    await fse.ftruncate(logFd.fd)

    this.nginxProcess = spawn('nginx', ['-c', confFile], {
      stdio: [null, logFd.fd, 'inherit'],
    })

    await delay(ms('1s'))

    if (this.nginxProcess.exitCode !== null) {
      throw new Error(`nginx exit with code ${this.nginxProcess.exitCode}`)
    }

    const tail = new Tail(logFile)
    if (!config.disableAccessLog) {
      tail.on('line', (line: string) => {
        process.stdout.write(line)
        process.stdout.write('\n')
      })
    }
    // eslint-disable-next-line max-len
    const logRegexp =
      /^(?<client>\S+) \S+ (?<userid>\S+) \[(?<datetime>[^\]]+)] "(?<method>[A-Z]+) (?<request>[^ "]+)? HTTP\/[0-9.]+" (?<status>[0-9]{3}) (?<size>[0-9]+|-) "(?<referrer>[^"]*)" "(?<useragent>[^"]*)"/
    tail.on('line', (line: string) => {
      const match = line.match(logRegexp)
      if (!match) {
        logger.debug(`cannot parse nginx log: ${line}`)
        return
      }
      this.counters.hits++
      this.counters.bytes += parseInt(match.groups?.size ?? '0', 10) || 0
    })

    this.interval = setInterval(() => {
      void fse.ftruncate(logFd.fd)
    }, ms('60s'))
  }

  public async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      if (!this.server) {
        throw new Error('server not setup')
      }
      this.server.listen(this._port, resolve)
    })
  }

  public connect(): void {
    if (this.socket?.connected) return
    this.socket = connect(this.prefixUrl, {
      transports: ['websocket'],
      auth: (cb) => {
        this.tokenManager
          .getToken()
          .then((token) => {
            cb({token})
          })
          .catch((e) => {
            logger.error(e, 'get token error')
            this.exit(1)
          })
      },
    })
    this.socket.on('error', this.onConnectionError.bind(this, 'error'))
    this.socket.on('message', (msg) => {
      logger.info(msg)
    })
    this.socket.on('connect', () => {
      logger.debug('connected')
    })
    this.socket.on('disconnect', (reason) => {
      logger.warn(`与服务器断开连接: ${reason}`)
      this.isEnabled = false
      this.keepalive.stop()
    })
    this.socket.on('exception', (err) => {
      logger.error(err, 'exception')
    })

    const io = this.socket.io
    io.on('reconnect', (attempt: number) => {
      logger.info(`在重试${attempt}次后恢复连接`)
      if (this.wantEnable) {
        logger.info('正在尝试重新启用服务')
        this.enable()
          .then(() => logger.info('重试连接并且准备就绪'))
          .catch(this.onConnectionError.bind(this, 'reconnect'))
      }
    })
    io.on('reconnect_error', (err) => {
      logger.error(err, 'reconnect_error')
    })
    io.on('reconnect_failed', this.onConnectionError.bind(this, 'reconnect_failed', new Error('reconnect failed')))
  }

  public async enable(): Promise<void> {
    if (this.isEnabled) return
    logger.trace('enable')
    await this._enable()
    this.isEnabled = true
    this.wantEnable = true
  }

  public async disable(): Promise<void> {
    if (!this.socket) return
    this.keepalive.stop()
    this.wantEnable = false
    const [err, ack] = (await this.socket.emitWithAck('disable', null)) as [object, boolean]
    this.isEnabled = false
    if (err) {
      if (typeof err === 'object' && 'message' in err) {
        throw new Error(err.message as string)
      }
    }
    if (!ack) {
      throw new Error('节点禁用失败')
    }
    this.socket?.disconnect()
  }

  public async downloadFile(hash: string): Promise<void> {
    const res = await this.got.get(`openbmclapi/download/${hash}`, {
      responseType: 'buffer',
      searchParams: {noopen: 1},
    })

    await this.storage.writeFile(hashToFilename(hash), res.body, {
      path: `/download/${hash}`,
      hash,
      size: res.body.length,
      mtime: Date.now(),
    })
  }

  public async requestCert(): Promise<void> {
    if (!this.socket) throw new Error('未连接到服务器')
    const [err, cert] = (await this.socket.emitWithAck('request-cert')) as [object, {cert: string; key: string}]
    if (err) {
      if (typeof err === 'object' && 'message' in err) {
        throw new Error(err.message as string)
      } else {
        throw new Error('请求证书失败', {cause: err})
      }
    }
    await fse.outputFile(join(this.tmpDir, 'cert.pem'), cert.cert)
    await fse.outputFile(join(this.tmpDir, 'key.pem'), cert.key)
  }

  public exit(code: number = 0): void {
    if (this.nginxProcess) {
      this.nginxProcess.kill()
    }
    // eslint-disable-next-line n/no-process-exit
    process.exit(code)
  }

  private async _enable(): Promise<void> {
    let err: unknown
    let ack: unknown
    if (!this.socket) {
      throw new Error('未连接到服务器')
    }
    try {
      const res = (await this.socket.timeout(ms('5m')).emitWithAck('enable', {
        host: this.host,
        port: this.publicPort,
        version: this.version,
        byoc: config.byoc,
        noFastEnable: process.env.NO_FAST_ENABLE === 'true',
        flavor: config.flavor,
      })) as unknown
      if (Array.isArray(res)) {
        ;[err, ack] = res as unknown[]
      }
    } catch (e) {
      throw new Error('节点注册超时', {cause: e})
    }

    if (err) {
      if (typeof err === 'object' && 'message' in err) {
        throw new Error(err.message as string)
      }
    }
    if (ack !== true) {
      throw new Error('节点注册失败')
    }

    logger.info(colors.rainbow('start doing my job'))
    this.keepalive.start(this.socket)
  }

  private onConnectionError(event: string, err: Error): void {
    console.error(`${event}: cannot connect to server`, err)
    if (this.server) {
      this.server.close(() => {
        this.exit(1)
      })
    } else {
      this.exit(1)
    }
  }
}
