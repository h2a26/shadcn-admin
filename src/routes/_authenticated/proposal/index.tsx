import { createFileRoute } from '@tanstack/react-router'
import Proposal from '@/features/proposal'

export const Route = createFileRoute('/_authenticated/proposal/')({
  component: Proposal,
})
