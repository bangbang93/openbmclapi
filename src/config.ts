import dotenv from 'dotenv'
import {z} from 'zod'

export class Config {
  public static instance: Config

  public readonly clusterId: string
  public readonly clusterSecret: string
  public readonly clusterIp?: string
  public readonly port: number = 4000
  public readonly clusterPublicPort?: number
  public readonly byoc: boolean = false
  public readonly disableAccessLog: boolean = false

  public readonly enableNginx: boolean = false
  public readonly storage: string = 'file'
  public readonly storageOpts: unknown

  private constructor() {
    if (!process.env.CLUSTER_ID) {
      throw new Error('CLUSTER_ID is not set')
    }
    this.clusterId = process.env.CLUSTER_ID
    if (!process.env.CLUSTER_SECRET) {
      throw new Error('CLUSTER_SECRET is not set')
    }
    this.clusterSecret = process.env.CLUSTER_SECRET
    this.clusterIp = process.env.CLUSTER_IP
    if (process.env.CLUSTER_PORT) {
      this.port = parseInt(process.env.CLUSTER_PORT, 10)
      if (isNaN(this.port)) {
        throw new Error('CLUSTER_PORT is not a number')
      }
    }
    this.clusterPublicPort = process.env.CLUSTER_PUBLIC_PORT ? parseInt(process.env.CLUSTER_PUBLIC_PORT, 10) : undefined
    if (typeof this.clusterPublicPort === 'number' && isNaN(this.clusterPublicPort)) {
      throw new Error('CLUSTER_PUBLIC_PORT is not a number')
    }
    this.byoc = process.env.CLUSTER_BYOC === 'true'
    this.enableNginx = process.env.ENABLE_NGINX === 'true'
    if (process.env.CLUSTER_STORAGE) {
      this.storage = process.env.CLUSTER_STORAGE
    }
    if (process.env.CLUSTER_STORAGE_OPTIONS) {
      this.storageOpts = JSON.parse(process.env.CLUSTER_STORAGE_OPTIONS)
    }
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }
}

export const OpenbmclapiAgentConfigurationSchema = z.object({
  sync: z.object({
    source: z.string(),
    concurrency: z.number(),
  }),
})

export type OpenbmclapiAgentConfiguration = z.infer<typeof OpenbmclapiAgentConfigurationSchema>

dotenv.config()

export const config = Config.getInstance()
