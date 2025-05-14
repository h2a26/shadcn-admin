import { createFileRoute } from '@tanstack/react-router'
import Tasks from '@/features/tasks'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/tasks/')<RouteStaticData>({
  component: Tasks,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
