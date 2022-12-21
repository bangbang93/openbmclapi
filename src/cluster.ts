import {ZstdInit} from '@oneidentity/zstd-js'
import {schema, Type} from 'avsc'
import Bluebird from 'bluebird'
import {ChildProcess, spawn} from 'child_process'
import colors from 'colors/safe'
import express from 'express'
import {readFileSync} from 'fs'
import {chmod, copy, ftruncate, mkdtemp, open, outputFile, pathExists, readdir, readFile, stat, unlink} from 'fs-extra'
import {rm} from 'fs/promises'
import got, {Got, HTTPError} from 'got'
import {Server} from 'http'
import {clone, sum, template} from 'lodash'
import morgan from 'morgan'
import ms from 'ms'
import {tmpdir} from 'os'
import {dirname, join, sep} from 'path'
import {cwd} from 'process'
import ProgressBar from 'progress'
import {createInterface} from 'readline'
import {connect, Socket} from 'socket.io-client'
import {validateFile} from './file'
import MeasureRoute from './measure.route'
import http2Express = require('http2-express-bridge')
import NextFunction = express.NextFunction
import Request = express.Request
import Response = express.Response
import Timeout = NodeJS.Timeout
import RecordType = schema.RecordType

interface IFileList {
  files: {path: string; hash: string; size: number}[]
}

interface ICounters {
  hits: number
  bytes: number
}

export class Cluster {
  public readonly counters: ICounters = {hits: 0, bytes: 0}
  public isEnabled = false
  public keepAliveInterval: Timeout | undefined
  public interval: Timeout | undefined
  public nginxProcess: ChildProcess | undefined

  private keepAliveError = 0
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly cacheDir = join(cwd(), 'cache')
  private readonly host: string | undefined
  private _port: number | string
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private io?: Socket

  private server?: Server

  public get port(): number | string {
    return this._port
  }

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

  public async getFileList(): Promise<IFileList> {
    const FileListSchema = Type.forSchema({
      type: 'array',
      items: {
        type: 'record',
        fields: [
          {name: 'path', type: 'string'},
          {name: 'hash', type: 'string'},
          {name: 'size', type: 'long'},
        ],
      } as RecordType,
    })
    const res = await this.got.get('openbmclapi/files', {
      responseType: 'buffer',
      cache: this.requestCache,
    })
    const {ZstdStream} = await ZstdInit()
    const decompressed = ZstdStream.decompress(res.body)
    return {
      files: FileListSchema.fromBuffer(Buffer.from(decompressed)),
    }
  }

