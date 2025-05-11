import { useMutation } from '@tanstack/react-query'
import { login, logout } from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth-store'

export const useLogin = () =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.accessToken, { email: data.email })
    },
  })

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
    onSuccess: () => {
      useAuthStore.getState().reset()
    },
  })
