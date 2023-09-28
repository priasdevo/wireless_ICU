import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface Device {
  id: string
  name: string
}

const useDeviceList = () => {
  const [devices, setDevices] = useState<Array<Device>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceCode, setDeviceCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    fetchDevices()
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
    } catch (err) {
      console.log(err)
    }
  }, [deviceCode, password])

  const removeDevice = (id: string) => {
    fetch(`http://backend-url.com/api/user/devices/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => fetchDevices())
      .catch((error) => setError(error.message))
  }
}

export default useDeviceList
