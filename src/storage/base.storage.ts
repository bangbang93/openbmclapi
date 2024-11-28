import type {NextFunction, Request, Response} from 'express'
import {join} from 'path'
import type {Config} from '../config.js'
import {logger} from '../logger.js'
import {IFileInfo, IGCCounter} from '../types.js'
import {AlistWebdavStorage} from './alist-webdav.storage.js'
import {FileStorage} from './file.storage.js'

export interface IStorage {
  init?(): Promise<void>

  check(): Promise<boolean>

  writeFile(path: string, content: Buffer, fileInfo: IFileInfo): Promise<void>

  exists(path: string): Promise<boolean>

  getAbsolutePath(path: string): string

  getMissingFiles(files: IFileInfo[]): Promise<IFileInfo[]>

  gc(files: {path: string; hash: string; size: number}[]): Promise<IGCCounter>

  express(hashPath: string, req: Request, res: Response, next?: NextFunction): Promise<{bytes: number; hits: number}>
}

export function getStorage(config: Config): IStorage {
  let storage: IStorage
  switch (config.storage) {
    case 'file':
      storage = new FileStorage(join(process.cwd(), 'cache'))
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
