import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import streamSocket from './sockets/streamSocket'
import connectDB from './database/db'
import dotenv from 'dotenv'

const SocketIO = require('socket.io')

dotenv.config()
connectDB()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

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
