import { ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { getAuthStore } from '@/stores/auth-store'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const store = getAuthStore()
  const router = useRouter()

  if (store.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (store.isAuthenticated) {
    router.navigate({
      to: '/',
      replace: true,
    })
    return null
  }

  return <>{children}</>
}
