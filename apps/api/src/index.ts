import express, { json } from 'express'
import expressWs from 'express-ws'
import http from 'http'
import WebSocket from 'ws'

import { config } from 'dotenv'

const app = express()
const wsInstance = expressWs(app)
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(json())

const clients = new Set<WebSocket>() // Store connected clients

wss.on('connection', (ws) => {
  // Handle WebSocket connections here for video streaming
  console.log('WebSocket connected')
  clients.add(ws)
  // Simulated video stream
  const videoStreamInterval = setInterval(() => {
    // const fakeVideoData = generateFakeVideoFrame() // Implement your video source logic here
    // ws.send(fakeVideoData) // Send video data to the connected client
  }, 1000 / 30) // 30 frames per second

  ws.on('message', (data: string) => {
    // Broadcast the received data to all connected clients except the sender
    const message = data.toString()

    console.log('Message receive : ', message)
    broadcast(data, ws)
  })

  ws.on('close', () => {
    console.log('WebSocket disconnected')
    clients.delete(ws)
    clearInterval(videoStreamInterval) // Stop sending video data when the client disconnects
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log('Server running in', process.env.NOED_ENV, ' mode on port ', PORT)
})

// Handle promise rejection
process.on('unhandledRejection', (err: Error, Promise) => {
  console.log(`Error: ${err.message}`)
  // close server
  server.close(() => process.exit(1))
})

// Function to broadcast data to all connected clients
function broadcast(data: string, sender: WebSocket) {
  clients.forEach((client: WebSocket) => {
    // Send the data to all clients except the sender
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}
