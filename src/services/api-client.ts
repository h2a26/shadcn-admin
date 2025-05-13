import axios from 'axios'
import { LoginResponseSchema } from '@/schemas/auth-schemas'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { parseJwt, isAccessToken } from '@/utils/jwt-utils'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/mw-admin',
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 408 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const store = useAuthStore.getState()
        const user = store.user
        if (!user) throw new Error('No user found')

        const refreshResponse = await axios.post(
          '/auth/refresh',
          { email: user.email },
          { withCredentials: true }
        )
        const parsed = LoginResponseSchema.safeParse(refreshResponse.data.data)
        if (!parsed.success) throw new Error('Invalid token response')

        const { accessToken, username } = parsed.data
        const decoded = parseJwt(accessToken)
        if (!isAccessToken(decoded)) throw new Error('Expected Access token')

        await store.login(accessToken, username)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        toast.error('Session expired. Please login again.')
        useAuthStore.getState().logout()
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 403) {
      toast.error('Unauthorized action.')
    }

    if (error.response?.status === 401) {
      toast.error('Invalid or expired token.')
      useAuthStore.getState().logout()
      window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  }
)

export default apiClient
