import { NextFunction, Request, Response } from 'express'

export const connectionHandler = (request: Request, response: Response, next: NextFunction): void => {
  if (request.method === 'OPTIONS') {
    response.sendStatus(200)
  } else {
    console.log(`\nRequest from ${request.ip} to \x1b[1m${request.method.toUpperCase()} ${request.url}\x1b[0m`)
    response.setHeader('Content-Security-Policy', 'upgrade-insecure-requests')
    next()
  }
}
