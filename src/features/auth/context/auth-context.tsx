import React, { createContext, useContext } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { RoleId } from '@/features/users/config/roles'

export interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    email: string
    roles: RoleId[]
  } | null
  hasRole: (role: RoleId) => boolean
  getRoles: () => RoleId[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within AuthProvider')
  return context
}

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user, hasRole, getRoles } = useAuthStore()

  const value = {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    getRoles,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}