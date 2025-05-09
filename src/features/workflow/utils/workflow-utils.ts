import { WorkflowTask } from '../data/schema'

export function getTaskStatusColor(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const statusMap: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    pending: 'secondary',
    in_progress: 'default',
    completed: 'outline',
    rejected: 'destructive',
    sent_back: 'destructive',
  }

  return statusMap[status] || 'secondary'
}

export function formatTaskStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function getTaskHistory(task: WorkflowTask) {
  return task.history.map((entry) => ({
    action: `${entry.assignedBy} assigned to ${entry.assignedTo} at step ${entry.step}`,
    timestamp: new Date(entry.timestamp).toLocaleString(),
    user: entry.assignedBy,
  }))
}
