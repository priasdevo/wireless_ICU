// controllers/deviceController.ts

import bcrypt from 'bcryptjs'
import Device from '../models/device'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { Request, Response } from 'express'

export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { macAddress, users, password, useToken } = req.body

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
      users,
      password: hashedPassword,
      token,
    })

    await device.save()
    res.json({ msg: 'Device registered successfully', token }) // Return token if device opted for token-based authentication
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
