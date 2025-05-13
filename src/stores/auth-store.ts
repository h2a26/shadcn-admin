import apiClient from '@/services/api-client'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { RoleId } from '@/features/users/config/roles'

export interface JwtPayload {
  sub: string
  iss: string
  iat: number
  exp: number
  rol: string
  typ: 'Access' | 'Refresh'
}

export interface User {
  username: string
  email: string
  roles: RoleId[]
  token: string
  tokenType: 'Access' | 'Refresh'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, username: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
  getRoles: () => RoleId[]
  hasRole: (role: RoleId) => boolean
  reset: () => void
}

const authStore = create<AuthState>(
  (set: (state: Partial<AuthState>) => void, get: () => AuthState) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (token: string, username: string) => {
      set({ isLoading: true })
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        const roles = decoded.rol ? decoded.rol.split(',') : []
        const user = {
          username: username,
          email: decoded.sub,
          roles: roles as RoleId[],
          token: token,
          tokenType: decoded.typ,
        }
        set({ user, isAuthenticated: true })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error decoding JWT token:', error)
        set({ user: null, isAuthenticated: false })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    logout: () => {
      set({ user: null, isAuthenticated: false })
    },

    refresh: async () => {
      const user = get().user
      if (!user) {
        throw new Error('No user found in auth store')
      }

      try {
        const response = await apiClient.post('/auth/refresh', {
          email: user.email,
        })
        const token = response.data.data.accessToken
        const username = response.data.data.username
        const decoded = jwtDecode<JwtPayload>(token)
        if (decoded.typ !== 'Access') {
          throw new Error('Invalid token type. Expected Access token')
        }
        await get().login(token, username)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error refreshing token:', error)
        throw error
      }
    },

    getRoles: (): RoleId[] => {
      const user = get().user
      return user ? user.roles : []
    },

    hasRole: (role: RoleId): boolean => {
      const user = get().user
      return user ? user.roles.includes(role) : false
    },

    reset: () => {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    },
  })
)

export const useAuthStore = () => authStore
export const getAuthStore = (): AuthState => {
  const store = authStore.getState()
  return {
    ...store,
    getRoles: () => store.getRoles(),
    hasRole: (role: RoleId) => store.hasRole(role),
  }
}
