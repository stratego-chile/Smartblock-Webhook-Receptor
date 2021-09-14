import { NextFunction, Request, Response } from 'express'
import { APIResponse } from '../types'
import { HTTPError } from '../lib/http-error'

export type ErrorTemplateData = {
  error: {
    title: string
    message: string
    helper?: string
    stack?: string
  }
  showDocsAlert?: boolean
}

export default class ErrorHandler {
  public static createErrorOutput (errorReason: string): APIResponse<null> {
    return {
      error: {
        value: true,
        message: errorReason,
        timestamp: Date.now()
      },
      value: null
    }
  }

  public static useErrorTemplate (inResponse: Response, data: ErrorTemplateData): void {
    inResponse.render('error', {
      ...data,
      BASE_PATH: process.env.BASE_PATH
    })
  }

  public static generic (error: Error | HTTPError, _request: Request, response: Response, next: NextFunction): void {
    if (response.headersSent) {
      return next(error)
    }
    const isHTTPError = !!(error as HTTPError).httpCode
    const httpErrorCode = isHTTPError ? (error as HTTPError).httpCode : 500
    response.status(httpErrorCode)
    console.log('HTTP status code: %s', response.statusCode)
    console.log('\nError stack:\n', error)
    ErrorHandler.useErrorTemplate(response, {
      error: {
        title: ['Error', response.statusCode].join(' '),
        message: isHTTPError ? error.message : 'Internal server error',
        helper: process.env.NODE_ENV === 'development' ? error.message : ''
      }
    })
  }

  public static resourceNotFound (_request: Request, response: Response): void {
    response.status(404)
    console.log('HTTP status code: %s', response.statusCode)
    ErrorHandler.useErrorTemplate(response, {
      error: {
        title: ['Error', response.statusCode].join(' '),
        message: 'Resource not found'
      }
    })
  }
}
