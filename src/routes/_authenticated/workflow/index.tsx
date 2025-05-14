import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import Workflow from '@/features/workflow'

export const Route = createFileRoute(
  '/_authenticated/workflow/'
)<RouteStaticData>({
  component: Workflow,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
