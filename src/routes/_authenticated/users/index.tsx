import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/users/')<RouteStaticData>({
  component: Users,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
