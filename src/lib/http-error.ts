import { APIResponse } from '../types'

export class HTTPError extends Error {
  public readonly httpCode!: number

  constructor (message: string, code: number) {
    super(message)
    this.httpCode = code
  }
}

export const createErrorResponse = (error: Error | HTTPError) => {
  return {
    error: {
      value: true,
      message: (error as HTTPError).httpCode
        ? 'HTTP Error ' + (error as HTTPError).httpCode + ': ' + error.message
        : error.message,
      timestamp: Date.now()
    }
  } as APIResponse<null>
}
