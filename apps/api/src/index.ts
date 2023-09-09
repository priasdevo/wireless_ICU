import express, { json } from 'express'
import { config } from 'dotenv'
import bodyParser from 'body-parser';
import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import { createServer } from 'node:http'
import cors from 'cors'
import axios from 'axios'

const PORT = process.env.PORT || 5000
const RPI_HOST = 'http://192.168.1.108:8000'
const app = express()
app.use(bodyParser.json())
app.use(cors())

// Connect to RPI as a client
const rpiSocket = io(RPI_HOST)

rpiSocket.on('connect', () => {
  console.log('connected to RPI')
  rpiSocket.emit('express connected', null)
})

// Relay data from RPI to NextJS
rpiSocket.on('data_to_express', (data: any) => {
  nextJSSocket.emit('data_to_nextjs', data)
})

// Connect to NextJS as a server
const server = createServer(app)
const nextJSSocket = new Server(server, {
  cors: {
    origin : "*"
  }
})
nextJSSocket.on('connection', (socket) => {
  console.log('nextjs client connected')
})

// Setup Watchstate toggler http handler
app.post('/watch_state',  async (req, res) => {
  const newWatchState = req.body.state
  console.log('new watch state received:', newWatchState)

  console.log(req.body)
  // Relay the state to RPI
  try {
    const response = await axios.post(`${RPI_HOST}/watch_state`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status != 200) {
      throw new Error('express-RPI network error')
    }
  } catch (error) {
    console.error('Error:', error)
  }
  res.status(200).json({})
})

server.listen(PORT, () => {
  console.log('Server running in', process.env.NOED_ENV, ' mode on port ', PORT)
})

// Handle promise rejection
process.on('unhandledRejection', (err: Error, Promise) => {
  console.log(`Error: ${err.message}`)
  // close server
  server.close(() => process.exit(1))
})
