import * as express from 'express'
// eslint-disable-next-line no-duplicate-imports
import {Express, Request, Response} from 'express'
import {outputFile, pathExists} from 'fs-extra'
import * as got from 'got'
import {join} from 'path'

interface IFileList {
  files: {path: string; hash: string}[]
}

export class Cluster {
  private readonly baseUrl = 'http://localhost:4000'
  private readonly auth: string
  private readonly cacheDir = join(__dirname, '../cache')

  private express: Express

  public constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
  ) {
    if (!clusterId || !clusterSecret) throw new Error('missing config')
    this.auth = `${Buffer.from(`${this.clusterId}:${this.clusterSecret}`)}`
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
    for (const file of fileList.files) {
      const path = join(this.cacheDir, file.hash.substr(0, 2), file.hash)
      if (await pathExists(path)) {
        continue
      }
      const res = await got.get(file.path, {baseUrl: this.baseUrl, query: {noopen: 1}, encoding: null})
      await outputFile(path, res.body)
    }
  }

  public setupExpress(): Express {
    this.express = express()
    this.express.use('/download/:hash', (req: Request, res: Response) => {
      const hash = req.params.hash
      res.sendFile(join(this.cacheDir, hash.substr(0, 2), hash))
    })

    return this.express
  }

  public async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.express.listen(4001, resolve)
    })
  }

  public async enable(): Promise<void> {
    await got.post('/openbmclapi/enable', {
      baseUrl: this.baseUrl,
      auth: this.auth,
      json: true,
      body: {
        host: 'localhost',
        port: 4001,
      },
    })
  }
}
