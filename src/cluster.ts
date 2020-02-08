import * as Bluebird from 'bluebird'
import * as colors from 'colors/safe'
import * as express from 'express'
// eslint-disable-next-line no-duplicate-imports
import {NextFunction, Request, Response} from 'express'
import {outputFile, pathExists} from 'fs-extra'
import * as got from 'got'
import {createServer, Server} from 'http'
import {join} from 'path'
import * as ProgressBar from 'progress'
import morgan = require('morgan')
import ms = require('ms')

interface IFileList {
  files: {path: string; hash: string; size: number}[]
}

export class Cluster {
  private readonly baseUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly auth: string
  private readonly cacheDir = join(__dirname, '..', 'cache')
  private readonly host: string
  private readonly port: number
  private readonly publicPort: number
  private readonly ua: string

  private server: Server

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
    version: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.auth = `${Buffer.from(`${this.clusterId}:${this.clusterSecret}`)}`
    this.host = process.env.CLUSTER_IP
    this.port = parseInt(process.env.CLUSTER_PORT, 10)
    this.publicPort = parseInt(process.env.CLUSTER_PUBLIC_PORT, 10) || this.port
    this.ua = `openbmclapi-cluster/${version}`
  }

  public async getFileList(): Promise<IFileList> {
    const res = await got.get('/openbmclapi/files', {
      baseUrl: this.baseUrl,
      json: true,
      auth: this.auth,
      headers: {
        'user-agent': this.ua,
      },
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
      bar.tick(file.size)
      if (process.stderr.isTTY) {
        bar.interrupt(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      } else {
        console.log(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      }
      const res = await got.get(file.path, {
        auth: this.auth,
        baseUrl: this.baseUrl, query: {noopen: 1}, encoding: null,
        headers: {
          'user-agent': this.ua,
        },
      })
      await outputFile(path, res.body)
    }
  }

  public setupExpress(): Server {
    const app = express()
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
    await got.post('/openbmclapi/enable', {
      baseUrl: this.baseUrl,
      auth: this.auth,
      json: true,
      body: {
        host: this.host,
        port: this.publicPort,
      },
      headers: {
        'user-agent': this.ua,
      },
    })
  }

  public async disable(): Promise<void> {
    await got.post('/openbmclapi/disable', {
      baseUrl: this.baseUrl,
      auth: this.auth,
      headers: {
        'user-agent': this.ua,
      },
    })
  }

  public async downloadFile(hash: string): Promise<void> {
    const res = await got.get(`/openbmclapi/download/${hash}`, {
      auth: this.auth, baseUrl: this.baseUrl, query: {noopen: 1}, encoding: null,
      headers: {
        'user-agent': this.ua,
      },
    })

    const path = join(this.cacheDir, hash.substr(0, 2), hash)
    await outputFile(path, res.body)
  }

  public async keepAlive(): Promise<boolean> {
    const res = await got.post('/openbmclapi/keep-alive', {
      baseUrl: this.baseUrl,
      auth: this.auth,
      headers: {
        'user-agent': this.ua,
      },
      timeout: ms('10s'),
      throwHttpErrors: false,
    })
    return res.statusCode < 400
  }
}
