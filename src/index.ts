import cluster from 'cluster'
import {config} from 'dotenv'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'
import {bootstrap} from './bootstrap.js'

const packageJson = JSON.parse(readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'))

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

const BACKOFF_FACTOR = 2
let backoff = 1

function forkWorker(): void {
  const worker = cluster.fork()
  worker.on('exit', () => {
    console.log(`工作进程 ${worker.id} 异常退出，${backoff}秒后重启`)
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    setTimeout(() => forkWorker(), backoff * 1000)
    backoff = Math.min(backoff * BACKOFF_FACTOR, 60)
  })
  worker.on('ready', () => {
    backoff = 1
  })
}
