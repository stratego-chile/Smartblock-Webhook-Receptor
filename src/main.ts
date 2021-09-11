import cors from 'cors'
import express, { urlencoded } from 'express'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import path from 'path'
import { servicePort } from './helpers/deploy-assist'
import ErrorHandler from './helpers/error-handler'
import ApplicationRouter from './api/router'
import { GITHUB_HEADERS } from './helpers/github-payload'
import { connectionHandler } from './helpers/default-handlers'
import launchApplication from './helpers/bootstrapper'
import { DEFAULT_HEADERS, DEFAULT_METHODS, DEFAULT_SOURCES as DEFAULT_SOURCES_STATIC } from './helpers/default-values'

export const WebhookReceptor = express()

// Upgrade defaults
const DEFAULT_SOURCES = [...DEFAULT_SOURCES_STATIC, `localhost:${servicePort}`]

// Server security policies
WebhookReceptor.use(
  cors({
    allowedHeaders: [...DEFAULT_HEADERS, ...GITHUB_HEADERS],
    origin: '*',
    methods: DEFAULT_METHODS
  })
)

WebhookReceptor.use(
  express.json({ limit: '10mb' })
)

WebhookReceptor.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': [...DEFAULT_SOURCES],
        'font-src': [...DEFAULT_SOURCES],
        'img-src': [...DEFAULT_SOURCES, 'data:'],
        'script-src': [...DEFAULT_SOURCES],
        'style-src': [...DEFAULT_SOURCES],
        'frame-src': "'self'"
      }
    },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true
  })
)

WebhookReceptor.use(
  urlencoded({ extended: true })
)

// Server views pre-sets
WebhookReceptor.set('title', 'Smartblock API')
WebhookReceptor.set('view engine', 'pug')
WebhookReceptor.set('views', path.resolve(__dirname, 'api', 'templates'))

// General response and logging configuration
WebhookReceptor.use(connectionHandler)

// Assets endpoints
WebhookReceptor.use(
  favicon(path.join(__dirname, process.env.BUILD_MODE === 'yes' ? '.' : '..', 'public', 'favicon.ico')))

WebhookReceptor.use(
  (process.env.BASE_PATH ?? '') + '/static',
  express.static(path.join(__dirname, process.env.BUILD_MODE === 'yes' ? '.' : '..', 'public')))

// REST Endpoints definitions
WebhookReceptor.use(process.env.BASE_PATH ?? '/', ApplicationRouter)

// Custom error handlers
WebhookReceptor.use(ErrorHandler.generic)

/**
 * Error 404. DO NOT MOVE.
 * Any route specified after the following instruction will be ignored by the router.
 * To add more routes just add them to the endpoints, views or redirects sections listed before.
 */
WebhookReceptor.use(ErrorHandler.resourceNotFound)

if (process.env.RUN_MODE !== 'module') {
  launchApplication(WebhookReceptor, servicePort)
}
