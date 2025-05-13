import { LoginRequest, LoginResponseSchema } from '@/schemas/auth-schemas'
import { getAuthStore } from '@/stores/auth-store'
import apiClient from './api-client'

export const login = async (credentials: LoginRequest): Promise<void> => {
  try {
    const response = await apiClient.post('/auth/login', credentials)
    const parsed = LoginResponseSchema.safeParse(response.data.data)
    if (!parsed.success) {
      throw new Error('Invalid login response')
    }
    const { accessToken, username } = parsed.data;

    await getAuthStore().login(accessToken, username)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error)
    throw error
  }
}

export const logout = async (): Promise<void> => {
  try {
    const user = getAuthStore().user
    if (!user) {
      throw new Error('No user found in auth store')
    }

    await apiClient.post('/auth/logout', { email: user.email })
    getAuthStore().logout()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Logout error:', error)
    throw error
  }
}
