import { WorkflowTask } from '@/features/workflow/data/schema'

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'sent_back'
  | 'workflow'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  label: string
  priority: string
  workflowTask?: WorkflowTask
}
