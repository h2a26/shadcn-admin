import { RoleId } from '@/features/users/config/roles'

export interface AuthConfig {
  publicRoutes: string[]
  defaultRedirect: {
    authenticated: string
    unauthenticated: string
  }
  roleBasedAccess: Record<string, RoleId[]>
  token: {
    access: {
      maxAge: number
      refreshInterval: number
    }
    refresh: {
      maxAge: number
    }
  }
}

export const authConfig: AuthConfig = {
  publicRoutes: [
    '/(auth)/sign-in',
    '/(auth)/sign-up',
    '/(auth)/forgot-password',
  ],
  defaultRedirect: {
    authenticated: '/_authenticated',
    unauthenticated: '/(auth)/sign-in',
  },
  roleBasedAccess: {
    '/_authenticated/workflow': ['ROLE_ADMIN', 'ROLE_UNDERWRITER'],
    '/_authenticated/proposal': [
      'ROLE_ADMIN',
      'ROLE_UNDERWRITER',
      'ROLE_APPROVER',
    ],
    '/_authenticated/users': ['ROLE_ADMIN'],
    '/_authenticated/settings': ['ROLE_ADMIN', 'ROLE_MANAGER'],
  },
  token: {
    access: {
      maxAge: 900,
      refreshInterval: 300,
    },
    refresh: {
      maxAge: 86400,
    },
  },
}