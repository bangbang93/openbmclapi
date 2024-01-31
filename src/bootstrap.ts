import nodeCluster from 'cluster'
import colors from 'colors/safe.js'
import {HTTPError} from 'got'
import ms from 'ms'
import {join} from 'path'
import {fileURLToPath} from 'url'
import {Cluster} from './cluster.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function bootstrap(version: string): Promise<void> {
  console.log(colors.green(`booting openbmclapi ${version}`))
  if (!process.env.CLUSTER_PORT) {
    throw new Error('missing CLUSTER_PORT')
  }
  const cluster = new Cluster(
    process.env.CLUSTER_ID!,
    process.env.CLUSTER_SECRET!,
    version,
  )

  const files = await cluster.getFileList()
  console.log(colors.green(`${files.files.length} files`))
  try {
    await cluster.syncFiles(files)
  } catch (e) {
    if (e instanceof HTTPError) {
      console.error(colors.red(e.response.url))
    }
    throw e
  }

  await cluster.connect()
  const proto = process.env.CLUSTER_BYOC !== 'true' ? 'https' : 'http'
  if (proto === 'https') {
    console.log('请求证书')
    await cluster.requestCert()
  }
  if (process.env.ENABLE_NGINX) {
    if (typeof cluster.port === 'number') {
      await cluster.setupNginx(join(__dirname, '..'), cluster.port, proto)
    } else {
      throw new Error('cluster.port is not a number')
    }
  }
  const server = cluster.setupExpress(proto === 'https' && !process.env.ENABLE_NGINX)
  try {
    await cluster.listen()
    await cluster.enable()
  } catch (e) {
    console.error(e)
    cluster.exit(1)
  }
  console.log(colors.rainbow(`done, serving ${files.files.length} files`))
  if (nodeCluster.isWorker && typeof process.send === 'function') {
    process.send('ready')
  }

  let checkFileInterval = setTimeout(checkFile, ms('10m'))
  async function checkFile(): Promise<void> {
    console.log(colors.gray('refresh files'))
    try {
      const files = await cluster.getFileList()
      await cluster.syncFiles(files)
    } finally {
      checkFileInterval = setTimeout(() => {
        checkFile()
          .catch((e) => {
            console.error('check file error')
            console.error(e)
          })
      }, ms('10m'))
    }
  }

  let stopping = false
  const onStop = async (signal: NodeJS.Signals): Promise<void> => {
    console.log(`got ${signal}, unregistering cluster`)
    if (stopping) process.exit(0)

    stopping = true
    clearTimeout(checkFileInterval)
    if (cluster.interval) {
      clearInterval(cluster.interval)
    }
    await cluster.disable()

    // eslint-disable-next-line no-console
    console.log('unregister success, waiting for background task, ctrl+c again to force kill')
    server.close()
    cluster.nginxProcess?.kill()
  }
  process.on('SIGTERM', onStop)
  process.on('SIGINT', onStop)
}
