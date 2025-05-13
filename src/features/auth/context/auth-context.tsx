import React, { createContext, useContext } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { RoleId } from '@/features/users/config/roles'

interface AuthContextType {
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

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const store = useAuthStore()

  const value = {
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    user: store.user,
    hasRole: store.hasRole,
    getRoles: store.getRoles,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
