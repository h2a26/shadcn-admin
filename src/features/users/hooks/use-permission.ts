import { Permission, hasPermission } from '../config/roles.ts'

/**
 * Hook-like utility to check permissions programmatically
 * (does not depend on React, safe to use in non-component contexts)
 */
export function usePermission(userRole: string) {
  const check = (permission: Permission): boolean =>
    hasPermission(userRole, permission)

  const checkAny = (permissions: Permission[]): boolean =>
    permissions.some((permission) => hasPermission(userRole, permission))

  const checkAll = (permissions: Permission[]): boolean =>
    permissions.every((permission) => hasPermission(userRole, permission))

  return { check, checkAny, checkAll }
}
