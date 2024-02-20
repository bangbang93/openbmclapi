import colors from 'colors/safe.js'
import type {Request, Response} from 'express'
import {Agent} from 'node:https'
import {join} from 'path'
import rangeParser from 'range-parser'
import {createClient, type FileStat, type WebDAVClient} from 'webdav'
import {z} from 'zod'
import {fromZodError} from 'zod-validation-error'
import {logger} from '../logger.js'
import type {IFileInfo} from '../types'
import type {IStorage} from './base.storage.js'

const storageConfigSchema = z.object({
  url: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
  basePath: z.string(),
})

export class WebdavStorage implements IStorage {
  protected readonly client: WebDAVClient
  protected readonly storageConfig: z.infer<typeof storageConfigSchema>
  protected readonly basePath: string

  protected files = new Map<string, {size: number; path: string}>()

  constructor(storageConfig: unknown) {
    try {
      this.storageConfig = storageConfigSchema.parse(storageConfig)
    } catch (e) {
      if (e instanceof z.ZodError) {
        throw new Error('webdav存储选项无效', {cause: fromZodError(e)})
      } else {
        throw new Error('webdav存储选项无效', {cause: e})
      }
    }
    this.client = createClient(this.storageConfig.url, {
      username: this.storageConfig.username,
      password: this.storageConfig.password,
      httpsAgent: new Agent({rejectUnauthorized: false}),
    })
    this.basePath = this.storageConfig.basePath
  }

  public async init(): Promise<void> {
    if (!(await this.client.exists(this.basePath))) {
      logger.info(`create base path: ${this.basePath}`)
      await this.client.createDirectory(this.basePath, {recursive: true})
    }
  }

  public async writeFile(path: string, content: Buffer, fileInfo: IFileInfo): Promise<void> {
    await this.client.putFileContents(join(this.basePath, path), content)
    this.files.set(fileInfo.hash, {size: content.length, path: fileInfo.path})
  }

  public async exists(path: string): Promise<boolean> {
    return this.client.exists(join(this.basePath, path))
  }

  public getAbsolutePath(path: string): string {
    return this.client.getFileDownloadLink(join(this.basePath, path))
  }

  public async getMissingFiles<T extends {path: string; hash: string}>(files: T[]): Promise<T[]> {
    const manifest = new Map<string, T>()
    for (const file of files) {
      manifest.set(file.hash, file)
    }
    if (this.files.size !== 0) {
      for (const hash of this.files.keys()) {
        manifest.delete(hash)
      }
      return [...manifest.values()]
    }
    const queue = [this.basePath]
    do {
      const dir = queue.pop()
      if (!dir) break
      const entries = (await this.client.getDirectoryContents(dir)) as FileStat[]
      entries.sort((a, b) => a.basename.localeCompare(b.basename))
      logger.trace(`checking ${dir}`)
      for (const entry of entries) {
        if (entry.type === 'directory') {
          queue.push(entry.filename)
          continue
        }
        if (manifest.has(entry.basename)) {
          this.files.set(entry.basename, {size: entry.size, path: entry.filename})
          manifest.delete(entry.basename)
        }
      }
    } while (queue.length !== 0)
    return [...manifest.values()]
  }

  public async gc(files: {path: string; hash: string; size: number}[]): Promise<void> {
    const fileSet = new Set<string>()
    for (const file of files) {
      fileSet.add(file.hash)
    }
    const queue = [this.basePath]
    do {
      const dir = queue.pop()
      if (!dir) break
      const entries = (await this.client.getDirectoryContents(dir)) as FileStat[]
      for (const entry of entries) {
        if (entry.type === 'directory') {
          queue.push(entry.filename)
          continue
        }
        if (!fileSet.has(entry.basename)) {
          logger.info(colors.gray(`delete expire file: ${entry.filename}`))
          await this.client.deleteFile(entry.filename)
          this.files.delete(entry.basename)
        }
      }
    } while (queue.length !== 0)
  }

  public async express(hashPath: string, req: Request, res: Response): Promise<{bytes: number; hits: number}> {
    const path = join(this.basePath, hashPath)
    const file = this.client.getFileDownloadLink(path)
    res.redirect(file)
    const size = this.getSize(this.files.get(req.params.hash)?.size ?? 0, req.headers.range)
    return {bytes: size, hits: 1}
  }

  protected getSize(size: number, range?: string): number {
    if (!range) return size
    const ranges = rangeParser(size, range, {combine: true})
    if (typeof ranges === 'number') {
      return size
    }
    let total = 0
    for (const range of ranges) {
      total += range.end - range.start + 1
    }
    return total
  }
}
