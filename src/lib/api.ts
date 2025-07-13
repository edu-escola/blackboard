import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from './config'

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: API_CONFIG.DEFAULT_HEADERS,
})
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = API_CONFIG.AUTH.LOGIN_ROUTE
      console.error('Sessão expirada. Por favor, faça login novamente.')
    }

    return Promise.reject(error)
  }
)

export default api
