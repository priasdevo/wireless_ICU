import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const VideoPlayer: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <div style = {{display:'flex', flexDirection: 'column', alignItems:'center', marginTop:'10rem'}}>
    <Typography variant = 'h5' color = '#ed7c31'>p1 p2</Typography>
    <video controls width="800">
      {id && (
        <source
          src={`${process.env.NEXT_PUBLIC_DROPLET_URL}/notification/video/${id}`}
          type="video/mp4"
        />
      )}
      Your browser does not support the video tag.
    </video>
    </div>
  )
}

export default VideoPlayer
