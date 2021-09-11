import { Router } from 'express'
import SyncRouter from './routes/sync.routes'

const ApplicationRouter = Router({
  strict: true
})

// #region Views
ApplicationRouter.get('/', (_request, response) => {
  response.render('index', {
    BASE_PATH: process.env.BASE_PATH
  })
})
// #endregion

// #region Regular endpoints
ApplicationRouter.use('/sync', SyncRouter)
// #endregion

export default ApplicationRouter
