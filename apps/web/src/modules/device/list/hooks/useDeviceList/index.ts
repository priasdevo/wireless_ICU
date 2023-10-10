import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSocket } from '@/common/socket'

interface Device {
  macAddress: string
  deviceCode: string
}

const useDeviceList = () => {
  const [devices, setDevices] = useState<Array<Device>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceCode, setDeviceCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { socket } = useSocket()

  const router = useRouter()

  useEffect(() => {
    fetchDevices()
    socket.emit('authenticate', { token: localStorage.getItem('token') })
  }, [])

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/authDevice')
      setDevices(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }, [])

  const addDevice = useCallback(async () => {
    try {
      const res = await apiClient.post('/authDevice/add', {
        deviceCode: deviceCode,
        password: password,
      })
      fetchDevices()
    } catch (err) {
      console.log(err)
    }
  }, [deviceCode, password])

  const removeDevice = async (id: string) => {
    try {
      const res = await apiClient.delete('/authDevice/remove', {
        params: {
          deviceCode: id,
        },
      })
      fetchDevices()
    } catch (err) {
      console.log(err)
    }
  }

  const enterRoom = useCallback(async (id: string) => {
    router.push(`/device/${id}`)
  }, [])

  return {
    devices,
    setDevices,
    deviceCode,
    setDeviceCode,
    loading,
    password,
    setPassword,
    addDevice,
    removeDevice,
    error,
    enterRoom,
  }
}

export default useDeviceList
