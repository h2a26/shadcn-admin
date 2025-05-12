import {
  LoginRequest,
  LoginResponse,
  LoginResponseSchema,
} from '@/schemas/auth-schemas'
import apiClient from './api-client'
import { useAuthStore } from '@/stores/auth-store'

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', credentials)
  const parsed = LoginResponseSchema.safeParse(response.data.data)
  if (!parsed.success) {
    throw new Error('Invalid login response')
  }
  return parsed.data
}

export const logout = async (): Promise<void> => {
  const email = useAuthStore.getState().user?.email
  if (!email) {
    throw new Error('User email not found in auth store')
  }

  await apiClient.post('/auth/logout', { email })
}
