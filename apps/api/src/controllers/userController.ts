// controllers/authController.ts

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import Device from '../models/device'
import { Request, Response } from 'express'

interface IRequestWithUser extends Request {
  user?: {
    id: string
  }
}

export const register = async (req: Request, res: Response) => {
  const { username, password, nickname } = req.body

  // Basic validation
  if (!username || !password || !nickname) {
    return res.status(400).json({ msg: 'Please enter all fields.' })
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 6 characters.' })
  }

  try {
    let user = await User.findOne({ username })

    if (user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    user = new User({
      username,
      password,
      nickname,
    })

    await user.save()

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '1h' },
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

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields.' })
  }

  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '1h' },
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
    // 1. Look up the Device using the device_code
    const device = await Device.findOne({ device_code: req.body.device_code })

    if (!device) {
      return res.status(404).json({ msg: 'Device not found' })
    }

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
    // 1. Look up the Device using the device_code
    const device = await Device.findOne({ device_code: req.body.device_code })

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
