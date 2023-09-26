// models/Device.ts

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

const Device = mongoose.model('Device', deviceSchema)
export default Device