  public async syncFiles(fileList: IFileList): Promise<void> {
    const files = await Bluebird.filter(fileList.files, async (file) => {
      const path = join(this.cacheDir, file.hash.substr(0, 2), file.hash)
      return !await pathExists(path)
    })
    const totalSize = sum(files.map((file) => file.size))
    const bar = new ProgressBar('downloading [:bar] :current/:total eta:etas :percent :rateBps', {
      total: totalSize,
      width: 80,
    })
    const sortedFiles = files.sort((a, b) => a.path > b.path ? 1 : 0)
    for (const file of sortedFiles) {
      const path = join(this.cacheDir, file.hash.substr(0, 2), file.hash)
      if (process.stderr.isTTY) {
        bar.interrupt(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      } else {
        console.log(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      }
      let lastProgress = 0
      const res = await this.got.get<Buffer>(file.path.substr(1))
        .on('downloadProgress', (progress) => {
          bar.tick(progress.transferred - lastProgress)
          lastProgress = progress.transferred
        })
      const isFileCorrect = validateFile(res.body, file.hash)
      if (!isFileCorrect) {
        throw new Error(`文件${file.path}校验失败`)
      }
      await outputFile(path, res.body)
    }
    await this.gc(fileList)
  }

  public setupExpress(https: boolean): Server {
    const app = http2Express(express)
    app.enable('trust proxy')
    if (!process.env.DISABLE_ACCESS_LOG) {
      app.use(morgan('combined'))
    }
    app.get('/download/:hash', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash
        const path = join(this.cacheDir, hash.substr(0, 2), hash)
        if (!await pathExists(path)) {
          await this.downloadFile(hash)
        }
        const name = req.query.name as string
        if (name) {
          res.attachment(name)
        }
        res.set('x-bmclapi-hash', hash)
        return res.sendFile(path, {maxAge: '30d'}, (err) => {
          if (!err || err?.message === 'Request aborted' || err?.message === 'write EPIPE') {
            const header = res.getHeader('content-length')
            if (header) {
              this.counters.bytes += parseInt(header.toString(), 10) || 0
            }
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
      /* eslint-disable @typescript-eslint/no-var-requires */
      server = require('http2').createSecureServer({
        key: readFileSync(join(this.cacheDir, 'key.pem'), 'utf8'),
        cert: readFileSync(join(this.cacheDir, 'cert.pem'), 'utf8'),
        allowHTTP1: true,
      }, app)
    } else {
      server = require('http').createServer(app)
      /* eslint-enable @typescript-eslint/no-var-requires */
    }
    this.server = server

    return server
  }

  public async setupNginx(pwd: string, appPort: number, proto: string): Promise<void> {
    this._port = join(this.cacheDir, 'openbmclapi.sock')
    await rm(this._port, {force: true})
    const dir = await mkdtemp(join(tmpdir(), 'openbmclapi'))
    const confFile = `${dir}/nginx/nginx.conf`
    const templateFile = proto === 'https' ? 'nginx.conf' : 'nginx-http.conf'
    const confTemplate = await readFile(join(__dirname, '..', 'nginx', templateFile), 'utf8')
    console.log('nginx conf', confFile)

    await copy(join(__dirname, '..', 'nginx'), dirname(confFile), {recursive: true, overwrite: true})
    await outputFile(confFile, template(confTemplate)({
      root: pwd,
      port: appPort,
    }))

    const logFile = join(__dirname, '..', 'access.log')
    const logFd = await open(logFile, 'a')
    await ftruncate(logFd)

    this.nginxProcess = spawn('nginx', ['-c', confFile], {
      stdio: [null, logFd, 'inherit'],
    })

    const tail = spawn('tail', ['-f', logFile])
    const rl = createInterface({
      input: tail.stdout,
    })

    if (!process.env.DISABLE_ACCESS_LOG) {
      tail.stdout.pipe(process.stdout)
    }
    // eslint-disable-next-line max-len
    const logRegexp = /^(?<client>\S+) \S+ (?<userid>\S+) \[(?<datetime>[^\]]+)] "(?<method>[A-Z]+) (?<request>[^ "]+)? HTTP\/[0-9.]+" (?<status>[0-9]{3}) (?<size>[0-9]+|-) "(?<referrer>[^"]*)" "(?<useragent>[^"]*)"/
    rl.on('line', (line: string) => {
      const match = line.match(logRegexp)
      if (!match) {
        console.log(`cannot parse nginx log: ${line}`)
        return
      }
      this.counters.hits++
      this.counters.bytes += parseInt(match.groups?.size ?? '0', 10)
    })

    this.interval = setInterval(async () => {
      await ftruncate(logFd)
    }, ms('60s'))
  }

  public async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      if (!this.server) {
        throw new Error('server not setup')
      }
      this.server.listen(this._port, resolve)
    })
    if (typeof this._port === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      await chmod(this._port, 0o777)
    }
  }

  public async connect(): Promise<void> {
    if (this.io) return
    this.io = connect(this.prefixUrl, {
      transports: ['websocket'],
      query: {
        clusterId: this.clusterId, clusterSecret: this.clusterSecret,
      },
      reconnectionAttempts: 10,
    })
    this.io.on('connect', async () => {
      console.log('connected')
    })
    this.io.on('message', (msg) => console.log(msg))
    this.io.on('disconnect', (reason: string) => {
      console.log(`disconnected: ${reason}`)
      this.isEnabled = false
    })
    this.io.on('error', this.onConnectionError.bind(this))
    this.io.on('connect_error', this.onConnectionError.bind(this))
    this.io.on('reconnect_error', this.onConnectionError.bind(this))
    this.io.on('connect_timeout', this.onConnectionError.bind(this))
    this.io.on('reconnect_timeout', this.onConnectionError.bind(this))
  }

  public async enable(): Promise<void> {
    if (this.isEnabled) return
    try {
      await this._enable()
      this.isEnabled = true
    } catch (e) {
      console.error(e)
      this.exit(1)
    }
  }

  public async disable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.io?.emit('disable', null, ([err, ack]: [unknown, unknown]) => {
        this.isEnabled = false
        if (err || ack !== true) return reject(err || ack)
        this.io?.disconnect()
        resolve()
      })
    })
  }

  public async downloadFile(hash: string): Promise<void> {
    const res = await this.got.get(`openbmclapi/download/${hash}`, {
      responseType: 'buffer',
      searchParams: {noopen: 1},
    })

    const path = join(this.cacheDir, this.hashToFilename(hash))
    await outputFile(path, res.body)
  }

  public async keepAlive(): Promise<boolean> {
    if (!this.isEnabled) {
      throw new Error('节点未启用')
    }
    return new Promise((resolve, reject) => {
      const counters = clone(this.counters)
      this.io?.emit('keep-alive', {
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
      this.io?.emit('request-cert', ([err, cert]: [unknown, {cert: string; key: string}]) => {
        if (err) return reject(err)
        resolve(cert)
      })
    })
    await outputFile(join(this.cacheDir, 'cert.pem'), cert.cert)
    await outputFile(join(this.cacheDir, 'key.pem'), cert.key)
  }

  public exit(code: number = 0): never {
    if (this.nginxProcess) {
      this.nginxProcess.kill()
    }
    process.exit(code)
  }

  private async _enable(): Promise<void> {
    return new Bluebird<void>((resolve, reject) => {
      this.io?.emit('enable', {
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
      console.log(this.io)
      if (this.keepAliveError >= 5) {
        console.error('exit')
      } else {
        await Bluebird.try(async () => {
          await this.disable()
          await this.enable()
        })
          .timeout(ms('30s'), 'restart timeout')
          .catch((e) => {
            console.error(e, 'restart failed')
            this.exit(1)
          })
      }
    } finally {
      this.keepAliveInterval = setTimeout(this._keepAlive.bind(this), ms('1m'))
    }
  }

  private async onConnectionError(err: Error): Promise<void> {
    console.error('cannot connect to server', err)
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
      fileSet.add(this.hashToFilename(file.hash))
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

  private hashToFilename(hash: string): string {
    return join(hash.substr(0, 2), hash)
  }
}
