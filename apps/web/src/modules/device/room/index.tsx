import { useSocket } from '@/common/socket'
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'

const VideoStreamPage: React.FC = () => {
  const { socket } = useSocket()
  // const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef = useRef<HTMLImageElement>(null)
  const [imageUrl, setImageUrl] = useState('string')
  const router = useRouter()
  const [homeStatus, setHomeStatus] = useState<string>('') // Default to 'notHome'

  const { id } = router.query

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHomeStatus(e.target.value)
    socket.emit('change_home', e.target.value === 'isHome' ? true : false)
  }

  useEffect(() => {
    //socket.emit('join_room', id)

    if (id) {
      socket.emit('join_room', id)
      socket.on('stream-data', (data: any) => {
        setImageUrl(`data:image/jpeg;base64,${data}`)

        if (videoRef.current) {
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
      socket.on('isHome_Change', (isHome: boolean) => {
        setHomeStatus(isHome ? 'isHome' : 'notHome')
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
      <div>
        <input
          type="radio"
          id="isHome"
          name="homeStatus"
          value="isHome"
          checked={homeStatus === 'isHome'}
          onChange={handleRadioChange}
        />
        <label htmlFor="isHome">At Home</label>

        <input
          type="radio"
          id="notIsHome"
          name="homeStatus"
          value="notHome"
          checked={homeStatus === 'notHome'}
          onChange={handleRadioChange}
        />
        <label htmlFor="notIsHome">not at Home</label>
      </div>
    </div>
  )
}

export default VideoStreamPage
