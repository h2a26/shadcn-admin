import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import ComingSoon from '@/components/coming-soon'

export const Route = createFileRoute(
  '/_authenticated/help-center/'
)<RouteStaticData>({
  component: ComingSoon,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
