import processManager from 'pm2'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs-extra'

(async () => {
  const processName = 'Smartblock-Webhook-Receptor'

  const connect = async () => {
    return new Promise<boolean>(resolve => {
      processManager.connect((connectionError) => {
        if (connectionError) {
          console.error(connectionError)
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  const list = async (deleteProc = true, showList = false) => {
    return new Promise<boolean>(resolve => {
      processManager.list((listError, appList) => {
        if (listError) {
          console.error(listError)
          resolve(false)
        }
        if (showList) {
          appList
            .filter(app => app.name === processName)
            .forEach((app, index) => console.log(
              app.name ?? 'The application',
              `(instance ${index}) is`,
              app.pm2_env?.status
            ))
        }
        if (appList.find(app => app.name === processName) && deleteProc) {
          processManager.delete(processName, (deleteError) => {
            if (deleteError) {
              console.error(deleteError)
              resolve(false)
            }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    })
  }

  const start = async () => {
    const dotEnvConfig = (() => {
      const defaultDotEnvFile = '.env'
      const contextualDotEnvFile = defaultDotEnvFile + '.' + process.env.NODE_ENV
      return dotenv.config({
        path: path.join(
          path.resolve(process.cwd()),
          fs.existsSync(path.resolve(process.cwd(), contextualDotEnvFile))
            ? contextualDotEnvFile
            : defaultDotEnvFile // If not found, the application will not be started
        )
      })
    })()
    if (dotEnvConfig.error) {
      throw dotEnvConfig.error
    }
    return new Promise<boolean>(resolve => {
      processManager.start(
        'yarn start:prod',
        {
          env: {
            NODE_ENV: process.env.NODE_ENV ?? 'development',
            PORT: process.env.PORT ?? '5000'
          },
          watch: true,
          name: processName
        },
        (startError) => {
          if (startError) {
            console.error(startError)
            resolve(false)
          }
          resolve(true)
        }
      )
    })
  }

  if (await connect()) {
    if (await list()) {
      if (await start()) {
        await list(false, true)
        processManager.disconnect()
      }
    }
  }
})()
