import { ReactNode } from 'react'
import { AuthContextProvider } from '../context/auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
