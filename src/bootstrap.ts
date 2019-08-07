import * as colors from 'colors/safe'
import {Cluster} from './cluster'

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
  // eslint-disable-next-line no-console
  console.log(colors.rainbow(`done, serving ${files.files.length} files`))

  const onStop = async (): Promise<void> => {
    await cluster.disable()
    // eslint-disable-next-line no-console
    console.log('unregister success, waiting for background task')
    server.close()
  }
  process.on('SIGTERM', onStop)
  process.on('SIGINT', onStop)
}
