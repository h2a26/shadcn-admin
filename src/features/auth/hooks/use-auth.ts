import { useMutation } from '@tanstack/react-query'
import { login, logout } from '@/services/auth-service'

export function useLogin() {
  return useMutation({
    mutationFn: login,
    retry: 0,
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    retry: 0,
  })
}
