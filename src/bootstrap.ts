import * as colors from 'colors/safe'
import {Cluster} from './cluster'

export async function bootstrap(): Promise<void> {
  if (!process.env.CLUSTER_PORT) {
    throw new Error('missing CLUSTER_HOST or CLUSTER_PORT')
  }
  const cluster = new Cluster(
    process.env.CLUSTER_ID,
    process.env.CLUSTER_SECRET,
  )

  const files = await cluster.getFileList()
  await cluster.syncFiles(files)
  cluster.setupExpress()
  await cluster.listen()
  await cluster.enable()
  // eslint-disable-next-line no-console
  console.log(colors.rainbow(`done, serving ${files.files.length} files`))

  const onStop = async (): Promise<void> => {
    await cluster.disable()
    // eslint-disable-next-line no-console
    console.log('unregister success')
    process.exit(0)
  }
  process.on('SIGTERM', onStop)
  process.on('SIGINT', onStop)
}
