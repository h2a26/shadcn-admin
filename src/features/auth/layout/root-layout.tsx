import { ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { authConfig } from '../config/auth-config'
import { AuthLayout } from './auth-layout'
import { ProtectedLayout } from './protected-layout'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const location = useLocation()
  const isPublicRoute = authConfig.publicRoutes.includes(location.pathname)

  return (
    <>
      {isPublicRoute ? (
        <AuthLayout>{children}</AuthLayout>
      ) : (
        <ProtectedLayout>{children}</ProtectedLayout>
      )}
    </>
  )
}
