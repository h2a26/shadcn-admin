import { ReactNode } from 'react'
import { AuthContextProvider } from '../context/auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => (
  <AuthContextProvider>{children}</AuthContextProvider>
)
