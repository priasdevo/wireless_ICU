// models/Device.ts
import crypto from 'crypto'
import mongoose from 'mongoose'

const deviceSchema = new mongoose.Schema({
  macAddress: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false, // This prevents the password from being returned in queries by default
  },
  token: String,
})

deviceSchema.pre('save', function (next) {
  const doc = this as any

  if (!doc.device_code) {
    // Here we're generating a 6-character random hash for device_code.
    doc.device_code = crypto.randomBytes(3).toString('hex')
  }

  next()
})

const Device = mongoose.model('Device', deviceSchema)
export default Device
