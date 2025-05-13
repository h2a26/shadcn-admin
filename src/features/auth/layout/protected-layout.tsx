import { ReactNode, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { RoleId } from '@/features/users/config/roles'

interface ProtectedLayoutProps {
  children: ReactNode
  requiredRoles?: RoleId[]
}

export function ProtectedLayout({
  children,
  requiredRoles,
}: ProtectedLayoutProps) {
  const store = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!store.isAuthenticated) {
      router.navigate({
        to: '/sign-in',
        replace: true,
      })
    } else if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) =>
        store.user?.roles?.includes(role)
      )
      if (!hasRequiredRole) {
        router.navigate({
          to: '/403',
          replace: true,
        })
      }
    }
  }, [store.isAuthenticated, store.user, requiredRoles, router])

  if (store.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}
