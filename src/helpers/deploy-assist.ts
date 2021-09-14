import portfinder from 'portfinder'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs-extra'
import prompts from 'prompts'

type AvailablePortDef = {
  isAvailable: boolean
  alternative?: number
}

const resolveDotEnvConfig = () => {
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
}

export const dotEnvConfig = resolveDotEnvConfig()

export const isPortAvailable = async (port: number): Promise<AvailablePortDef> => {
  const availablePort = await portfinder.getPortPromise({
    host: '127.0.0.1',
    port,
    stopPort: port + 500
  })
  return {
    isAvailable: availablePort === port,
    alternative: availablePort
  }
}

export let servicePort = parseInt(process.env.PORT ?? (4000).toString())

export const isConfigurationAvailable = async (): Promise<boolean> => {
  let { isAvailable } = await isPortAvailable(servicePort)
  while (!isAvailable) {
    const PromptResult = await prompts({
      type: 'number',
      name: 'providedPort',
      message: `The port ${servicePort} is being used by another application. Please provide a valid port:`,
      validate: async (providedPort: string) => await isPortAvailable(parseInt(`${providedPort}`))
    })
    if (typeof PromptResult.providedPort === 'string') {
      servicePort = parseInt(PromptResult.providedPort)
      isAvailable = (await isPortAvailable(servicePort)).isAvailable
    }
  }
  return isAvailable
}
