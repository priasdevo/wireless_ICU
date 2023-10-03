import { useSocket } from '@/common/socket'
import React, { useRef, useEffect, useState } from 'react'
import useStreamRoom from './hooks/useStreamRoom'
import { Typography } from '@mui/material'
import { CardContainer, Input, Label } from './styled'

const VideoStreamPage: React.FC = () => {
  const { socket } = useSocket()
  // const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef = useRef<HTMLImageElement>(null)
  const [imageUrl, setImageUrl] = useState('string')
  const [homeStatus, setHomeStatus] = useState<string>('') // Default to 'notHome'
  const { notifications, id } = useStreamRoom()

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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: '40px'}}>
      <img src={imageUrl} alt="Video Stream" style={{marginTop:'100px', marginBottom:'50px'}}/>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Input 
          type="radio"
          id="isHome"
          name="homeStatus"
          value="isHome"
          checked={homeStatus === 'isHome'}
          onChange={handleRadioChange}
        />
        <Label htmlFor="isHome">At Home</Label>

        <Input style={{marginLeft:'40px'}}
          type="radio"
          id="notIsHome"
          name="homeStatus"
          value="notHome"
          checked={homeStatus === 'notHome'}
          onChange={handleRadioChange}
        />
        <Label htmlFor="notIsHome">not at Home</Label>
      </div>
      <Typography variant='h4' color = '#ed7c31' style = {{marginTop:'100px', marginBottom:'30px'}}>Notification of this device</Typography>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '270px' }}>
          <Typography variant="h5" color="#ed7c31">
            Video Link
          </Typography>
          <Typography
            variant="h5"
            color="#ed7c31"
            style={{ marginRight: '20px' }}
          >
            Time
          </Typography>
        </div>
      {notifications &&
        notifications.map((notification: any) => {
          return (
            <CardContainer>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
              <Typography variant="h6" color="#d56f2c">{notification.videoLink}</Typography>
              <Typography variant="h6" color="#d56f2c">{notification.timestamp}</Typography>
            </div>
            </CardContainer>
          )
        })}
    </div>
  )
}

export default VideoStreamPage
