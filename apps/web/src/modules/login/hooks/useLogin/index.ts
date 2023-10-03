import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

interface loginDto {
  token: string
}

const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = useCallback(async () => {
    try {
      const res = await apiClient.post('/auth/login', {
        username: username,
        password: password,
      })
      localStorage.setItem('token', res.data.token)
      router.push('/device/list')
    } catch (err) {
      console.log(err)
    }
  }, [username, password])

  return { login, username, setUsername, password, setPassword }
}
export default useLogin
