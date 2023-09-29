// controllers/authController.ts

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user'
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

  console.log(req.body)

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

    const expiresIn = Number(5) * 24 * 60 * 60 * 1000
    const options = {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '1h' },
      (err, token) => {
        if (err) throw err
        res.status(200).cookie('token', token, options).json({
          success: true,
          token,
        })
        //res.json({ token })
      },
    )
  } catch (err) {
    console.error((err as Error).message)
    res.status(500).send('Server error')
  }
}
