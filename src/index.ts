import 'source-map-support'
import {fork, isMaster} from 'cluster'
import {config} from 'dotenv'
import {bootstrap} from './bootstrap'
import * as fs from 'fs'
import * as path from 'path'
import ms = require('ms')

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))

config()
if (process.env.NO_DAEMON || !isMaster) {
  bootstrap(packageJson.version)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err)
      process.exit(1)
    })
}

if (!process.env.NO_DEMAON && isMaster) {
  forkWorker()
}

function forkWorker(): void {
  const cluster = fork()
  cluster.on('exit', () => {
    console.log(`工作进程 ${cluster.id} 异常退出，60秒后重启`)
    setTimeout(() => forkWorker(), ms('60s'))
  })
}
