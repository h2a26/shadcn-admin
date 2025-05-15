import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/(auth)/sign-in')<RouteStaticData>({
  component: SignIn,
  staticData: {
    isPublic: true,
  },
})
