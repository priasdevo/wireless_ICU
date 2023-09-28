import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import Device from '../models/device'
import User from '../models/user'
interface IDecodedUser {
  id: string
  iat?: number
  exp?: number
}
interface SocketWithDecode extends Socket {
  decoded?: any
}

const streamSocket = (io: Server) => {
  io.on('connection', (socket: SocketWithDecode) => {
    console.log('Client connected')

    socket.on('authenticate', (data) => {
      jwt.verify(
        data.token,
        process.env.JWT_SECRET!,
        (err: any, decoded: any) => {
          if (err) {
            socket.disconnect()
          } else {
            socket.decoded = decoded
          }
        },
      )
    })

    socket.on('identify_streamer', async () => {
      try {
        // Verify the token
        const decoded = socket.decoded

        // Fetch the device using the decoded ID
        const device = await Device.findById(decoded.id)

        if (!device) {
          console.warn('Device not found!')
          return
        }

        socket.join(device.deviceCode!)
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

        // Fetch the device using the decoded ID
        const user = await User.findById(decoded.id)
        const device = await Device.findOne({ deviceCode: room })

        if (user?.device!.includes(device?._id!)) {
          socket.join(room)
          console.log(`Joined as viewer in room: ${room}`)
        } else {
          console.error("User doesn't has authorize to visit this room")
        }
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('stream', (room: string, stream: any) => {
      // Check if the socket is in the specified room as a streamer
      const rooms = io.sockets.adapter.rooms
      const isStreamer = rooms.get(room)?.has(socket.id)

      if (!isStreamer) {
        console.warn(
          `Received a stream in room ${room} from a non-streamer client!`,
        )
        return
      }

      console.log(`Receive Stream in room ${room}`)
      console.log(stream)

      // Broadcasting the stream to all viewers in the room
      socket.to(room).emit('stream-data', stream)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

export default streamSocket
