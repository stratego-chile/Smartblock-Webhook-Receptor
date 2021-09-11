import { Application, Express } from 'express'
import { isConfigurationAvailable } from './helpers/deploy-assist'
import fs from 'fs-extra'
import https from 'https'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'

export const saveLogs = (application: Application | Express) => {
  const LOGS_PATH = path.resolve(__dirname, '..', 'logs')
  if (!fs.pathExistsSync(LOGS_PATH)) {
    fs.mkdirpSync(LOGS_PATH)
  }
  const currentDate = new Date()
  const initialLogName = [
    `${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDay()}`,
    process.env.NODE_ENV
  ].join('.').concat('.log')
  let logName = initialLogName
  let instanceCounter: number = 1
  while (fs.existsSync(logName)) {
    logName = logName + '.' + instanceCounter
    instanceCounter++
  }
  application.use(
    morgan('combined',
      { stream: fs.createWriteStream(path.resolve(LOGS_PATH, logName), { flags: 'a' }) }
    )
  )
  return application
}

const Bootstrap = async (application: Application | Express, port: number) => {
  dotenv.config({
    path: path.resolve(__dirname, '..', process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
  })
  if (process.env.SAVE_LOGS === 'yes') {
    application = saveLogs(application)
  } else {
    application.use(morgan('combined'))
  }
  if (await isConfigurationAvailable()) {
    const ExpressApplication = process.env.USE_SSL === 'yes'
      ? https.createServer({
        cert: fs.readFileSync(process.env.SSL_CERT ?? path.resolve(__dirname, '..', '.ssl', 'cert.pem')),
        key: fs.readFileSync(process.env.SSL_KEY ?? path.resolve(__dirname, '..', '.ssl', 'key.pem'))
      }, application)
      : application
    ExpressApplication
      .listen(port)
      .on('error', (reason) => {
        throw new Error(`[${reason.name}]: ${reason.message}`)
      })
  }
}

export default Bootstrap
