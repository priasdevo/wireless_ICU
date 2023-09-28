import React, { useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import io from 'socket.io-client'

const socket = io('localhost:3000') // Correct server URL

const WebcamComponent = () => {
  const videoRef = useRef<Webcam | null>(null)

  useEffect(() => {
    console.log('WebcamComponent mounted')
    console.log('Attempting to connect to server:', 'http://localhost:5000')

    socket.on('connect', () => {
      console.log('Connected to the server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from the server')
    })

    // ... your other code ...

    return () => {
      console.log('WebcamComponent unmounted')
      //socket.disconnect()
    }
  }, [])

  useEffect(() => {
    // Initialize the webcam stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current && videoRef.current.video) {
            videoRef.current.video.srcObject = stream
          }

          // Send frames from the webcam continuously
          const sendFrame = () => {
            if (videoRef.current && videoRef.current.video) {
              const canvas = document.createElement('canvas')
              const video = videoRef.current.video
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              const ctx = canvas.getContext('2d')
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

              canvas.toBlob((blob) => {
                if (blob) {
                  socket.emit('stream', blob) // Send the blob data
                }
              }, 'image/jpeg')

              requestAnimationFrame(sendFrame) // Continue sending frames
            }
          }

          sendFrame() // Start sending frames

          // Handle stopping the stream when the component unmounts
          return () => {
            stream.getTracks().forEach((track) => track.stop())
          }
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error)
        })
    }
  }, [])

  return (
    <div>
      <Webcam ref={videoRef} />
      <button
        onClick={() => {
          console.log('Test')
          socket.emit('stream', 'Test')
        }}
      >
        Test
      </button>
    </div>
  )
}

export default WebcamComponent
