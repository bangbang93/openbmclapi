import OSS from 'ali-oss'
import colors from 'colors/safe.js'
import {Request, Response} from 'express'
import Keyv from 'keyv'
import ms from 'ms'
import {pipeline} from 'node:stream/promises'
import {basename, join} from 'path'
import {z} from 'zod'
import {logger} from '../logger.js'
import {IFileInfo, IGCCounter} from '../types.js'
import {getSize} from '../util.js'
import {IStorage} from './base.storage.js'

const storageConfigSchema = z.object({
  accessKeyId: z.string(),
  accessKeySecret: z.string(),
  bucket: z.string(),
  internal: z.boolean().default(false),
  prefix: z.string().default(''),
  proxy: z.boolean().default(true),
  endpoint: z.string().optional(),
  region: z.string().optional(),
  cname: z.boolean().optional(),
})

export class OssStorage implements IStorage {
  /** Map<hash, FileInfo> */
  protected files = new Map<string, {size: number; path: string}>()
  protected existsCache = new Keyv({
    ttl: ms('1h'),
  })

  private readonly client: OSS
  private readonly prefix: string
  private readonly config: z.infer<typeof storageConfigSchema>

  constructor(storageConfig: unknown) {
    const config = storageConfigSchema.parse(storageConfig)
    this.config = config
    this.client = new OSS({...config})
    this.prefix = config.prefix
  }

  public async check(): Promise<boolean> {
    try {
      await this.client.put(join(this.prefix, '.check'), Buffer.from(Date.now().toString()))
      return true
    } catch (e) {
      logger.error(e, '存储检查异常')
      return false
    } finally {
      try {
        await this.client.delete(join(this.prefix, '.check'))
      } catch (e) {
        logger.warn(e, '删除临时文件失败')
      }
    }
  }

  public async exists(path: string): Promise<boolean> {
    try {
      if (await this.existsCache.has(path)) {
        return true
      }
      await this.client.head(join(this.prefix, path))
      await this.existsCache.set(path, true)
      return true
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'NoSuchKeyError') {
          return false
        }
      }
      throw e
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
    let resHeaders: OSS.ResponseHeaderType | undefined
    const fileInfo = this.files.get(hashPath)
    if (fileInfo) {
      const name = basename(fileInfo.path)
      resHeaders = {
        'content-disposition': `attachment; filename="${encodeURIComponent(name)}"`,
      }
    }
    if (this.config.proxy) {
      const stream = await this.client.getStream(path)
      await pipeline(stream.stream, res)
    } else {
      const url = this.client.signatureUrl(path, {
        expires: 60,
        response: resHeaders,
      })
      res.redirect(url)
    }
    const size = getSize(this.files.get(req.params.hash)?.size ?? 0, req.headers.range)
    return await Promise.resolve({bytes: size, hits: 1})
  }

  public async gc(files: {path: string; hash: string; size: number}[]): Promise<IGCCounter> {
    const counter = {count: 0, size: 0}
    const fileSet = new Set<string>()
    for (const file of files) {
      fileSet.add(file.hash)
    }
    let list = await this.client.list({prefix: this.prefix, 'max-keys': 1000}, {})
    while (list.objects.length > 0) {
      for (const item of list.objects) {
        if (!item.name) continue
        const path = basename(item.name.replace(this.prefix, ''))
        if (!fileSet.has(path)) {
          logger.info(colors.gray(`delete expire file: ${path}`))
          await this.client.delete(item.name)
          this.files.delete(path)
          counter.count++
          counter.size += item.size
        }
      }
      if (!list.isTruncated) break
      list = await this.client.list({prefix: this.prefix, marker: list.nextMarker, 'max-keys': 1000}, {})
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

    let list = await this.client.list({prefix: this.prefix, 'max-keys': 1000}, {})
    while (list.objects.length > 0) {
      for (const item of list.objects) {
        if (!item.name) continue
        const hash = basename(item.name)
        const existsFile = remoteFileList.get(hash)
        if (existsFile && existsFile.size === item.size) {
          this.files.set(hash, {size: item.size, path: item.name.replace(this.prefix, '')})
          remoteFileList.delete(hash)
        }
      }
      if (!list.isTruncated) break
      list = await this.client.list({prefix: this.prefix, marker: list.nextMarker, 'max-keys': 1000}, {})
    }
    return [...remoteFileList.values()]
  }

  public async writeFile(path: string, content: Buffer, fileInfo: IFileInfo): Promise<void> {
    await this.client.put(join(this.prefix, path), content)
    this.files.set(fileInfo.hash, fileInfo)
  }
}
