import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: IconExclamationCircle,
    variant: 'secondary',
  },
  {
    value: 'workflow',
    label: 'Workflow',
    icon: IconCircle,
    variant: 'default',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    icon: IconStopwatch,
    variant: 'default',
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: IconCircleCheck,
    variant: 'outline',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: IconCircleX,
    variant: 'destructive',
  },
  {
    value: 'sent_back',
    label: 'Sent Back',
    icon: IconArrowLeft,
    variant: 'destructive',
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]
