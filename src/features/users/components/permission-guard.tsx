import { ReactNode } from 'react'
import { Permission, hasPermission } from '../config/roles.ts'

/**
 * PermissionGuard component
 *
 * A component that conditionally renders its children based on user permissions
 * If the user doesn't have the required permission, it renders nothing or a fallback
 */
interface PermissionGuardProps {
  userRole: string
  requiredPermission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({
  userRole,
  requiredPermission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const hasAccess = hasPermission(userRole, requiredPermission)

  return hasAccess ? <>{children}</> : fallback ? <>{fallback}</> : null
}
