import type {NextFunction, Request, Response} from 'express'
import {basename} from 'path'
import {Config} from '../config.js'
import {checkSign} from '../util.js'

export function AuthRouteFactory(config: Config) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldUrl = req.get('x-original-uri')
      if (!oldUrl) return res.status(403).send('invalid sign')

      const url = new URL(oldUrl, 'http://localhost')
      const hash = basename(url.pathname)
      const query = Object.fromEntries(url.searchParams.entries())
      const signValid = checkSign(hash, config.clusterSecret, query)
      if (!signValid) {
        return res.status(403).send('invalid sign')
      }
      res.sendStatus(204)
    } catch (e) {
      return next(e)
    }
  }
}
