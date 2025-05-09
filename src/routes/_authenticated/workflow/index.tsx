import { createFileRoute } from '@tanstack/react-router'
import Workflow from '@/features/workflow'

export const Route = createFileRoute('/_authenticated/workflow/')({
  component: Workflow,
})
