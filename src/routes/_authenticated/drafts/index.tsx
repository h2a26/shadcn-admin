import { createFileRoute } from '@tanstack/react-router'
import Drafts from '@/features/drafts'

export const Route = createFileRoute('/_authenticated/drafts/')({
  component: Drafts,
})
