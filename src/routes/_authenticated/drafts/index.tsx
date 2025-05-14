import { createFileRoute } from '@tanstack/react-router'
import { RouteStaticData } from '@/types/route-data.ts'
import Drafts from '@/features/drafts'

export const Route = createFileRoute(
  '/_authenticated/drafts/'
)<RouteStaticData>({
  component: Drafts,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
