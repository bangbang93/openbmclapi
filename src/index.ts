import {config} from 'dotenv'
import {bootstrap} from './bootstrap'

config()
bootstrap()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
