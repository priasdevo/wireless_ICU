import Notification from '../models/notification'
import User from '../models/user'
import Device from '../models/device'
import { Request, Response } from 'express'
import path from 'path'
import * as fs from 'fs'

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

export const getNotificationsVideo = async (req: Request, res: Response) => {
  try {
    console.log('???')
    const notificationId = req.params.id

    const notification = await Notification.findById(notificationId)
    const fileName = notification?.videoLink

    console.log('Noti filename : ', fileName)

    const projectRoot = path.resolve(__dirname, '../../') // Go up one level from the current directory to the project root
    const filePath = path.join(projectRoot, fileName!) // replace with your video's path

    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      const chunksize = end - start + 1
      const file = fs.createReadStream(filePath, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error!' })
  }
}
