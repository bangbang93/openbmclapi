import {decompress} from '@mongodb-js/zstd'
import avsc, {type schema} from 'avsc'
import Bluebird from 'bluebird'
import {ChildProcess, spawn} from 'child_process'
import colors from 'colors/safe.js'
import express, {type NextFunction, type Request, type Response} from 'express'
import {readFileSync} from 'fs'
import fse from 'fs-extra'
import {mkdtemp, open, readFile, rm} from 'fs/promises'
import got, {type Got, HTTPError} from 'got'
import {createServer, Server} from 'http'
import {createSecureServer} from 'http2'
import http2Express from 'http2-express-bridge'
import {clone, sum, template} from 'lodash-es'
import morgan from 'morgan'
import ms from 'ms'
import {userInfo} from 'node:os'
import {tmpdir} from 'os'
import pMap from 'p-map'
import {basename, dirname, join} from 'path'
import prettyBytes from 'pretty-bytes'
import ProgressBar from 'progress'
import {connect, Socket} from 'socket.io-client'
import {Tail} from 'tail'
import {fileURLToPath} from 'url'
import {config, type OpenbmclapiAgentConfiguration, OpenbmclapiAgentConfigurationSchema} from './config.js'
import {validateFile} from './file.js'
import {logger} from './logger.js'
import MeasureRouteFactory from './measure.route.js'
import {getStorage, type IStorage} from './storage/base.storage.js'
import type {TokenManager} from './token.js'
import type {IFileList} from './types.js'
import {checkSign, hashToFilename} from './util.js'

