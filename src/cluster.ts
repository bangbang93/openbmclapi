import * as colors from 'colors/safe'
// eslint-disable-next-line no-duplicate-imports
import * as express from 'express'
import {Express, NextFunction, Request, Response} from 'express'
import {outputFile, pathExists} from 'fs-extra'
import * as got from 'got'
import {join} from 'path'
import * as ProgressBar from 'progress'
import morgan = require('morgan')

interface IFileList {
  files: {path: string; hash: string}[]
}

export class Cluster {
  private readonly baseUrl = process.env.CLUSTER_BMCLAPI || 'https://openbmclapi.bangbang93.com'
  private readonly auth: string
  private readonly cacheDir = join(__dirname, '../cache')
  private readonly host: string
  private readonly port: number

  private express: Express

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.auth = `${Buffer.from(`${this.clusterId}:${this.clusterSecret}`)}`
    this.host = process.env.CLUSTER_IP
    this.port = parseInt(process.env.CLUSTER_PORT, 10)
  }

  public async getFileList(): Promise<IFileList> {
    const res = await got.get('/openbmclapi/files', {
      baseUrl: this.baseUrl,
      json: true,
      auth: this.auth,
    })
    return res.body
  }

  public async syncFiles(fileList: IFileList): Promise<void> {
    const bar = new ProgressBar('build file info [:bar] :current/:total eta:etas :percent :rate/cps', {
      total: fileList.files.length,
      width: 50,
    })
    for (const file of fileList.files) {
      bar.tick()
      const path = join(this.cacheDir, file.hash.substr(0, 2), file.hash)
      if (await pathExists(path)) {
        continue
      }
      bar.interrupt(`${colors.green('downloading')} ${colors.underline(file.path)}`)
      const res = await got.get(file.path, {baseUrl: this.baseUrl, query: {noopen: 1}, encoding: null})
      await outputFile(path, res.body)
    }
  }

  public setupExpress(): Express {
    const app = this.express = express()
    app.use(morgan('dev'))
    app.use('/download/:hash', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hash = req.params.hash
        const path = join(this.cacheDir, hash.substr(0, 2), hash)
        if (!await pathExists(path)) {
          await this.downloadFile(hash)
        }
        return res.sendFile(path)
      } catch (err) {
        return next(err)
      }
    })

    return this.express
  }

  public async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.express.listen(this.port, resolve)
    })
  }

  public async enable(): Promise<void> {
    await got.post('/openbmclapi/enable', {
      baseUrl: this.baseUrl,
      auth: this.auth,
      json: true,
      body: {
        host: this.host,
        port: this.port,
      },
    })
  }

  public async disable(): Promise<void> {
    await got.post('/openbmclapi/disable', {
      baseUrl: this.baseUrl,
      auth: this.auth,
    })
  }

  public async downloadFile(hash: string): Promise<void> {
    const res = await got.get(`/openbmclapi/download/${hash}`,
      {auth: this.auth, baseUrl: this.baseUrl, query: {noopen: 1}, encoding: null})

    const path = join(this.cacheDir, hash.substr(0, 2), hash)
    await outputFile(path, res.body)
  }
}
