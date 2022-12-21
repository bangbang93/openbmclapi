import cluster from 'cluster'
import {config} from 'dotenv'
import * as fs from 'fs'
import ms from 'ms'
import * as path from 'path'
import 'source-map-support'
import {bootstrap} from './bootstrap'

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))

config()
if (process.env.NO_DAEMON || !cluster.isPrimary) {
  bootstrap(packageJson.version)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err)
      process.exit(1)
    })
}

if (!process.env.NO_DEMAON && cluster.isPrimary) {
  forkWorker()
}

function forkWorker(): void {
  const worker = cluster.fork()
  worker.on('exit', () => {
    console.log(`工作进程 ${worker.id} 异常退出，60秒后重启`)
    setTimeout(() => forkWorker(), ms('60s'))
  })
}
