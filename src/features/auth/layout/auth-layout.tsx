import { ReactNode, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '../context/auth-context'

interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isLoading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}