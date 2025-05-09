import { WorkflowTask, WorkflowHistoryEntry } from '../data/schema'

const WORKFLOW_TASKS_STORAGE_KEY = 'workflow_tasks'

/**
 * Get all workflow tasks from local storage
 */
export function getWorkflowTasksFromStorage(): WorkflowTask[] {
  try {
    const tasksJson = localStorage.getItem(WORKFLOW_TASKS_STORAGE_KEY)
    if (!tasksJson) return []

    const parsedTasks = JSON.parse(tasksJson)

    // Convert string dates back to Date objects
    return parsedTasks.map(
      (
        task: Omit<WorkflowTask, 'createdAt' | 'updatedAt' | 'history'> & {
          createdAt: string
          updatedAt: string
          history: Array<
            Omit<WorkflowHistoryEntry, 'timestamp'> & { timestamp: string }
          >
        }
      ) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        history: task.history.map((entry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        })),
      })
    )
  } catch {
    // If there's an error parsing, return an empty array
    return []
  }
}

/**
 * Get workflow tasks assigned to a specific user
 */
export function getWorkflowTasksForUser(userId: string): WorkflowTask[] {
  const allTasks = getWorkflowTasksFromStorage()
  return allTasks.filter((task) => task.assignedTo === userId)
}

/**
 * Get a specific workflow task by ID
 */
export function getWorkflowTaskById(taskId: string): WorkflowTask | null {
  const allTasks = getWorkflowTasksFromStorage()
  return allTasks.find((task) => task.id === taskId) || null
}

/**
 * Get workflow tasks for a specific proposal
 */
export function getWorkflowTasksForProposal(
  proposalId: string
): WorkflowTask[] {
  const allTasks = getWorkflowTasksFromStorage()
  return allTasks.filter((task) => task.proposalId === proposalId)
}

/**
 * Save workflow tasks to local storage
 */
export function saveWorkflowTaskToStorage(
  tasks: WorkflowTask | WorkflowTask[]
): void {
  try {
    const existingTasks = getWorkflowTasksFromStorage()
    const updatedTasks = Array.isArray(tasks)
      ? [...existingTasks, ...tasks]
      : [...existingTasks, tasks]
    localStorage.setItem(
      WORKFLOW_TASKS_STORAGE_KEY,
      JSON.stringify(updatedTasks)
    )
  } catch (error) {
    throw new Error(
      `Error saving to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a workflow task from local storage
 */
export function deleteWorkflowTaskFromStorage(taskId: string): boolean {
  const allTasks = getWorkflowTasksFromStorage()
  const filteredTasks = allTasks.filter((task) => task.id !== taskId)

  // If no tasks were removed, return false
  if (filteredTasks.length === allTasks.length) {
    return false
  }

  // Save the filtered tasks back to local storage
  localStorage.setItem(
    WORKFLOW_TASKS_STORAGE_KEY,
    JSON.stringify(filteredTasks)
  )
  return true
}

/**
 * Generate a unique ID for a new workflow task
 */
export function generateWorkflowTaskId(): string {
  return `wf-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}
