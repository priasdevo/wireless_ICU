import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import streamSocket from './sockets/streamSocket'
import connectDB from './database/db'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth'
import deviceRoutes from './routes/deviceRoutes'
import notificationRoutes from './routes/notification'
import { registerBot } from './discord/bots'

const SocketIO = require('socket.io')
dotenv.config({ path: path.resolve(__dirname, './config/.env') })

connectDB()

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['content-type'], // Include 'content-type' in the list
  credentials: true, // This will allow cookies to be included
}

const corsOptions2 = {
  origin: ['http://192.168.43.119:3000', 'http://localhost:3000'], // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['content-type'], // Include 'content-type' in the list
  credentials: true, // This will allow cookies to be included
}

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors(corsOptions2))
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/authDevice', deviceRoutes)
app.use('/notification', notificationRoutes)

const server = http.createServer(app)

const io: Server = SocketIO(server, {
  cors: {
    origin: '*', // Allow requests from your client's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: '*',
    credentials: false,
  },
})

streamSocket(io)

server.listen(PORT, () => {
  console.log('Server running in', process.env.NOED_ENV, ' mode on port ', PORT)
})

process.on('unhandledRejection', (err: Error, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})

// Discord Bot

const client = registerBot()
