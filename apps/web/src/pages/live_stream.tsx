import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function LiveStream() {
  const [watchState, setWatchState] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const EXPRESS_HOST = 'http://localhost:5000'

  useEffect(() => {
    const socket = io(EXPRESS_HOST)
    socket.on('connect', () => {
      console.log('socket connected!')
      setSocket(socket)
    })

    socket.on('data_to_nextjs', (frame) => {
      const newSrc = `data:image/jpeg;base64,${frame}`
      setImgSrc(newSrc)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const toggleWatchStateHandler = async () => {
    const newState = !watchState
    const data = {
      state: newState,
    }

    try {
      const response = await fetch(`${EXPRESS_HOST}/watch_state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('NextJS-express network error')
      }

      setWatchState(newState)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <div>
        <p>Is Watching : {watchState.toString()}</p>
        <button onClick={toggleWatchStateHandler}>Toggle Watch State</button>
      </div>
      <div>
        <img src={imgSrc} alt="live stream" />
      </div>
    </div>
  )
}
