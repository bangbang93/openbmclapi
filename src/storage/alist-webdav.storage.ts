import type {Request, Response} from 'express'
import got from 'got'
import Keyv from 'keyv'
import {KeyvFile} from 'keyv-file'
import ms from 'ms'
import {join} from 'path'
import {cwd} from 'process'
import {WebdavStorage} from './webdav.storage.js'

export class AlistWebdavStorage extends WebdavStorage {
  protected readonly redirectUrlCache = new Keyv<string>({
    namespace: 'redirectUrl',
    ttl: ms('1h'),
    store: new KeyvFile({
      filename: join(cwd(), 'cache', 'redirectUrl.json'),
    }),
  })

  public async express(hashPath: string, req: Request, res: Response): Promise<{ bytes: number; hits: number }> {
    const cachedUrl = await this.redirectUrlCache.get(hashPath)
    const size = this.getSize(this.files.get(req.params.hash)?.size ?? 0, req.headers.range)
    if (cachedUrl) {
      res.status(302).location(cachedUrl).send()
      return {bytes: size, hits: 1}
    }
    const path = join(this.basePath, hashPath)
    const url = this.client.getFileDownloadLink(path)
    const resp = await got.get(url, {followRedirect: false,
      responseType: 'buffer',
      headers: {
        range: req.headers.range,
      },
      https: {
        rejectUnauthorized: false,
      }})
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      res.status(resp.statusCode).send(resp.body)
      return {bytes: resp.body.length, hits: 1}
    }
    if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
      res.status(resp.statusCode).location(resp.headers.location).send()
      await this.redirectUrlCache.set(hashPath, resp.headers.location)
      return {bytes: size, hits: 1}
    }
    res.status(resp.statusCode).send(resp.body)
    return {bytes: 0, hits: 0}
  }
}
