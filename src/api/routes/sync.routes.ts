import { Router } from 'express'
import SyncHandler from '../handlers/sync'

const SyncRouter = Router({
  strict: true
})

SyncRouter.post('/', SyncHandler.syncProject)

export default SyncRouter
