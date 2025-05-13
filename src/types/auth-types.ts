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
  roles: string[]
  token: string
  tokenType: 'Access' | 'Refresh'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, username: string) => Promise<void>
  logout: () => void
  getRoles: () => string[]
  hasRole: (role: string) => boolean
  reset: () => void
}
