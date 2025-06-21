import cluster from 'cluster'
import {config} from 'dotenv'
import {readFileSync} from 'fs'
import {random} from 'lodash-es'
import ms from 'ms'
import {fileURLToPath} from 'url'
import {bootstrap} from './bootstrap.js'
import {logger} from './logger.js'

const packageJson = JSON.parse(readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8')) as {
  version: string
}

config()
if (process.env.NO_DAEMON || !cluster.isPrimary) {
  bootstrap(packageJson.version).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    // eslint-disable-next-line n/no-process-exit
    process.exit(1)
  })
}

if (!process.env.NO_DAEMON && cluster.isPrimary) {
  forkWorker()
}

const BACKOFF_FACTOR = 2
let backoff = 1
const randomize = 0.2

function forkWorker(): void {
  const worker = cluster.fork()
  worker.on('exit', (code, signal) => {
    backoff = Math.round(Math.min(backoff * BACKOFF_FACTOR, 60) * random(1 - randomize, 1 + randomize, true))
    logger.warn(`工作进程 ${worker.id} 异常退出，code: ${code}, signal: ${signal}，${backoff}秒后重启`)
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    setTimeout(() => forkWorker(), backoff * 1000)
  })
  worker.on('message', (msg: unknown) => {
    if (msg === 'ready') {
      backoff = 1
    }
  })

  function onStop(signal: string): void {
    worker.removeAllListeners('exit')
    worker.kill(signal)
    worker.on('exit', () => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    })
    const ref = setTimeout(() => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    }, ms('30s'))
    ref.unref()
  }

  process.on('SIGINT', onStop)
  process.on('SIGTERM', onStop)
}
