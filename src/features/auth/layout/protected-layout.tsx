import { ReactNode, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { RoleId } from '@/features/users/config/roles'
import { useAuthContext } from '../context/auth-context'

interface ProtectedLayoutProps {
  children: ReactNode
  requiredRoles?: RoleId[]
}

export const ProtectedLayout = ({
  children,
  requiredRoles,
}: ProtectedLayoutProps) => {
  const { isLoading, isAuthenticated, user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/sign-in', replace: true })
      return
    }

    if (
      requiredRoles?.length &&
      !requiredRoles.some((role) => user?.roles.includes(role))
    ) {
      router.navigate({ to: '/403', replace: true })
    }
  }, [isAuthenticated, requiredRoles, router, user])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}
