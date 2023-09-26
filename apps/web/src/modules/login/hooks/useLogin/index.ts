import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useState } from 'react'

const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useCallback(async () => {
    await apiClient.post('/auth/login', {
      username: username,
      password: password,
    })
  }, [username, password])

  return { login, username, setUsername, password, setPassword }
}
export default useLogin
