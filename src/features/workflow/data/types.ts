import { getWorkflowConfig } from './config'
import { WorkflowTask, WorkflowStep } from './schema'
import { WorkflowConfig } from './schema'

export type WorkflowDialogType =
  | 'assign'
  | 'reassign'
  | 'sendBack'
  | 'complete'
  | null

export interface WorkflowContextType {
  // Dialog state
  open: WorkflowDialogType
  setOpen: (dialog: WorkflowDialogType) => void

  // Current task being worked on
  currentTask: WorkflowTask | null
  setCurrentTask: (task: unknown) => void

  // All tasks for the current user
  tasks: WorkflowTask[]

  // Current workflow configuration
  config: WorkflowConfig | null

  // Task retrieval
  getTaskById: (taskId: string) => WorkflowTask | null

  // Actions
  loadWorkflowConfig: typeof getWorkflowConfig
  createTask: (
    proposalId: string,
    initialStep: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  transitionTaskToNextStep: (
    taskId: string,
    nextStep: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask | null
  reassignTaskToUser: (
    taskId: string,
    newAssignee: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask | null
  sendTaskBack: (
    taskId: string,
    previousStep: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask | null
  completeWorkflowTask: (
    taskId: string,
    completedBy: string,
    comments?: string
  ) => WorkflowTask | null
  refreshTasks: () => Promise<void>
}
