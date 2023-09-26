// routes/deviceRoutes.ts
import express from 'express'
import * as deviceController from '../controllers/deviceController'

const router = express.Router()
import { validateMacAddress } from '../middleware/validateMacAddress'

router.post('/register', validateMacAddress, deviceController.registerDevice)
router.post(
  '/authenticate',
  validateMacAddress,
  deviceController.authenticateDevice,
)

export default router
