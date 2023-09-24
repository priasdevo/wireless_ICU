// routes/deviceRoutes.ts
import express from 'express'
import * as authController from '../controllers/deviceController'

const router = express.Router()
import { validateMacAddress } from '../middleware/validateMacAddress'

router.post('/register', validateMacAddress, registerDevice)
router.post('/authenticate', validateMacAddress, authenticateDevice)

export default router
