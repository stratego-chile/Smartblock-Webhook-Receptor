export class HTTPError extends Error {
  public readonly httpCode!: number

  constructor (message: string, code: number) {
    super(message)
    this.httpCode = code
  }
}
