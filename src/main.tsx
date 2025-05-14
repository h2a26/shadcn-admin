import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/utils/handle-server-error'
import { AuthProvider } from '@/features/auth/providers/auth-provider'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })
        if (import.meta.env.PROD && failureCount > 3) return false
        if (
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
          return false
        return true
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10_000,
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)
        if (error instanceof AxiosError && error.response?.status === 304) {
          toast.error('Content not modified!')
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (!(error instanceof AxiosError)) return

      const { status } = error.response ?? {}
      if (status === 401) {
        toast.error('Session expired!')
        useAuthStore.getState().logout()
        const redirect = `${router.history.location.href}`
        router.navigate({ to: '/sign-in', search: { redirect } })
      } else if (status === 500) {
        toast.error('Internal Server Error!')
        router.navigate({ to: '/500' })
      }
    },
  }),
})

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
