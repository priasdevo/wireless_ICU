import express, { json } from 'express'
import { config } from 'dotenv'

const app = express()
app.use(json())

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log('Server running in', process.env.NOED_ENV, ' mode on port ', PORT)
})

// Handle promise rejection
process.on('unhandledRejection', (err: Error, Promise) => {
  console.log(`Error: ${err.message}`)
  // close server
  server.close(() => process.exit(1))
})
