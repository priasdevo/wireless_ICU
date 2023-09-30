import { useSocket } from '@/common/socket'
import { useRouter } from 'next/router'
import React, { useRef, useEffect } from 'react'

const VideoStreamPage: React.FC = () => {
  const { socket } = useSocket()
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    //socket.emit('join_room', id)
    socket.on('stream', (data: any) => {
      // Assuming the video data is a blob
      if (videoRef.current) {
        const blob = new Blob([data], { type: 'video/mp4' })
        videoRef.current.src = URL.createObjectURL(blob)
      }
    })

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('stream')
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} controls autoPlay></video>
    </div>
  )
}

export default VideoStreamPage
