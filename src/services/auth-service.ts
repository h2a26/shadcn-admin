import { LoginRequest, LoginResponseSchema } from '@/schemas/auth-schemas'
import { useAuthStore } from '@/stores/auth-store'
import apiClient from './api-client'

export const login = async (credentials: LoginRequest): Promise<void> => {
  const response = await apiClient.post('/auth/login', credentials)
  const parsed = LoginResponseSchema.safeParse(response.data.data)

  if (!parsed.success) throw new Error('Invalid login response')

  const { accessToken, username } = parsed.data
  await useAuthStore.getState().login(accessToken, username)
}

export const logout = async (): Promise<void> => {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('No user to logout')

  await apiClient.post('/auth/logout', { email: user.email })
  useAuthStore.getState().logout()
}
