import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = useCallback(async () => {
    try {
      await apiClient.post('/auth/login', {
        username: username,
        password: password,
      })
      //router.push('/webcam')
    } catch (err) {
      console.log(err)
    }
  }, [username, password])

  return { login, username, setUsername, password, setPassword }
}
export default useLogin
