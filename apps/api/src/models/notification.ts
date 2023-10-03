// models/Notification.ts
import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device', // This associates the Notification with a Device
    required: true,
  },
  deviceCode: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Default to current date/time
  },
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
