import { createFileRoute } from '@tanstack/react-router'
import Workflow from '@/features/workflow'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/workflow/')<RouteStaticData>({
  component: Workflow,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
