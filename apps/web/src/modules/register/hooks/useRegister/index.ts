import { apiClient } from '@/common/axios/axiosInstance'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

const useRegister = () => {
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const register = useCallback(async () => {
    try {
      await apiClient.post('/auth/register', {
        username: username,
        password: password,
        nickname: nickname,
      })
      router.push('/login')
    } catch (err) {
      console.log(err)
    }
  }, [username, password])

  return {
    register,
    username,
    setUsername,
    password,
    setPassword,
    nickname,
    setNickname,
  }
}
export default useRegister
