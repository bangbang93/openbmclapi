import * as Bluebird from 'bluebird'
import * as colors from 'colors/safe'
import * as express from 'express'
// eslint-disable-next-line no-duplicate-imports
import {NextFunction, Request, Response} from 'express'
import {outputFile, pathExists} from 'fs-extra'
import got, {Got} from 'got'
import {createServer, Server} from 'http'
import {join} from 'path'
import * as ProgressBar from 'progress'
import * as io from 'socket.io-client'
import clone = require('lodash.clone')
import morgan = require('morgan')
import ms = require('ms')
import Timeout = NodeJS.Timeout
import Socket = SocketIOClient.Socket

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

  private keepAliveError = 0
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly cacheDir = join(__dirname, '..', 'cache')
  private readonly host: string
  private readonly port: number
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private io: Socket

  private server: Server

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
    private readonly version: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.host = process.env.CLUSTER_IP
    this.port = parseInt(process.env.CLUSTER_PORT, 10)
    this.publicPort = parseInt(process.env.CLUSTER_PUBLIC_PORT, 10) || this.port
    this.ua = `openbmclapi-cluster/${version}`
    this.got = got.extend({
      prefixUrl: this.prefixUrl,
      username: this.clusterId,
      password: this.clusterSecret,
      headers: {
        'user-agent': this.ua,
      },
      responseType: 'buffer',
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
  }

  public setupExpress(): Server {
    const app = express()
    app.enable('trust proxy')
    app.use(morgan('combined'))
    app.use('/download/:hash', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash
        const path = join(this.cacheDir, hash.substr(0, 2), hash)
        if (!await pathExists(path)) {
          await this.downloadFile(hash)
        }
        const name = req.query.name
        if (name) {
          res.attachment(name)
        }
        return res.sendFile(path, {maxAge: '30d'}, (err) => {
          if (err) return next(err)
          this.counters.bytes += Number(res.getHeader('content-length'))
          this.counters.hits++
        })
      } catch (err) {
        return next(err)
      }
    })
    this.server = createServer(app)

    return this.server
  }

  public async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, resolve)
    })
  }

  public async enable(): Promise<void> {
    if (this.isEnabled) return
    this.io = io.connect(`${this.prefixUrl}`, {
      transports: ['websocket'],
      query: {
        clusterId: this.clusterId, clusterSecret: this.clusterSecret,
      },
    })
    this.io.on('connect', async () => {
      console.log('connected')
      try {
        await this._enable()
      } catch (e) {
        console.error(e)
      }
      this.isEnabled = true
    })
    this.io.on('message', (msg) => console.log(msg))
    this.io.on('disconnect', (reason: string) => {
      console.log(`disconnected: ${reason}`)
      this.isEnabled = false
      clearTimeout(this.keepAliveInterval)
    })
    this.io.on('error', (err) => console.error(err))
    this.io.on('connect_error', this.onConnectionError)
    this.io.on('reconnect_error', this.onConnectionError)
    this.io.on('connect_timeout', this.onConnectionError)
    this.io.on('reconnect_timeout', this.onConnectionError)
  }

  public async disable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.io.emit('disable', null, (ack) => {
        this.isEnabled = false
        if (ack !== true) return reject(ack)
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

    const path = join(this.cacheDir, hash.substr(0, 2), hash)
    await outputFile(path, res.body)
  }

  public async keepAlive(): Promise<boolean> {
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
        this.keepAliveInterval = setTimeout(this._keepAlive.bind(this), ms('1m'))
      })
    }).timeout(ms('1m'), 'enable request timeout')
  }

  private async _keepAlive(): Promise<void> {
    try {
      const status = await Bluebird.try(async () => this.keepAlive()).timeout(ms('10s'))
      if (!status) {
        console.log('kicked by server')
        process.exit(1)
      }
      this.keepAliveError = 0
    } catch (e) {
      this.keepAliveError++
      console.error('keep alive error')
      console.error(e)
      if (this.keepAliveError >= 5) {
        console.error('exit')
        await Bluebird.try(async () => {
          await this.disable()
          await this.enable()
        })
          .timeout(ms('30s'))
          .catch((e) => {
            console.error(e, 'restart failed')
            process.exit(1)
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
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  }
}
