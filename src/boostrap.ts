import { Application, Express } from 'express'
import { dotEnvConfig, isConfigurationAvailable, servicePort } from './helpers/deploy-assist'
import { MorganLoggerMode } from './types'
import fsExtra from 'fs-extra'
import https from 'https'
import path from 'path'
import morgan from 'morgan'
import winston from 'winston'

export const useLogStream = () => {
  const LOGS_PATH = path.resolve(process.cwd(), 'logs')
  if (!fsExtra.pathExistsSync(LOGS_PATH)) {
    fsExtra.mkdirpSync(LOGS_PATH)
  }
  const currentDate = new Date()
  const logFileName = path.join(
    LOGS_PATH,
    [
      `${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}`,
      process.env.NODE_ENV ?? 'no-env'
    ].join('.').concat('.')
  )
  const Logger = winston.createLogger({
    exitOnError: false,
    transports: [
      new winston.transports.File({
        level: 'error',
        filename: logFileName.concat('error.log'),
        format: winston.format.json()
      }),
      new winston.transports.File({
        level: 'info',
        filename: logFileName.concat('log'),
        format: winston.format.json()
      })
    ]
  })
  return {
    write: (message: string) => {
      Logger.info(message)
    }
  }
}

const Bootstrap = async (application: Application | Express, port: number) => {
  if (await isConfigurationAvailable()) {
    const morganFormat: MorganLoggerMode = 'common'
    if (process.env.SAVE_LOGS === 'yes') {
      application.use(morgan(
        morganFormat,
        { stream: useLogStream() }
      ))
    }
    const ExpressApplication = process.env.USE_SSL === 'yes'
      ? https.createServer(
        {
          cert: fsExtra.readFileSync(process.env.SSL_CERT ?? path.resolve(process.cwd(), '.ssl', 'cert.pem')),
          key: fsExtra.readFileSync(process.env.SSL_KEY ?? path.resolve(process.cwd(), '.ssl', 'key.pem'))
        },
        application
      )
      : application
    ExpressApplication
      .listen(port)
      .on('error', (reason) => {
        throw new Error(`[${reason.name}]: ${reason.message}`)
      })
  }
}

const LaunchApplication = (application: Application | Express, port = servicePort) => {
  if (dotEnvConfig.error) {
    throw dotEnvConfig.error
  }
  Bootstrap(application, port)
    .then(() => {
      console.clear()
      ;([
        ['\x1b[1m\x1b[34m%s\x1b[0m', 'Webhook Receptor Started', '\n'],
        ['Using SSL? %s', process.env.USE_SSL === 'yes' ? '\x1b[32mYes\x1b[0m' : '\x1b[32mNo\x1b[0m'],
        ['Environment: \x1b[33m%s\x1b[0m', process.env.NODE_ENV],
        ['Platform: %s', process.platform],
        ['Save logs: %s', process.env.SAVE_LOGS ? 'Yes' : 'No'],
        ['\nExpressJS application listening on port \x1b[1m%i\x1b[0m. Logs will be printed bellow:\n', port]
      ]).forEach(map => console.log(...map))
    })
    .catch((reason) => {
      console.log('Application deploy error. See details bellow:\n')
      console.error(reason)
    })
}

export default LaunchApplication
