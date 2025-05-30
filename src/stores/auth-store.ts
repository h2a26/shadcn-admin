import { AuthState, User } from '@/types/auth-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { extractAuthorities, parseJwt } from '@/utils/jwt-utils'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (token, username) => {
        set({ isLoading: true })
        try {
          const decoded = parseJwt(token)
          const { roles, permissions } = extractAuthorities(decoded)

          const user: User = {
            username,
            email: decoded.sub,
            roles,
            permissions,
            token,
            tokenType: decoded.typ,
          }

          set({ user, isAuthenticated: true })
        } catch (error) {
          set({ user: null, isAuthenticated: false })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      getRoles: () => get().user?.roles ?? [],

      hasRole: (role) => get().user?.roles.includes(role) ?? false,

      getPermissions: () => get().user?.roles ?? [],

      hasPermission: (permission) =>
        get().user?.permissions.includes(permission) ?? false,

      reset: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    { name: 'auth-store' }
  )
)
