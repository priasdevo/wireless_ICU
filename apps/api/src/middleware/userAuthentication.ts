// middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IDecodedUser {
  user: any
  iat?: number
  exp?: number
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from header
  const token = req.cookies.token

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
    ;(req as any).user = decoded.user // Set user ID from the token to the request object
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
