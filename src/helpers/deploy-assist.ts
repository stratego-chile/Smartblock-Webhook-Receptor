import portfinder from 'portfinder'
import dotenv from 'dotenv'
import path from 'path'
import prompts from 'prompts'

type AvailablePortDef = {
  isAvailable: boolean
  alternative?: number
}

export let servicePort = parseInt(process.env.PORT ?? '4000')

export const dotEnvConfig = dotenv.config({
  path: path.join(
    path.resolve(process.cwd()),
    `.env.${process.env.NODE_ENV}`
  )
})

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
