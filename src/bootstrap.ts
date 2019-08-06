import {Cluster} from './cluster'

export async function bootstrap() {
  const cluster = new Cluster(
    process.env.CLUSTER_ID,
    process.env.CLUSTER_SECRET,
  )

  const files = await cluster.getFileList()
  await cluster.syncFiles(files)
  cluster.setupExpress()
  await cluster.listen()
  await cluster.enable()
}
