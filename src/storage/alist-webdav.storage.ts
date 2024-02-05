import type {Request, Response} from 'express'
import got from 'got'
import {join} from 'path'
import {WebdavStorage} from './webdav.storage.js'

export class AlistWebdavStorage extends WebdavStorage {
  public async express(hashPath: string, req: Request, res: Response): Promise<{ bytes: number; hits: number }> {
    const path = join(this.basePath, hashPath)
    const url = this.client.getFileDownloadLink(path)
    const resp = await got.get(url, {followRedirect: false,
      responseType: 'buffer',
      https: {
        rejectUnauthorized: false,
      }})
    if (resp.statusCode === 200) {
      res.send(resp.body)
      return {bytes: resp.body.length, hits: 1}
    }
    if (resp.statusCode === 302 && resp.headers.location) {
      res.status(302).location(resp.headers.location).send()
      return {bytes: 0, hits: 1}
    }
    res.status(resp.statusCode).send(resp.body)
    return {bytes: 0, hits: 0}
  }
}
