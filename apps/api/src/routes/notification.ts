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

router.get(
  '/single/:id',
  authMiddleware,
  notificationController.getNotificationById,
)

router.get(
  '/video/:id',
  authMiddleware,
  notificationController.getNotificationsVideo,
)

export default router
