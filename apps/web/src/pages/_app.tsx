import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { SocketProvider } from '@/common/socket'
import { io } from 'socket.io-client'
import Navbar from '@/modules/navbar'

const URL = process.env.NEXT_PUBLIC_DROPLET_URL || 'http://localhost:8000'
const socket = io(URL, { transports: ['websocket'], reconnection: false })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider socket={socket}>
      <Navbar />
      <Component {...pageProps} />
    </SocketProvider>
  )
}
