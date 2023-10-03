import React, { createContext, useEffect } from 'react'
import { ISocketContext, ISocketProvider } from './types'
import { useRouter } from 'next/router'
import { useState } from 'react'

const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const useSocket = () => React.useContext(SocketContext)

export const SocketProvider = ({ children, socket }: ISocketProvider) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (router.pathname !== '/login' && router.pathname !== '/register') {
        setLoading(true)
        if (!localStorage.getItem('token')) {
          router.push('/login')
          setLoading(false)
        }
      }
      console.log('prias true')
      socket.emit('authenticate', { token: localStorage.getItem('token') })

      socket.on('connect', () => {})

      socket.on('authen_success', () => {
        console.log('prias false')
        setLoading(false)
        // other logic
      })

      // Cleanup listeners on component unmount
      return () => {
        socket.off('connect')
        socket.off('authen_success')
      }
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, loading }}>
      {!loading && children}
      {/* {loading && (
        <CircularProgress
          sx={{ position: 'fixed', zIndex: 99, top: '50%', left: '50%' }}
        />
      )} */}
    </SocketContext.Provider>
  )
}
