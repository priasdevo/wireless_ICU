import { Server, Socket } from 'socket.io'

const streamSocket = (io: Server) => {
  const clients = new Set<WebSocket>() // Store connected clients

  io.on('connection', (socket: Socket) => {
    console.log('Client connected')

    socket.on('register', (type: 'streamer' | 'viewer') => {
      if (type === 'streamer') {
        socket.join('streamer')
        console.log('Joined as streamer')
      } else {
        socket.join('viewer')
        console.log('Joined as viewer')
      }
    })

    socket.on('stream', (stream) => {
      // Check if the socket is in the 'streamer' room before accepting the stream
      const rooms = io.sockets.adapter.rooms
      const isStreamer = rooms.get('streamer')?.has(socket.id)

      if (!isStreamer) {
        console.warn('Received a stream from a non-streamer client!')
        return
      }

      console.log('Receive Stream')
      console.log(stream)

      // Broadcasting the stream to all viewers
      socket.to('viewer').emit('stream-data', stream)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

export default streamSocket
