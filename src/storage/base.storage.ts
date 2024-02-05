import type {NextFunction, Request, Response} from 'express'
import {join} from 'path'
import {cwd} from 'process'
import type {Config} from '../config.js'
import {logger} from '../logger.js'
import {AlistWebdavStorage} from './alist-webdav.storage.js'
import {FileStorage} from './file.storage.js'
import {WebdavStorage} from './webdav.storage.js'

export interface IStorage {
  init?(): Promise<void>
  writeFile(path: string, content: Buffer): Promise<void>

  exists(path: string): Promise<boolean>

  getAbsolutePath(path: string): string

  getMissingFiles<T extends {path: string; hash: string}>(files: T[]): Promise<T[]>

  gc(files: {path: string; hash: string; size: number}[]): Promise<void>

  express(hashPath: string, req: Request, res: Response, next?: NextFunction): Promise<{ bytes: number; hits: number }>
}

export function getStorage(config: Config): IStorage {
  let storage: IStorage
  switch (config.storage) {
    case 'file':
      storage = new FileStorage(join(cwd(), 'cache'))
      break
    case 'webdav':
      storage = new WebdavStorage(config.storageOpts)
      break
    case 'alist':
      storage = new AlistWebdavStorage(config.storageOpts)
      break
    default:
      throw new Error(`未知的存储类型${config.storage}`)
  }
  logger.info(`使用存储类型: ${config.storage}`)
  return storage
}