interface ICounters {
  hits: number
  bytes: number
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export class Cluster {
  public readonly counters: ICounters = {hits: 0, bytes: 0}
  public isEnabled = false
  public wantEnable = false
  public keepAliveInterval?: NodeJS.Timeout
  public interval?: NodeJS.Timeout
  public nginxProcess?: ChildProcess
  public readonly storage: IStorage

  private keepAliveError = 0
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI ?? 'https://openbmclapi.bangbang93.com'
  private readonly host?: string
  private _port: number | string
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private readonly tmpDir = join(tmpdir(), 'openbmclapi')
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
        request: ms('5m'),
      },
      hooks: {
        beforeRequest: [
          async (options) => {
            const url = options.url
            if (!url) return
            if (typeof url === 'string') {
              if (url.includes('bmclapi.bangbang93.com') || url.includes('bmclapi2.bangbang93.com')) {
                options.headers.authorization = `Bearer ${await this.tokenManager.getToken()}`
              }
            } else if (
              url.hostname.includes('bmclapi.bangbang93.com') ||
              url.hostname.includes('bmclapi2.bangbang93.com')
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
  }

  public async getFileList(): Promise<IFileList> {
    const FileListSchema = avsc.Type.forSchema({
      type: 'array',
      items: {
        type: 'record',
        fields: [
          {name: 'path', type: 'string'},
          {name: 'hash', type: 'string'},
          {name: 'size', type: 'long'},
        ],
      } as schema.RecordType,
    })
    const res = await this.got.get('openbmclapi/files', {
      responseType: 'buffer',
      cache: this.requestCache,
    })
    const decompressed = await decompress(res.body)
    return {
      files: FileListSchema.fromBuffer(Buffer.from(decompressed)),
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
    const totalSize = sum(missingFiles.map((file) => file.size))
    const bar = new ProgressBar('downloading [:bar] :current/:total eta:etas :percent :rateBps', {
      total: totalSize,
      width: 80,
    })
    const parallel = syncConfig.concurrency
    const noopen = syncConfig.source === 'center' ? '1' : ''
    let hasError = false
    await pMap(
      missingFiles,
      async (file, i) => {
        if (process.stderr.isTTY) {
          bar.interrupt(`${colors.green('downloading')} ${colors.underline(file.path)}`)
        } else {
          logger.info(`[${i + 1}/${missingFiles.length}] ${colors.green('downloading')} ${colors.underline(file.path)}`)
        }
        let lastProgress = 0
        try {
          const res = await this.got
            .get<Buffer>(file.path.substring(1), {
              searchParams: {
                noopen,
              },
              retry: {
                limit: 10,
              },
            })
            .on('downloadProgress', (progress) => {
              bar.tick(progress.transferred - lastProgress)
              lastProgress = progress.transferred
            })
          const isFileCorrect = validateFile(res.body, file.hash)
          if (!isFileCorrect) {
            hasError = true
            logger.error(`文件${file.path}校验失败`)
            return
          }
          await this.storage.writeFile(hashToFilename(file.hash), res.body, file)
        } catch (e) {
          hasError = true
          if (e instanceof HTTPError) {
            logger.error({err: e}, `下载文件${file.path}失败: ${e.response.statusCode}, url: ${e.response.url}`)
            logger.trace(
              {err: e, options: e.options, redirectUrls: e.response.redirectUrls},
              e.response.body?.toString(),
            )
          } else {
            logger.error({err: e}, `下载文件${file.path}失败`)
          }
        }
      },
      {
        concurrency: parallel,
      },
    )
    if (hasError) {
      throw new Error('同步失败')
    } else {
      logger.info('同步完成')
    }
  }

  public setupExpress(https: boolean): Server {
    const app = http2Express(express)
    app.enable('trust proxy')

    app.get('/auth', async (req: Request, res: Response, next: NextFunction) => {
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
    app.get('/download/:hash(\\w+)', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash.toLowerCase()
        const signValid = checkSign(hash, this.clusterSecret, req.query as NodeJS.Dict<string>)
        if (!signValid) {
          return res.status(403).send('invalid sign')
        }

        const hashPath = hashToFilename(hash)
        if (!(await this.storage.exists(hashPath))) {
          await this.downloadFile(hash)
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
        console.log(`cannot parse nginx log: ${line}`)
        return
      }
      this.counters.hits++
      this.counters.bytes += parseInt(match.groups?.size ?? '0', 10) || 0
    })

    this.interval = setInterval(async () => {
      await fse.ftruncate(logFd.fd)
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

  public async connect(): Promise<void> {
    if (this.socket) return
    this.socket = connect(this.prefixUrl, {
      transports: ['websocket'],
      auth: {
        token: await this.tokenManager.getToken(),
      },
    })
    this.socket.on('error', this.onConnectionError.bind(this, 'error'))
    this.socket.on('message', (msg) => {
      logger.info(msg)
    })
    this.socket.on('connect', async () => {
      logger.debug('connected')
    })
    this.socket.on('disconnect', (reason) => {
      logger.warn(`与服务器断开连接: ${reason}`)
      this.isEnabled = false
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
    clearTimeout(this.keepAliveInterval)
    this.wantEnable = false
    return new Promise((resolve, reject) => {
      this.socket?.emit('disable', null, ([err, ack]: [unknown, unknown]) => {
        this.isEnabled = false
        if (err || ack !== true) return reject(err || ack)
        this.socket?.disconnect()
        resolve()
      })
    })
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
    })
  }

  public async keepAlive(): Promise<boolean> {
    if (!this.isEnabled) {
      throw new Error('节点未启用')
    }
    return new Promise((resolve, reject) => {
      const counters = clone(this.counters)
      this.socket?.emit(
        'keep-alive',
        {
          time: new Date(),
          ...counters,
        },
        ([err, date]: [unknown, string]) => {
          if (err) return reject(err)
          const bytes = prettyBytes(counters.bytes, {binary: true})
          logger.info(`keep alive success, serve ${counters.hits} files, ${bytes}`)
          this.counters.hits -= counters.hits
          this.counters.bytes -= counters.bytes
          resolve(!!date)
        },
      )
    })
  }

  public async requestCert(): Promise<void> {
    const cert = await new Promise<{cert: string; key: string}>((resolve, reject) => {
      this.socket?.emit('request-cert', ([err, cert]: [unknown, {cert: string; key: string}]) => {
        if (err) return reject(err)
        resolve(cert)
      })
    })
    await fse.outputFile(join(this.tmpDir, 'cert.pem'), cert.cert)
    await fse.outputFile(join(this.tmpDir, 'key.pem'), cert.key)
  }

  public exit(code: number = 0): never {
    if (this.nginxProcess) {
      this.nginxProcess.kill()
    }
    process.exit(code)
  }

  private async _enable(): Promise<void> {
    return new Bluebird<void>((resolve, reject) => {
      this.socket?.emit(
        'enable',
        {
          host: this.host,
          port: this.publicPort,
          version: this.version,
          byoc: config.byoc,
          noFastEnable: process.env.NO_FAST_ENABLE === 'true',
        },
        ([err, ack]: [unknown, unknown]) => {
          if (err) return reject(err)
          if (ack !== true) return reject(ack)
          resolve()
          logger.info(colors.rainbow('start doing my job'))
          this.keepAliveInterval = setTimeout(this._keepAlive.bind(this), ms('1m'))
        },
      )
    }).timeout(ms('5m'), '节点注册超时')
  }

  private async _keepAlive(): Promise<void> {
    try {
      const status = await Bluebird.try(async () => this.keepAlive()).timeout(ms('10s'), 'keep alive timeout')
      if (!status) {
        logger.fatal('kicked by server')
        this.exit(1)
      }
      this.keepAliveError = 0
    } catch (e) {
      this.keepAliveError++
      console.error('keep alive error')
      console.error(e)
      console.log(this.socket)
      if (this.keepAliveError >= 5) {
        console.error('exit')
      } else {
        await Bluebird.try(async () => {
          await this.disable()
          this.connect()
          await this.enable()
        })
          .timeout(ms('10m'), 'restart timeout')
          .catch((e) => {
            console.error(e, 'restart failed')
            this.exit(1)
          })
      }
    } finally {
      this.keepAliveInterval = setTimeout(this._keepAlive.bind(this), ms('1m'))
    }
  }

  private async onConnectionError(event: string, err: Error): Promise<void> {
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
