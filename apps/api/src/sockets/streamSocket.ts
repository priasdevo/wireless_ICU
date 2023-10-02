import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import Device from '../models/device'
import User from '../models/user'
import Notification from '../models/notification'
import { compileVideo } from './function'
import { sampleEmbed } from '../discord/bots'
interface IDecodedUser {
  id: string
  iat?: number
  exp?: number
}

enum UserRole {
  VIEWER = 'viewer',
  STREAMER = 'streamer',
}
interface SocketWithDecode extends Socket {
  decoded?: any
  role?: UserRole
}

const FRAME_RATE = 10 // Assuming 10 frames per second
const BUFFER_SIZE = FRAME_RATE * 10 * 2 // 10 seconds before and after

class ImageBuffer {
  private buffer: any[] = []

  push(image: any) {
    if (this.buffer.length >= BUFFER_SIZE) {
      this.buffer.shift()
    }
    this.buffer.push(image)
  }

  getImages() {
    return this.buffer
  }
}

const imageBuffers: { [key: string]: ImageBuffer } = {}

const streamSocket = (io: Server) => {
  io.on('connection', (socket: SocketWithDecode) => {
    console.log('Client connected')
    //sampleEmbed('1157728920339234996')

    socket.on('authenticate', (data) => {
      jwt.verify(
        data.token,
        process.env.JWT_SECRET!,
        (err: any, decoded: any) => {
          if (err) {
            socket.disconnect()
          } else {
            socket.decoded = decoded
            socket.emit('authen_success')
          }
        },
      )
    })

    socket.on('identify_streamer', async () => {
      try {
        // Verify the token
        const decoded = socket.decoded

        console.log('device decodede : ', decoded)

        // Fetch the device using the decoded ID
        const device = await Device.findById(decoded.deviceId)

        if (!device) {
          console.warn('Device not found!')
          return
        }

        socket.join(device.deviceCode!)
        socket.role = UserRole.STREAMER
        socket.emit('identify_success', device.isHome)
        console.log(
          `Streamer identified and joined room: ${device.deviceCode!}`,
        )
      } catch (err) {
        console.error('Error identifying streamer:', err)
      }
    })

    // Viewer joins a room
    socket.on('join_room', async (room: string) => {
      try {
        const decoded = socket.decoded
        console.log(decoded)

        // Fetch the device using the decoded ID
        const user = await User.findById(decoded.user.id)
        const device = await Device.findOne({ deviceCode: room })

        socket.role = UserRole.VIEWER

        if (user?.device!.includes(device?._id!)) {
          socket.join(room)
          console.log(`Joined as viewer in room: ${room}`)
        } else {
          console.log(user?.device)
          console.error("User doesn't has authorize to visit this room")
        }
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('movement_detected', async () => {
      // const room: string | undefined = Array.from(socket.rooms).find(
      //   (r) => r !== socket.id,
      // ) // because socket.rooms also contains a room named after the socket's id
      let videoLink

      if (socket.role !== UserRole.STREAMER) {
        console.warn('This notice does not come from device!')
        return
      }

      // if (imageBuffers[room!]) {
      //   videoLink = compileVideo(imageBuffers[room!].getImages(), FRAME_RATE)
      // }

      console.log('Detected')

      const notification = new Notification({
        device: socket.decoded.deviceId,
        videoLink: videoLink,
      })
      await notification.save()

      sampleEmbed('1157728920339234996')
    })

    socket.on('stream', (stream: any) => {
      // Check if the socket is in the specified room as a streamer

      const room = Array.from(socket.rooms).find((r) => r !== socket.id) // because socket.rooms also contains a room named after the socket's id

      if (!room) {
        console.warn('The socket is not connected to any room!')
        return
      }

      const isStreamer = socket.role === UserRole.STREAMER

      if (!isStreamer) {
        console.warn(
          `Received a stream in room ${room} from a non-streamer client!`,
        )
        return
      }

      //console.log(`Receive Stream in room ${room}`)
      //console.log(stream)

      // Broadcasting the stream to all viewers in the room
      socket.to(room).emit('stream-data', stream)

      if (!imageBuffers[room]) {
        imageBuffers[room] = new ImageBuffer()
      }
      imageBuffers[room].push(stream)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

export default streamSocket
