import {config} from 'dotenv'
import {bootstrap} from './bootstrap'
import * as fs from 'fs'
import * as path from 'path'

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))

config()
bootstrap(packageJson.version)
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
