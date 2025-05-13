import { JwtPayload as BaseJwtPayload } from '@/types/auth-types'
import { jwtDecode } from 'jwt-decode'

export const parseJwt = (token: string): BaseJwtPayload => {
  try {
    return jwtDecode<BaseJwtPayload>(token)
  } catch {
    throw new Error('Invalid JWT token')
  }
}

export const extractRoles = (jwt: BaseJwtPayload): string[] => {
  return jwt.rol ? jwt.rol.split(',') : []
}

export const isAccessToken = (jwt: BaseJwtPayload): boolean =>
  jwt.typ === 'Access'
