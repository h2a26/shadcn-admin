import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import Users from '@/features/users'

export const Route = createFileRoute('/_authenticated/users/')<RouteStaticData>(
  {
    component: Users,
    staticData: {
      isPublic: false,
      requiredRoles: ['ROLE_ADMIN'],
    },
  }
)
