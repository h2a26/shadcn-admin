import { ReactNode } from 'react'
import { useMatches } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import { RoleId } from '@/features/users/config/roles.ts'
import { AuthLayout } from './auth-layout'
import { ProtectedLayout } from './protected-layout'

interface RootLayoutProps {
  children: ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const matches = useMatches()
  const currentRoute = matches[matches.length - 1]

  const staticData = currentRoute.staticData as RouteStaticData

  const isPublic = staticData?.isPublic ?? false
  const requiredRoles: RoleId[] = staticData?.requiredRoles ?? []

  return (
    <>
      {
        isPublic ? (
          <AuthLayout>{children}</AuthLayout>
        ) : (
          <ProtectedLayout requiredRoles={requiredRoles}>{children}</ProtectedLayout>
        )
      }
    </>
  )
}
