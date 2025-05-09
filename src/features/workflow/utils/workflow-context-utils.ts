import { WorkflowTask, workflowTaskSchema } from '../data/schema'
import { WorkflowDialogType } from '../data/types'

export function isWorkflowDialogType(
  value: unknown
): value is WorkflowDialogType {
  return (
    value === null ||
    ['assign', 'reassign', 'sendBack', 'complete'].includes(value as string)
  )
}

export function isWorkflowTask(value: unknown): value is WorkflowTask {
  try {
    workflowTaskSchema.parse(value)
    return true
  } catch {
    return false
  }
}
