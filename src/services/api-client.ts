import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { LoginResponseSchema } from '@/schemas/auth-schemas'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { getAuthStore } from '@/stores/auth-store'
import { JwtPayload } from '@/stores/auth-store'

interface ApiResponse<T> {
  timeStamp: string
  statusCode: number
  httpStatus: string
  message: string
  data: T
}

interface TokenResponse {
  email: string
  accessToken: string
}

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/mw-admin',
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const store = getAuthStore()
    const token = store.user?.token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | Promise<never>> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 408 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const store = getAuthStore()
        const user = store.user
        if (!user) {
          throw new Error('No user found in auth store')
        }

        const refreshResponse = await axios.post<ApiResponse<TokenResponse>>(
          '/auth/refresh',
          { email: user.email },
          { withCredentials: true }
        )

        const parsed = LoginResponseSchema.safeParse(refreshResponse.data.data)
        if (!parsed.success) {
          throw new Error('Invalid token response')
        }

        const { accessToken, username } = parsed.data
        const decoded = jwtDecode<JwtPayload>(accessToken)
        if (decoded.typ !== 'Access') {
          throw new Error('Invalid token type. Expected Access token')
        }
        await store.login(accessToken, username)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        toast.error('Session expired. Please login again.')
        const store = getAuthStore()
        store.logout()
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 403) {
      toast.error('You are not authorized to perform this action.')
    }

    return Promise.reject(error)
  }
)

export default apiClient
