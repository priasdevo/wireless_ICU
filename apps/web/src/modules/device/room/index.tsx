import { useSocket } from '@/common/socket'
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'

const VideoStreamPage: React.FC = () => {
  const { socket } = useSocket()
  // const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef = useRef<HTMLImageElement>(null)
  const [imageUrl, setImageUrl] = useState('string')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    //socket.emit('join_room', id)

    if (id) {
      socket.emit('join_room', id)
      socket.on('stream-data', (data: any) => {
        // Assuming the video data is a blob
        // if (videoRef.current) {
        //   const blob = new Blob([data], { type: 'video/mp4' })
        //   videoRef.current.src = URL.createObjectURL(blob)
        // }

        setImageUrl(`data:image/jpeg;base64,${data}`)

        if (videoRef.current) {
          // Convert base64 to blob and set as image src
          const base64ToBlob = (base64: any) => {
            let binary = atob(base64.split(',')[1])
            let array = []
            for (let i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i))
            }
            return new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
          }

          const blob = base64ToBlob(data)
          videoRef.current.src = URL.createObjectURL(blob)
        }
      })
    }

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('stream')
    }
  }, [id])

  return (
    <div>
      {/* <video ref={videoRef} controls autoPlay></video> */}
      <img src={imageUrl} alt="Video Stream" />
    </div>
  )
}

export default VideoStreamPage
