import { createFileRoute } from '@tanstack/react-router'
import Proposal from '@/features/proposal'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/proposal/')<RouteStaticData>({
  component: Proposal,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
