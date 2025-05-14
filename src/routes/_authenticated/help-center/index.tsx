import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/help-center/')<RouteStaticData>({
  component: ComingSoon,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
