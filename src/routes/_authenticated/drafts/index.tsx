import { createFileRoute } from '@tanstack/react-router'
import Drafts from '@/features/drafts'
import { RouteStaticData } from '@/types/route-data.ts'

export const Route = createFileRoute('/_authenticated/drafts/')<RouteStaticData>({
  component: Drafts,
  staticData: {
    isPublic: false,
    requiredRoles: ['ROLE_ADMIN'],
  },
})
