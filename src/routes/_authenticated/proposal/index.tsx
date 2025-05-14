import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import Proposal from '@/features/proposal'

export const Route = createFileRoute(
  '/_authenticated/proposal/'
)<RouteStaticData>({
  component: Proposal,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
