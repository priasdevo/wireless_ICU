import { apiClient } from '@/common/axios/axiosInstance'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

interface Notification {
  device: string
  deviceCode: string
  videoLink: string
  timestamp: Date
  _id: string
}

const useNotiDetails = () => {
  const [notifications, setNotifications] = useState<Notification>()
  const router = useRouter()
  const id = router.query.id

  const getUserNotifications = useCallback(async () => {
    try {
      if (id) {
        const res = await apiClient.get(`/notification/single/${id}`)
        console.log('Prias res :', res.data)
        setNotifications(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }, [id])

  useEffect(() => {
    getUserNotifications()
  }, [id])

  return { notifications }
}
export default useNotiDetails
