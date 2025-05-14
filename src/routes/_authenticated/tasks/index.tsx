import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import Tasks from '@/features/tasks'

export const Route = createFileRoute('/_authenticated/tasks/')<RouteStaticData>(
  {
    component: Tasks,
    staticData: {
      isPublic: false,
      requiredRoles: ['ROLE_ADMIN'],
    },
  }
)
