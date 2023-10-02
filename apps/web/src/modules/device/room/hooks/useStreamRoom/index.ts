import React, { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/common/axios/axiosInstance'
import { useRouter } from 'next/router'

interface Notification {
  device: string
  videoLink: string
  timestamp: Date
}

const useStreamRoom = () => {
  const router = useRouter()
  const { id } = router.query
  const [notifications, setNotifications] = useState<Array<Notification>>()

  const getUserNotifications = useCallback(async () => {
    try {
      const res = await apiClient.get(`/notification/${id}`)
      console.log('Prias res : ', res)
      setNotifications(res.data)
    } catch (err) {
      console.log(err)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      getUserNotifications()
    }
  }, [id])

  return { notifications, id }
}
export default useStreamRoom
