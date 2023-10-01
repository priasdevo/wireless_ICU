import { Socket } from 'socket.io-client'

export interface ISocketContext {
  socket: Socket
  loading: boolean
}

export interface ISocketProvider {
  children: React.ReactNode
  socket: Socket
}
