import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useEffect, useState } from 'react'

interface Notification {
  device: string
  videoLink: string
  timestamp: Date
}

const useNotificationList = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>()

  const getUserNotifications = useCallback(async () => {
    try {
      const res = await apiClient.get('/notification')
      setNotifications(res.data)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    getUserNotifications()
  }, [])

  return { notifications }
}
export default useNotificationList
