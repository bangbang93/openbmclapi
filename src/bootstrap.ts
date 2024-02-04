import nodeCluster from 'cluster'
import colors from 'colors/safe.js'
import {HTTPError} from 'got'
import ms from 'ms'
import {join} from 'path'
import {fileURLToPath} from 'url'
import {Cluster} from './cluster.js'
import {config} from './config.js'
import {logger} from './logger.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function bootstrap(version: string): Promise<void> {
  logger.info(`booting openbmclapi ${version}`)
  const cluster = new Cluster(
    config.clusterId,
    config.clusterSecret,
    version,
  )

  const files = await cluster.getFileList()
  logger.info(`${files.files.length} files`)
  try {
    await cluster.syncFiles(files)
  } catch (e) {
    if (e instanceof HTTPError) {
      logger.error({url: e.response.url}, 'download error')
    }
    throw e
  }

  cluster.connect()
  const proto = config.byoc ? 'http' : 'https'
  if (proto === 'https') {
    logger.info('请求证书')
    await cluster.requestCert()
  }
  if (config.enableNginx) {
    if (typeof cluster.port === 'number') {
      await cluster.setupNginx(join(__dirname, '..'), cluster.port, proto)
    } else {
      throw new Error('cluster.port is not a number')
    }
  }
  const server = cluster.setupExpress(proto === 'https' && !config.enableNginx)
  try {
    await cluster.listen()
    await cluster.enable()
  } catch (e) {
    logger.fatal(e)
    cluster.exit(1)
  }
  logger.info(colors.rainbow(`done, serving ${files.files.length} files`))
  if (nodeCluster.isWorker && typeof process.send === 'function') {
    process.send('ready')
  }

  let checkFileInterval = setTimeout(checkFile, ms('10m'))
  async function checkFile(): Promise<void> {
    logger.debug('refresh files')
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
