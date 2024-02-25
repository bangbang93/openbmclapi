import {pino} from 'pino'

export const logger = pino({
  level: process.env.LOGLEVEL || 'info',
  transport: process.env.PLAIN_LOG
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          singleLine: true,
        },
      },
})
