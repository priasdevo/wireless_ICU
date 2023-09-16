import express, { json } from 'express'
import http from 'http'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
const SocketIO = require('socket.io')

import { config } from 'dotenv'

const app = express()

app.use(express.json())
app.use(cors())

const server = http.createServer(app)

// const io: Server = new Server(server, {
//   cors: {
//     origin: '*', // Allow requests from your client's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
//   },
// })
const io: Server = SocketIO(server, {
  cors: {
    origin: '*', // Allow requests from your client's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: '*',
    credentials: false,
  },
})

//const io = socketIo(server)

const clients = new Set<WebSocket>() // Store connected clients

io.on('connection', (socket: Socket) => {
  console.log('Client connected')

  socket.on('stream', (stream) => {
    console.log('Receive Stream')
    console.log(stream)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log('Server running in', process.env.NOED_ENV, ' mode on port ', PORT)
})

// Handle promise rejection
// process.on('unhandledRejection', (err: Error, Promise) => {
//   console.log(`Error: ${err.message}`)
//   // close server
//   server.close(() => process.exit(1))
// })

// // Function to broadcast data to all connected clients
// function broadcast(data: string, sender: WebSocket) {
//   clients.forEach((client: WebSocket) => {
//     // Send the data to all clients except the sender
//     if (client !== sender && client.readyState === WebSocket.OPEN) {
//       client.send(data)
//     }
//   })
// }
