import processManager from 'pm2'

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
          appList.forEach(app => console.log(app.name ?? 'The application', 'is', app.pm2_env?.status))
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
    return new Promise<boolean>(resolve => {
      processManager.start(
        process.env.USE_SSL === 'yes' ? 'yarn start:prod' : 'yarn start:prod:ssl',
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
