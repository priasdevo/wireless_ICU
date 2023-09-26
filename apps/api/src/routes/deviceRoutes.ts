// routes/deviceRoutes.ts
import express from 'express'
import * as deviceController from '../controllers/deviceController'

const router = express.Router()
import { validateMacAddress } from '../middleware/validateMacAddress'
import { authMiddleware } from '../middleware/userAuthentication'

router.post('/register', validateMacAddress, deviceController.registerDevice)
router.post(
  '/authenticate',
  validateMacAddress,
  deviceController.authenticateDevice,
)

router.post('/add', authMiddleware, deviceController.addDeviceToUser)
router.post('/remove', authMiddleware, deviceController.removeDevice)
router.get('/', authMiddleware, deviceController.getUserDevices)

export default router
