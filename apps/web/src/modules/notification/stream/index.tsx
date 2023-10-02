import { useRouter } from 'next/router'
import React from 'react'

const VideoPlayer: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <video controls width="600">
      {id && (
        <source
          src={`${process.env.NEXT_PUBLIC_DROPLET_URL}/notification/video/${id}`}
          type="video/mp4"
        />
      )}
      Your browser does not support the video tag.
    </video>
  )
}

export default VideoPlayer
