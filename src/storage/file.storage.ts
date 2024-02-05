import colors from 'colors/safe.js'
import fse from 'fs-extra'
import {readdir, stat, unlink} from 'fs/promises'
import {join, sep} from 'path'
import {logger} from '../logger.js'
import {hashToFilename} from '../util.js'
import type {IStorage} from './base.storage.js'

export class FileStorage implements IStorage {
  constructor(
    public readonly cacheDir: string,
  ) {}

  public async writeFile(path: string, content: Buffer): Promise<void> {
    await fse.outputFile(join(this.cacheDir, path), content)
  }

  public async exists(path: string): Promise<boolean> {
    return fse.pathExists(join(this.cacheDir, path))
  }

  public getAbsolutePath(path: string): string {
    return join(this.cacheDir, path)
  }

  public async gc(files: {path: string; hash: string; size: number}[]): Promise<void> {
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
        }
      }
    } while (queue.length !== 0)
  }
}
