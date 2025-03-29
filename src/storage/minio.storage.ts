import colors from 'colors/safe.js'
import {Request, Response} from 'express'
import {BucketItem, Client} from 'minio'
import {join} from 'path'
import rangeParser from 'range-parser'
import {z} from 'zod'
import {logger} from '../logger.js'
import {IFileInfo, IGCCounter} from '../types.js'
import {IStorage} from './base.storage.js'

const storageConfigSchema = z.object({
  url: z.string(),
  internalUrl: z.string().optional(),
})

export class MinioStorage implements IStorage {
  protected files = new Map<string, {size: number; path: string}>()

  private readonly client: Client
  private readonly internalClient: Client
  private readonly prefix: string
  private readonly bucket: string

  constructor(storageConfig: unknown) {
    const config = storageConfigSchema.parse(storageConfig)
    const url = new URL(config.url)
    this.client = new Client({
      endPoint: url.hostname,
      accessKey: url.username,
      secretKey: url.password,
      port: parseInt(url.port, 10),
      useSSL: url.protocol === 'https:',
    })
    if (config.internalUrl) {
      const internalUrl = new URL(config.internalUrl)
      this.internalClient = new Client({
        endPoint: internalUrl.hostname,
        accessKey: internalUrl.username,
        secretKey: internalUrl.password,
        port: parseInt(internalUrl.port, 10),
        useSSL: internalUrl.protocol === 'https:',
      })
    } else {
      this.internalClient = this.client
    }
    const [bucket, ...prefix] = url.pathname.split('/').filter(Boolean)
    this.bucket = bucket
    this.prefix = prefix.join('/')
  }

  public async check(): Promise<boolean> {
    try {
      await this.internalClient.putObject(this.bucket, join(this.prefix, '.check'), Buffer.from(Date.now().toString()))
      await this.client.putObject(this.bucket, join(this.prefix, '.check'), Buffer.from(Date.now().toString()))
      return true
    } catch (e) {
      logger.error(e, '存储检查异常')
      return false
    } finally {
      try {
        await this.internalClient.removeObject(this.bucket, join(this.prefix, '.check'))
        await this.client.removeObject(this.bucket, join(this.prefix, '.check'))
      } catch (e) {
        logger.warn(e, '删除临时文件失败')
      }
    }
  }

  public async exists(path: string): Promise<boolean> {
    try {
      await this.internalClient.statObject(this.bucket, join(this.prefix, path))
      return true
    } catch {
      return false
    }
  }

  public async express(
    hashPath: string,
    req: Request,
    res: Response,
  ): Promise<{
    bytes: number
    hits: number
  }> {
    const path = join(this.prefix, hashPath)
    const url = await this.client.presignedGetObject(this.bucket, path, 60)
    res.redirect(url)
    const size = this.getSize(this.files.get(req.params.hash)?.size ?? 0, req.headers.range)
    return {bytes: size, hits: 1}
  }

  public async gc(files: {path: string; hash: string; size: number}[]): Promise<IGCCounter> {
    const counter = {count: 0, size: 0}
    const fileSet = new Set<string>()
    for (const file of files) {
      fileSet.add(file.hash)
    }
    const scanStream = this.internalClient.listObjectsV2(this.bucket, this.prefix)
    for await (const file of scanStream) {
      const item = file as BucketItem
      if (!item.name) continue
      const path = item.name.replace(this.prefix, '')
      if (!fileSet.has(path)) {
        logger.info(colors.gray(`delete expire file: ${path}`))
        await this.internalClient.removeObject(this.bucket, item.name)
        this.files.delete(path)
        counter.count++
        counter.size += file
      }
    }
    return counter
  }

  public async getMissingFiles(files: IFileInfo[]): Promise<IFileInfo[]> {
    const remoteFileList = new Map(files.map((file) => [file.hash, file]))
    if (this.files.size !== 0) {
      for (const hash of this.files.keys()) {
        remoteFileList.delete(hash)
      }
      return [...remoteFileList.values()]
    }

    const scanStream = this.internalClient.listObjectsV2(this.bucket, this.prefix)
    for await (const file of scanStream) {
      const item = file as BucketItem
      if (!item.name) continue
      const path = item.name.replace(this.prefix, '')
      const existsFile = remoteFileList.get(path)
      if (existsFile && existsFile.size === item.size) {
        this.files.set(path, {size: item.size, path})
        remoteFileList.delete(path)
      }
    }
    return [...remoteFileList.values()]
  }

  public async writeFile(path: string, content: Buffer, fileInfo: IFileInfo): Promise<void> {
    await this.internalClient.putObject(this.bucket, join(this.prefix, path), content)
    this.files.set(fileInfo.hash, fileInfo)
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
