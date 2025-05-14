import React, { createContext, useContext } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { PermissionId, RoleId } from '@/features/users/config/roles'

export interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    email: string
    roles: RoleId[]
  } | null
  hasRole: (role: RoleId) => boolean
  getRoles: () => RoleId[]
  hasPermission: (permission: PermissionId) => boolean
  getPermissions: () => PermissionId[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuthContext must be used within AuthProvider')
  return context
}

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    getRoles,
    hasPermission,
    getPermissions,
  } = useAuthStore()

  const value = {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    getRoles,
    hasPermission,
    getPermissions,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
