import * as Bluebird from 'bluebird'
import {ChildProcess, spawn} from 'child_process'
import * as colors from 'colors/safe'
import * as express from 'express'
import {readFileSync} from 'fs'
import {copy, ftruncate, mkdtemp, open, outputFile, pathExists, readdir, readFile, stat, unlink} from 'fs-extra'
import got, {Got, HTTPError} from 'got'
import {Server} from 'http'
import {clone, template} from 'lodash'
import {tmpdir} from 'os'
import {dirname, join, sep} from 'path'
import {cwd} from 'process'
import * as ProgressBar from 'progress'
import {createInterface} from 'readline'
import * as io from 'socket.io-client'
import MeasureRoute from './measure.route'
import morgan = require('morgan')
import ms = require('ms')
import NextFunction = express.NextFunction
import Request = express.Request
import Response = express.Response
import Timeout = NodeJS.Timeout
import Socket = SocketIOClient.Socket
import http2Express = require('http2-express-bridge')

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
  public keepAliveInterval: Timeout
  public interval: Timeout
  public nginxProcess: ChildProcess

  private keepAliveError = 0
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly cacheDir = join(cwd(), 'cache')
  private readonly host: string
  private _port: number
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private io: Socket

  private server: Server

  public get port() {
    return this._port
  }

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
    private readonly version: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.host = process.env.CLUSTER_IP
    this._port = parseInt(process.env.CLUSTER_PORT, 10)
    this.publicPort = parseInt(process.env.CLUSTER_PUBLIC_PORT, 10) || this._port
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
    const res = await this.got.get<IFileList>('openbmclapi/files', {
      responseType: 'json',
      cache: this.requestCache,
    })
    return res.body
  }

  public async syncFiles(fileList: IFileList): Promise<void> {
    const files = await Bluebird.filter(fileList.files, async (file) => {
      const path = join(this.cacheDir, file.hash.substr(0, 2), file.hash)
      return !await pathExists(path)
    })
    const totalSize = files.reduce((p, e) => p + e.size, 0)
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
      const res = await this.got.get(file.path.substr(1), {searchParams: {noopen: 1}})
        .on('downloadProgress', (progress) => {
          bar.tick(progress.transferred - lastProgress)
          lastProgress = progress.transferred
        })
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
          if (err) return next(err)
          this.counters.bytes += Number(res.getHeader('content-length'))
          this.counters.hits++
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
    if (https) {
      /* eslint-disable @typescript-eslint/no-var-requires */
      this.server = require('http2').createSecureServer({
        key: readFileSync(join(this.cacheDir, 'key.pem'), 'utf8'),
        cert: readFileSync(join(this.cacheDir, 'cert.pem'), 'utf8'),
        allowHTTP1: true,
      }, app)
    } else {
      this.server = require('http').createServer(app)
      /* eslint-enable @typescript-eslint/no-var-requires */
    }

    return this.server
  }

  public async setupNginx(pwd: string, appPort: number): Promise<void> {
    this._port++
    const dir = await mkdtemp(join(tmpdir(), 'openbmclapi'))
    const confFile = `${dir}/nginx/nginx.conf`
    const confTemplate = await readFile(join(__dirname, '..', 'nginx', 'nginx.conf'), 'utf8')
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
      this.counters.bytes += parseInt(match.groups.size, 10)
    })

    this.interval = setInterval(async () => {
      await ftruncate(logFd)
    }, ms('60s'))
  }

  public async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this._port, resolve)
    })
  }

  public async connect(): Promise<void> {
    if (this.io) return
    this.io = io.connect(this.prefixUrl, {
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
    this.io.on('error', this.onConnectionError)
    this.io.on('connect_error', this.onConnectionError)
    this.io.on('reconnect_error', this.onConnectionError)
    this.io.on('connect_timeout', this.onConnectionError)
    this.io.on('reconnect_timeout', this.onConnectionError)
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
      this.io.emit('disable', null, ([err, ack]) => {
        this.isEnabled = false
        if (err || ack !== true) return reject(err || ack)
        this.io.disconnect()
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
      this.io.emit('keep-alive', {
        time: new Date(),
        ...counters,
      }, ([err, date]) => {
        if (err) return reject(err)
        this.counters.hits -= counters.hits
        this.counters.bytes -= counters.bytes
        resolve(date)
      })
    })
  }

  public async requestCert(): Promise<void> {
    const cert = await new Promise<{cert: string; key: string}>((resolve, reject) => {
      this.io.emit('request-cert', ([err, cert]) => {
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
      this.io.emit('enable', {
        host: this.host,
        port: this.publicPort,
        version: this.version,
      }, ([err, ack]) => {
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

  private async onConnectionError(err): Promise<void> {
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
