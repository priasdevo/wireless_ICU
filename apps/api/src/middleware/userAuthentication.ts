// middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IDecodedUser {
  id: string
  iat?: number
  exp?: number
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from header
  const token = req.header('Authorization')

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IDecodedUser
    ;(req as any).user = { id: decoded.id } // Set user ID from the token to the request object
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
