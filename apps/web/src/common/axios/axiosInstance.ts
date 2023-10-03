import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_DROPLET_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
})
