import { Application, Express } from 'express'
import Bootstrap from '../boostrap'

const launchApplication = (application: Application | Express, port: number) => {
  Bootstrap(application, port)
    .then(() => {
      console.clear()
      console.log('\x1b[1m\x1b[34m%s\x1b[0m', 'Webhook Receptor Started', '\n')
      console.log('Using SSL? %s', process.env.USE_SSL === 'yes' ? '\x1b[32mYes\x1b[0m' : '\x1b[32mNo\x1b[0m')
      console.log('Environment: \x1b[33m%s\x1b[0m', process.env.NODE_ENV)
      console.log('Platform: %s', process.platform)
      console.log('Save logs: %s', process.env.SAVE_LOGS ? 'Yes' : 'No')
      console.log('\nExpressJS application listening on port \x1b[1m%i\x1b[0m. Logs will be printed bellow:\n', port)
    })
    .catch((reason) => {
      console.log('Application deploy error. See details bellow:\n')
      console.error(reason)
    })
}

export default launchApplication
