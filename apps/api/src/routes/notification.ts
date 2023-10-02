// routes/deviceRoutes.ts
import express from 'express'
import * as notificationController from '../controllers/notificationController'

const router = express.Router()
import { authMiddleware } from '../middleware/userAuthentication'

router.get('/', authMiddleware, notificationController.getUserNotifications)

router.get(
  '/:deviceCode',
  authMiddleware,
  notificationController.getDeviceNotifications,
)

export default router
