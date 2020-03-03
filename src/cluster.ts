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
import morgan = require('morgan')
import Socket = SocketIOClient.Socket

interface IFileList {
  files: {path: string; hash: string; size: number}[]
}

export class Cluster {
  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly cacheDir = join(__dirname, '..', 'cache')
  private readonly host: string
  private readonly port: number
  private readonly publicPort: number
  private readonly ua: string
  private readonly got: Got
  private readonly requestCache = new Map()
  private readonly io: Socket

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
    this.io = io.connect(`${this.prefixUrl}`, {
      transports: ['websocket'],
      query: {
        clusterId: this.clusterId, clusterSecret: this.clusterSecret,
      },
    })
    this.io.on('connect', () => console.log('connected'))
    this.io.on('message', (msg) => console.log(msg))
    this.io.on('disconnect', () => console.log('disconnect'))
    this.io.on('error', (err) => console.error(err))
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
        return res.sendFile(path)
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
    return new Promise((resolve, reject) => {
      this.io.emit('enable', {
        host: this.host,
        port: this.publicPort,
        version: this.version,
      }, (ack) => {
        if (ack !== true) return reject(ack)
        resolve()
      })
    })
  }

  public async disable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.io.emit('disable', null, (ack) => {
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
    return new Promise((resolve) => {
      this.io.emit('keep-alive', new Date(), (date) => {
        resolve(date)
      })
    })
  }
}
