import Bluebird from 'bluebird'
import colors from 'colors/safe.js'
import type {Request, Response} from 'express'
import fse from 'fs-extra'
import {readdir, rm, stat, unlink, writeFile} from 'fs/promises'
import {min} from 'lodash-es'
import {join, sep} from 'path'
import {logger} from '../logger.js'
import {IFileInfo, IGCCounter} from '../types.js'
import {hashToFilename} from '../util.js'
import type {IStorage} from './base.storage.js'

export class FileStorage implements IStorage {
  constructor(public readonly cacheDir: string) {}

  public async check(): Promise<boolean> {
    try {
      await fse.mkdirp(this.cacheDir)
      await writeFile(join(this.cacheDir, '.check'), '')
      return true
    } catch (e) {
      logger.error(e, '存储检查异常')
      return false
    } finally {
      await rm(join(this.cacheDir, '.check'), {recursive: true, force: true})
    }
  }

  public async writeFile(path: string, content: Buffer): Promise<void> {
    await fse.outputFile(join(this.cacheDir, path), content)
  }

  public async exists(path: string): Promise<boolean> {
    return await fse.pathExists(join(this.cacheDir, path))
  }

  public getAbsolutePath(path: string): string {
    return join(this.cacheDir, path)
  }

  public async getMissingFiles(files: IFileInfo[]): Promise<IFileInfo[]> {
    return await Bluebird.filter(
      files,
      async (file) => {
        const st = await stat(join(this.cacheDir, hashToFilename(file.hash))).catch(() => null)
        return st?.size !== file.size
      },
      {
        concurrency: 1e3,
      },
    )
  }

  public async gc(files: {path: string; hash: string; size: number}[]): Promise<IGCCounter> {
    const counter = {count: 0, size: 0}
    const fileSet = new Set<string>()
    for (const file of files) {
      fileSet.add(hashToFilename(file.hash))
    }
    const queue = [this.cacheDir]
    do {
      const dir = queue.pop()
      if (!dir) break
      const entries = await readdir(dir)
      for (const entry of entries) {
        const p = join(dir, entry)
        const s = await stat(p)
        if (s.isDirectory()) {
          queue.push(p)
          continue
        }
        const cacheDirWithSep = this.cacheDir + sep
        if (!fileSet.has(p.replace(cacheDirWithSep, ''))) {
          logger.info(colors.gray(`delete expire file: ${p}`))
          await unlink(p)
          counter.count++
          counter.size += s.size
        }
      }
    } while (queue.length !== 0)
    return counter
  }

  public async express(hashPath: string, req: Request, res: Response): Promise<{bytes: number; hits: number}> {
    const name = req.query.name as string
    if (name) {
      res.attachment(name)
    }
    const path = this.getAbsolutePath(hashPath)
    return await new Promise((resolve, reject) => {
      res.sendFile(path, {maxAge: '30d'}, (err) => {
        let bytes = res.socket?.bytesWritten ?? 0
        if (!err || err?.message === 'Request aborted' || err?.message === 'write EPIPE') {
          const header = res.getHeader('content-length')
          if (header) {
            const contentLength = parseInt(header.toString(), 10)
            bytes = min([bytes, contentLength]) ?? 0
          }
          resolve({bytes, hits: 1})
        } else {
          if (err) {
            return reject(err)
          }
          resolve({bytes: 0, hits: 0})
        }
      })
    })
  }
}
