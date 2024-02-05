import {join} from 'path'
import {cwd} from 'process'
import type {Config} from '../config.js'
import {FileStorage} from './file.storage.js'

export interface IStorage {
  writeFile(path: string, content: Buffer): Promise<void>

  exists(path: string): Promise<boolean>

  getAbsolutePath(path: string): string

  gc(files: {path: string; hash: string; size: number}[]): Promise<void>
}

export function getStorage(config: Config): IStorage {
  return new FileStorage(join(cwd(), 'cache'))
}
