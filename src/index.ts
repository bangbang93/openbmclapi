import {config} from 'dotenv'
import {bootstrap} from './bootstrap'
import * as packageJson from '../package.json'

config()
bootstrap(packageJson.version)
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
