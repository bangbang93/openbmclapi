import {decompress} from '@mongodb-js/zstd'
import avsc, {type schema} from 'avsc'
import Bluebird from 'bluebird'
import {ChildProcess, spawn} from 'child_process'
import colors from 'colors/safe.js'
import express, {type NextFunction, type Request, type Response} from 'express'
import {readFileSync} from 'fs'
import fse from 'fs-extra'
import {mkdtemp, open, readdir, readFile, rm, stat, unlink} from 'fs/promises'
import got, {type Got, HTTPError} from 'got'
import {createServer, Server} from 'http'
import {createSecureServer} from 'http2'
import http2Express from 'http2-express-bridge'
import {clone, min, sum, template} from 'lodash-es'
import morgan from 'morgan'
import ms from 'ms'
import {userInfo} from 'node:os'
import {tmpdir} from 'os'
import pMap from 'p-map'
import {basename, dirname, join, sep} from 'path'
import {cwd} from 'process'
import ProgressBar from 'progress'
import {connect, Socket} from 'socket.io-client'
import {Tail} from 'tail'
import {fileURLToPath} from 'url'
import {validateFile} from './file.js'
import MeasureRoute from './measure.route.js'
import {checkSign, hashToFilename} from './util.js'

interface IFileList {
  files: {path: string; hash: string; size: number}[]
}

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

  private keepAliveError = 0
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI ?? 'https://openbmclapi.bangbang93.com'
  private readonly cacheDir = join(cwd(), 'cache')
  private readonly host?: string
  private _port: number | string
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private socket?: Socket

  private server?: Server

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
    private readonly version: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.host = process.env.CLUSTER_IP
    this._port = parseInt(process.env.CLUSTER_PORT ?? '4000', 10)
    this.publicPort = process.env.CLUSTER_PUBLIC_PORT ? parseInt(process.env.CLUSTER_PUBLIC_PORT, 10) : this._port
    this.ua = `openbmclapi-cluster/${version}`
    this.got = got.extend({
      prefixUrl: this.prefixUrl,
      username: this.clusterId,
      password: this.clusterSecret,
      headers: {
        'user-agent': this.ua,
      },
      responseType: 'buffer',
      timeout: ms('1m'),
    })
  }

  public get port(): number | string {
    return this._port
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

  public async syncFiles(fileList: IFileList): Promise<void> {
    const missingFiles = await Bluebird.filter(fileList.files, async (file) => {
      const path = join(this.cacheDir, hashToFilename(file.hash))
      return !await fse.pathExists(path)
    })
    if (missingFiles.length === 0) {
      return
    }
    console.log(`mismatch ${missingFiles.length} files, start syncing`)
    const totalSize = sum(missingFiles.map((file) => file.size))
    const bar = new ProgressBar('downloading [:bar] :current/:total eta:etas :percent :rateBps', {
      total: totalSize,
      width: 80,
    })
    const parallel = parseInt(process.env.SYNC_PARALLEL ?? '1', 10) || 1
    const noopen = process.env.FORCE_NOOPEN === 'true' && parallel === 1 ? '1' : ''
    await pMap(missingFiles, async (file, i) => {
      const path = join(this.cacheDir, file.hash.substring(0, 2), file.hash)
      if (process.stderr.isTTY) {
        bar.interrupt(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      } else {
        console.log(`[${i + 1}/${missingFiles.length}] ${colors.green('downloading')} ${colors.underline(file.path)}`)
      }
      let lastProgress = 0
      const res = await this.got.get<Buffer>(file.path.substring(1), {
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
        throw new Error(`文件${file.path}校验失败`)
      }
      await fse.outputFile(path, res.body)
    }, {
      concurrency: parallel,
    })
    await this.gc(fileList)
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

    if (!process.env.DISABLE_ACCESS_LOG) {
      app.use(morgan('combined'))
    }
    app.get('/download/:hash(\\w+)', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash.toLowerCase()
        const signValid = checkSign(hash, this.clusterSecret, req.query as NodeJS.Dict<string>)
        if (!signValid) {
          return res.status(403).send('invalid sign')
        }

        const path = join(this.cacheDir, hashToFilename(hash))
        if (!await fse.pathExists(path)) {
          await this.downloadFile(hash)
        }
        const name = req.query.name as string
        if (name) {
          res.attachment(name)
        }
        res.set('x-bmclapi-hash', hash)
        return res.sendFile(path, {maxAge: '30d'}, (err) => {
          let bytes = res.socket?.bytesWritten ?? 0
          if (!err || err?.message === 'Request aborted' || err?.message === 'write EPIPE') {
            const header = res.getHeader('content-length')
            if (header) {
              const contentLength = parseInt(header.toString(), 10)
              bytes = min([bytes, contentLength]) ?? 0
            }
            this.counters.bytes += bytes
            this.counters.hits++
          } else {
            if (err) return next(err)
          }
        })
      } catch (err) {
        if (err instanceof HTTPError) {
          if (err.response.statusCode === 404) {
            return next()
          }
        }
        return next(err)
      }
    })
    app.use('/measure', MeasureRoute)
    let server: Server
    if (https) {
      server = createSecureServer({
        key: readFileSync(join(this.cacheDir, 'key.pem'), 'utf8'),
        cert: readFileSync(join(this.cacheDir, 'cert.pem'), 'utf8'),
        allowHTTP1: true,
      }, app) as unknown as Server
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
    await fse.outputFile(confFile, template(confTemplate)({
      root: pwd,
      port: appPort,
      ssl: proto === 'https',
      sock: this._port,
      user: userInfo().username,
    }))

    const logFile = join(__dirname, '..', 'access.log')
    const logFd = await open(logFile, 'a')
    await fse.ftruncate(logFd.fd)

    this.nginxProcess = spawn('nginx', ['-c', confFile], {
      stdio: [null, logFd.fd, 'inherit'],
    })

    const tail = new Tail(logFile)
    if (!process.env.DISABLE_ACCESS_LOG) {
      tail.on('line', (line: string) => {
        process.stdout.write(line)
        process.stdout.write('\n')
      })
    }
    // eslint-disable-next-line max-len
    const logRegexp = /^(?<client>\S+) \S+ (?<userid>\S+) \[(?<datetime>[^\]]+)] "(?<method>[A-Z]+) (?<request>[^ "]+)? HTTP\/[0-9.]+" (?<status>[0-9]{3}) (?<size>[0-9]+|-) "(?<referrer>[^"]*)" "(?<useragent>[^"]*)"/
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
      query: {
        clusterId: this.clusterId, clusterSecret: this.clusterSecret,
      },
    })
    this.socket.on('error', this.onConnectionError.bind(this, 'error'))
    this.socket.on('message', (msg) => console.log(msg))
    this.socket.on('connect', async () => {
      console.log('connected')
    })
    this.socket.on('disconnect', (reason) => {
      console.log(`与服务器断开连接: ${reason}`)
      this.isEnabled = false
    })

    const io = this.socket.io
    io.on('reconnect', (attempt: number) => {
      console.log(`在重试${attempt}次后恢复连接`)
      if (this.wantEnable) {
        console.log('正在尝试重新启用服务')
        this.enable()
          .then(() => console.log('重试连接并且准备就绪'))
          .catch(this.onConnectionError.bind(this, 'reconnect'))
      }
    })
    io.on('reconnect_error', (err) => {
      console.log('reconnect_error', err)
    })
    io.on('reconnect_failed', this.onConnectionError.bind(this, 'reconnect_failed', new Error('reconnect'
      + ' failed')))
  }

  public async enable(): Promise<void> {
    if (this.isEnabled) return
    console.log('enable')
    try {
      await this._enable()
      this.isEnabled = true
      this.wantEnable = true
    } catch (e) {
      console.error(e)
      this.exit(1)
    }
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

    const path = join(this.cacheDir, hashToFilename(hash))
    await fse.outputFile(path, res.body)
  }

  public async keepAlive(): Promise<boolean> {
    if (!this.isEnabled) {
      throw new Error('节点未启用')
    }
    return new Promise((resolve, reject) => {
      const counters = clone(this.counters)
      this.socket?.emit('keep-alive', {
        time: new Date(),
        ...counters,
      }, ([err, date]: [unknown, string]) => {
        if (err) return reject(err)
        this.counters.hits -= counters.hits
        this.counters.bytes -= counters.bytes
        resolve(!!date)
      })
    })
  }

  public async requestCert(): Promise<void> {
    const cert = await new Promise<{cert: string; key: string}>((resolve, reject) => {
      this.socket?.emit('request-cert', ([err, cert]: [unknown, {cert: string; key: string}]) => {
        if (err) return reject(err)
        resolve(cert)
      })
    })
    await fse.outputFile(join(this.cacheDir, 'cert.pem'), cert.cert)
    await fse.outputFile(join(this.cacheDir, 'key.pem'), cert.key)
  }

  public exit(code: number = 0): never {
    if (this.nginxProcess) {
      this.nginxProcess.kill()
    }
    process.exit(code)
  }

  private async _enable(): Promise<void> {
    return new Bluebird<void>((resolve, reject) => {
      this.socket?.emit('enable', {
        host: this.host,
        port: this.publicPort,
        version: this.version,
        byoc: process.env.CLUSTER_BYOC === 'true',
      }, ([err, ack]: [unknown, unknown]) => {
        if (err) return reject(err)
        if (ack !== true) return reject(ack)
        resolve()
        console.log(colors.rainbow('start doing my job'))
        this.keepAliveInterval = setTimeout(this._keepAlive.bind(this), ms('1m'))
      })
    }).timeout(ms('5m'), '节点注册超时')
  }

  private async _keepAlive(): Promise<void> {
    try {
      const status = await Bluebird.try(async () => this.keepAlive()).timeout(ms('10s'), 'keep alive timeout')
      if (!status) {
        console.log('kicked by server')
        this.exit(1)
      } else {
        console.log('keep alive success')
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
          await this.connect()
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

  private async gc(fileList: IFileList): Promise<void> {
    const fileSet = new Set<string>()
    for (const file of fileList.files) {
      fileSet.add(hashToFilename(file.hash))
    }
    const queue = [this.cacheDir]
    do {
      const dir = queue.pop()
      if (!dir) break
      const entries = await readdir(dir)
      for (const entry of entries) {
        if (entry.endsWith('.pem')) continue
        const p = join(dir, entry)
        const s = await stat(p)
        if (s.isDirectory()) {
          queue.push(p)
          continue
        }
        const cacheDirWithSep = this.cacheDir + sep
        if (!fileSet.has(p.replace(cacheDirWithSep, ''))) {
          console.log(colors.gray(`delete expire file: ${p}`))
          await unlink(p)
        }
      }
    } while (queue.length !== 0)
  }
}
