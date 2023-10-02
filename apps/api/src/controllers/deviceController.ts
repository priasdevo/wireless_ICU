// controllers/deviceController.ts

import bcrypt from 'bcryptjs'
import Device from '../models/device'
import User from '../models/user'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { Request, Response } from 'express'

interface IRequestWithUser extends Request {
  user?: {
    id: string
  }
}

export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { macAddress, password, useToken } = req.body

    let device = await Device.findOne({ macAddress })

    if (device) {
      return res.status(400).json({ msg: 'Device already registered' })
    }

    let token
    let hashedPassword

    if (useToken) {
      token = crypto.randomBytes(20).toString('hex')
    } else if (password) {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(password, salt)
    }

    device = new Device({
      macAddress,
      password: hashedPassword,
      token,
    })

    const savedDevice = await device.save()

    res.json({
      msg: 'Device registered successfully',
      token: token,
      deviceCode: savedDevice.deviceCode,
    }) // Return token if device opted for token-based authentication
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}

export const authenticateDevice = async (req: Request, res: Response) => {
  try {
    const { macAddress, password, token } = req.body

    const device = (await Device.findOne({ macAddress }).select(
      '+password',
    )) as any

    if (!device) {
      return res.status(400).json({ msg: 'Device not found' })
    }

    if (token) {
      if (token !== device.token) {
        return res.status(401).json({ msg: 'Invalid token' })
      }
    } else if (password) {
      const isMatch = await bcrypt.compare(password, device.password)
      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid password' })
      }
    } else {
      return res.status(400).json({ msg: 'Please provide password or token' })
    }

    // JWT token generation for authenticated devices
    const payload = {
      deviceId: device.id,
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      },
    )
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}

export const addDeviceToUser = async (req: IRequestWithUser, res: Response) => {
  try {
    // 1. Look up the Device using the deviceCode
    const device = await Device.findOne({ deviceCode: req.body.deviceCode })

    if (!device) {
      return res.status(404).json({ msg: 'Device not found' })
    }
    console.log(req.user)

    // 2. Add the Device's ID to the User's device array
    const user = await User.findById(req.user?.id) // Assuming you have attached the user's ID to the request as `req.user.id` through some middleware like JWT validation.

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    if (user.device.includes(device._id)) {
      return res.status(400).json({ msg: 'Device already added' })
    }

    user.device.push(device._id)
    await user.save()

    res.json({ msg: 'Device added to user successfully' })
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}

export const removeDevice = async (req: IRequestWithUser, res: Response) => {
  try {
    // 1. Look up the Device using the deviceCode
    console.log(req)
    const device = await Device.findOne({ deviceCode: req.query.deviceCode })

    if (!device) {
      return res.status(404).json({ msg: 'Device not found' })
    }

    // 2. Remove the Device's ID from the User's device array
    const user = await User.findById(req.user?.id) // Using the previously mentioned type assertion for `user`

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const deviceIndex = user.device.indexOf(device._id)
    if (deviceIndex !== -1) {
      user.device.splice(deviceIndex, 1)
      await user.save()
      res.json({ msg: 'Device removed from user successfully' })
    } else {
      res.status(400).json({ msg: 'Device not associated with this user' })
    }
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}

export const getUserDevices = async (req: IRequestWithUser, res: Response) => {
  try {
    // Fetch the user and populate the 'device' field which contains references to Device model
    const user = await User.findById(
      (req as IRequestWithUser).user?.id,
    ).populate('device')

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.json(user.device) // This will be an array of devices associated with the user
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}
