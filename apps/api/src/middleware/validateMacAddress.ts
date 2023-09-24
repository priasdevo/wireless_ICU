// middleware/validateMacAddress.ts
import { Request, Response, NextFunction } from 'express'

export const validateMacAddress = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { macAddress } = req.body

  if (
    !macAddress ||
    !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress)
  ) {
    return res.status(400).json({ msg: 'Invalid MAC Address' })
  }

  next()
}
