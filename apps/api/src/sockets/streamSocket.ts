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

const FRAME_RATE = 30 // Assuming 10 frames per second
const BUFFER_SIZE = FRAME_RATE * 10 * 2 // 10 seconds before and after

class ImageBuffer {
  private buffer: any[] = []
  private recording: boolean = false
  public framesAfterDetection: number = 0

  push(image: any) {
    this.buffer.push(image)

    if (this.recording) {
      this.framesAfterDetection++
    }

    if (this.framesAfterDetection > FRAME_RATE * 10) {
      // 10 seconds after movement
      this.recording = false
      this.framesAfterDetection = 0
    }

    while (this.buffer.length > BUFFER_SIZE) {
      this.buffer.shift()
    }
  }

  startRecording() {
    this.recording = true
  }

  isRecording() {
    return this.recording
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

        socket.emit('isHome_Change', device?.isHome)

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
      if (socket.role !== UserRole.STREAMER) {
        console.warn('This notice does not come from device!')
        return
      }

      const room = Array.from(socket.rooms).find((r) => r !== socket.id)
      if (room && imageBuffers[room]) {
        imageBuffers[room].startRecording()
      }

      console.log('Detected')
    })

    socket.on('stream', async (stream: any) => {
      const room = Array.from(socket.rooms).find((r) => r !== socket.id)

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

      socket.to(room).emit('stream-data', stream)

      if (!imageBuffers[room]) {
        imageBuffers[room] = new ImageBuffer()
      }
      imageBuffers[room].push(stream)

      if (imageBuffers[room].isRecording()) {
        console.log(
          'Frame after detect ',
          imageBuffers[room].framesAfterDetection,
          '  ',
          FRAME_RATE,
        )
      }

      if (
        imageBuffers[room].isRecording() &&
        imageBuffers[room].framesAfterDetection === FRAME_RATE * 10
      ) {
        console.log('Compiling')
        const videoLink = compileVideo(
          imageBuffers[room].getImages(),
          FRAME_RATE,
        )
        const notification = new Notification({
          device: socket.decoded.deviceId,
          videoLink: videoLink,
        })
        await notification.save()

        sampleEmbed('1157728920339234996')
      }
    })

    socket.on('change_home', async (isHome: boolean) => {
      try {
        const decoded = socket.decoded
        console.log(decoded)

        const room = Array.from(socket.rooms).find((r) => r !== socket.id)

        if (!room) {
          console.warn('The socket is not connected to any room!')
          return
        }

        const device = await Device.findOneAndUpdate(
          { deviceCode: room },
          { isHome: isHome },
          { new: true },
        )

        socket.to(room).emit('isHome_Change', isHome)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

export default streamSocket
