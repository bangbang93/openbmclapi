import * as colors from 'colors/safe'
import {Cluster} from './cluster'
import ms = require('ms')

export async function bootstrap(version: string): Promise<void> {
  if (!process.env.CLUSTER_PORT) {
    throw new Error('missing CLUSTER_PORT')
  }
  const cluster = new Cluster(
    process.env.CLUSTER_ID,
    process.env.CLUSTER_SECRET,
    version,
  )

  const files = await cluster.getFileList()
  await cluster.syncFiles(files)
  const server = cluster.setupExpress()
  await cluster.listen()
  await cluster.enable()
  console.log(colors.rainbow(`done, serving ${files.files.length} files`))

  let keepAliveInterval = setTimeout(keepAlive, ms('1m'))
  async function keepAlive(): Promise<void> {
    await cluster.keepAlive()
    keepAliveInterval = setTimeout(keepAlive, ms('1m'))
  }

  let checkFileInterval = setTimeout(checkFile, ms('10m'))
  async function checkFile(): Promise<void> {
    console.log(colors.gray('refresh files'))
    const files = await cluster.getFileList()
    await cluster.syncFiles(files)
    checkFileInterval = setTimeout(checkFile, ms('10m'))
  }

  let stopping = false
  const onStop = async (): Promise<void> => {
    if (stopping) process.exit(0)
    stopping = true
    await cluster.disable()
    clearInterval(keepAliveInterval)
    clearInterval(checkFileInterval)

    // eslint-disable-next-line no-console
    console.log('unregister success, waiting for background task, ctrl+c again to force kill')
    server.close()
  }
  process.on('SIGTERM', onStop)
  process.on('SIGINT', onStop)
}
