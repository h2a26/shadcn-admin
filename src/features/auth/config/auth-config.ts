import { RoleId } from '@/features/users/config/roles'

export interface AuthConfig {
  // Public routes that don't require authentication
  publicRoutes: string[]

  // Default redirect paths
  defaultRedirect: {
    authenticated: string
    unauthenticated: string
  }

  // Role-based access control configuration
  roleBasedAccess: {
    [key: string]: RoleId[]
  }

  // Token configuration
  token: {
    access: {
      maxAge: number // in seconds
      refreshInterval: number // in seconds
    }
    refresh: {
      maxAge: number // in seconds
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
      maxAge: 900, // 15 minutes
      refreshInterval: 300, // 5 minutes
    },
    refresh: {
      maxAge: 86400, // 24 hours
    },
  },
}
