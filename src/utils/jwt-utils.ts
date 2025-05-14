import { JwtPayload as BaseJwtPayload } from '@/types/auth-types'
import { jwtDecode } from 'jwt-decode'

export const parseJwt = (token: string): BaseJwtPayload => {
  try {
    return jwtDecode<BaseJwtPayload>(token)
  } catch {
    throw new Error('Invalid JWT token')
  }
}

export const isAccessToken = (jwt: BaseJwtPayload): boolean =>
  jwt.typ === 'Access'

export interface Authorities {
  roles: string[]
  permissions: string[]
}

const ROLE_PREFIX = 'ROLE_'
const PERMISSION_PREFIX = 'PERMISSION_'

export const extractAuthorities = (jwt: BaseJwtPayload): Authorities => {
  const authorities = (jwt?.rol ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)

  return authorities.reduce<Authorities>(
    (acc, authority) => ({
      roles: authority.startsWith(ROLE_PREFIX)
        ? [...acc.roles, authority]
        : acc.roles,
      permissions: authority.startsWith(PERMISSION_PREFIX)
        ? [...acc.permissions, authority]
        : acc.permissions,
    }),
    { roles: [], permissions: [] }
  )
}
