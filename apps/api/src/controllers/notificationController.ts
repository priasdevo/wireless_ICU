import Notification from '../models/notification'
import User from '../models/user'
import Device from '../models/device'
import { Request, Response } from 'express'

interface IRequestWithUser extends Request {
  user?: {
    id: string
  }
}

/**
 * Get all notifications for a user.
 */
export const getUserNotifications = async (
  req: IRequestWithUser,
  res: Response,
) => {
  try {
    // Assuming user's ID is in JWT token or session
    const userId = req.user?.id

    const user = await User.findById(userId).populate('device')

    if (!user) {
      return res.status(404).json({ message: 'User not found!' })
    }

    // Getting all notifications from devices associated with the user
    const notifications = await Notification.find({
      device: { $in: user.device.map((d) => d._id) },
    })

    return res.status(200).json(notifications)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error!' })
  }
}

/**
 * Get notifications for a specific device.
 */
export const getDeviceNotifications = async (req: Request, res: Response) => {
  try {
    // Assuming device ID is passed in the URL as a parameter
    const deviceCode = req.params.deviceCode

    const device = await Device.findOne({ deviceCode: deviceCode })

    const deviceId = device?._id

    if (!device) {
      return res.status(404).json({ message: 'Device not found!' })
    }

    const notifications = await Notification.find({ device: deviceId })

    return res.status(200).json(notifications)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error!' })
  }
}
