import {
  WorkflowConfig,
  StepConfig,
  WorkflowTask,
  WorkflowHistoryEntry,
  WorkflowStep,
  workflowTaskSchema,
} from '../data/schema'

/**
 * Get a specific step configuration from the workflow config
 */
export function getStepConfig(
  config: WorkflowConfig,
  stepName: string
): StepConfig | undefined {
  return config.steps.find((step) => step.name === stepName)
}

/**
 * Get available next steps for the current step
 */
export function getAvailableNextSteps(
  config: WorkflowConfig,
  currentStep: string
): StepConfig[] {
  const step = getStepConfig(config, currentStep)
  if (!step) return []

  return config.steps.filter((s) => step.nextSteps.includes(s.name))
}

/**
 * Check if a user with the given role can be assigned to the specified step
 */
export function canAssignToStep(
  config: WorkflowConfig,
  stepName: string,
  role: string
): boolean {
  const step = getStepConfig(config, stepName)
  if (!step) return false

  return step.roles.includes(role)
}

/**
 * Get available assignees based on role filtering
 */
export function getAvailableAssignees(
  config: WorkflowConfig,
  currentStep: string,
  currentUserRole: string,
  allUsers: { id: string; role: string }[]
): { id: string; role: string }[] {
  // Get role-based filtering for the current step
  const roleFiltering = config.roleBasedFiltering[currentStep]
  if (!roleFiltering) return []

  // Get allowed roles for the next step based on current user's role
  const allowedRoles = roleFiltering[currentUserRole] || []

  // Filter users by allowed roles for the next step
  return allUsers.filter((user) => allowedRoles.includes(user.role))
}

/**
 * Check if a user can perform an action on a step
 */
export function canPerformAction(
  config: WorkflowConfig,
  stepName: string,
  action: 'reassign' | 'sendBack',
  userRole: string
): boolean {
  const step = getStepConfig(config, stepName)
  if (!step) return false

  // Check if the step allows the action
  if (action === 'reassign' && !step.allowReassignment) return false
  if (action === 'sendBack' && !step.allowSendBack) return false

  // Check if the user's role is allowed for this step
  return step.roles.includes(userRole)
}

/**
 * Create a new history entry for a workflow task
 */
export function createHistoryEntry(
  step: string,
  assignedTo: string,
  assignedBy: string,
  comments?: string
): WorkflowHistoryEntry {
  return {
    step,
    assignedTo,
    assignedBy,
    timestamp: new Date().toISOString(),
    comments,
  }
}

/**
 * Transition a workflow task to a new step
 */
export function transitionTask(
  task: WorkflowTask,
  nextStep: WorkflowStep,
  assignedTo: string,
  assignedBy: string,
  comments?: string
): WorkflowTask {
  const now = new Date()
  const historyEntry = createHistoryEntry(
    nextStep,
    assignedTo,
    assignedBy,
    comments
  )

  const updatedTask = {
    ...task,
    currentStep: nextStep,
    assignedTo,
    status: 'in_progress',
    history: [...task.history, historyEntry],
    updatedAt: now.toISOString(),
  }

  return workflowTaskSchema.parse(updatedTask)
}

/**
 * Reassign a workflow task to another user within the same step
 */
export function reassignTask(
  task: WorkflowTask,
  newAssignee: string,
  assignedBy: string,
  comments?: string
): WorkflowTask {
  const now = new Date()
  const historyEntry = createHistoryEntry(
    task.currentStep,
    newAssignee,
    assignedBy,
    comments
  )

  const updatedTask = {
    ...task,
    assignedTo: newAssignee,
    history: [...task.history, historyEntry],
    updatedAt: now.toISOString(),
  }

  return workflowTaskSchema.parse(updatedTask)
}

/**
 * Send a workflow task back to a previous step
 */
export function sendBackTask(
  task: WorkflowTask,
  previousStep: WorkflowStep,
  assignedTo: string,
  assignedBy: string,
  comments?: string
): WorkflowTask {
  const now = new Date()
  const historyEntry = createHistoryEntry(
    previousStep,
    assignedTo,
    assignedBy,
    comments
  )

  const updatedTask = {
    ...task,
    currentStep: previousStep,
    assignedTo,
    status: 'sent_back',
    history: [...task.history, historyEntry],
    updatedAt: now.toISOString(),
  }

  return workflowTaskSchema.parse(updatedTask)
}

/**
 * Complete a workflow task
 */
export function completeTask(
  task: WorkflowTask,
  completedBy: string,
  comments?: string
): WorkflowTask {
  const now = new Date()
  const historyEntry = createHistoryEntry(
    task.currentStep,
    completedBy,
    completedBy,
    comments
  )

  const updatedTask = {
    ...task,
    status: 'completed',
    history: [...task.history, historyEntry],
    updatedAt: now.toISOString(),
  }

  return workflowTaskSchema.parse(updatedTask)
}
