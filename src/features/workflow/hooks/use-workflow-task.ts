import { useState, useEffect } from 'react'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'
import { WorkflowTask, WorkflowStep } from '../data/schema'
import {
  transitionTask,
  reassignTask,
  sendBackTask,
  completeTask,
  getStepConfig,
} from '../utils/engine'

export function useWorkflowTask(proposalId: string): {
  task: WorkflowTask | null
  isLoading: boolean
  error: string | null
  transitionTaskToNextStep: (
    nextStep: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => Promise<boolean>
  reassignTaskToUser: (
    newAssignee: string,
    assignedBy: string,
    comments?: string
  ) => Promise<boolean>
  sendTaskBack: (
    previousStep: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => Promise<boolean>
  completeWorkflowTask: (
    completedBy: string,
    comments?: string
  ) => Promise<boolean>
  refresh: () => Promise<void>
} {
  const { tasks, config } = useWorkflow()
  const [task, setTask] = useState<WorkflowTask | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tasks || !config) return

    const proposalTasks = tasks.filter((t) => t.proposalId === proposalId)

    if (proposalTasks.length === 0) {
      setError('No workflow task found for this proposal')
      setIsLoading(false)
      return
    }

    try {
      // Find active tasks (not completed)
      const activeTasks = proposalTasks.filter((t) => t.status !== 'completed')

      if (activeTasks.length > 0) {
        // Sort by updatedAt descending and get the first one
        const mostRecentTask = [...activeTasks].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0]

        setTask(mostRecentTask)
      } else {
        // If no active tasks, get the most recent completed task
        const mostRecentTask = [...tasks].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0]

        setTask(mostRecentTask)
      }

      setIsLoading(false)
    } catch (err) {
      setError('Error loading workflow task ' + err)
      setIsLoading(false)
    }
  }, [proposalId, tasks, config])

  return {
    task,
    isLoading,
    error,
    transitionTaskToNextStep: async (
      nextStep: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): Promise<boolean> => {
      if (!task || !config) return false

      try {
        const stepConfig = getStepConfig(config, task.currentStep)
        if (!stepConfig?.nextSteps.includes(nextStep)) {
          throw new Error('Invalid next step')
        }

        const updatedTask = transitionTask(
          task,
          nextStep,
          assignedTo,
          assignedBy,
          comments
        )

        setTask(updatedTask)
        return true
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error transitioning task'
        setError(errorMessage)
        return false
      }
    },
    reassignTaskToUser: async (
      newAssignee: string,
      assignedBy: string,
      comments?: string
    ): Promise<boolean> => {
      if (!task || !config) return false

      try {
        const stepConfig = getStepConfig(config, task.currentStep)
        if (!stepConfig?.allowReassignment) {
          throw new Error('Reassignment not allowed for this step')
        }

        const updatedTask = reassignTask(
          task,
          newAssignee,
          assignedBy,
          comments
        )

        setTask(updatedTask)
        return true
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error reassigning task'
        )
        return false
      }
    },
    sendTaskBack: async (
      previousStep: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): Promise<boolean> => {
      if (!task || !config) return false

      try {
        const stepConfig = getStepConfig(config, task.currentStep)
        if (!stepConfig?.allowSendBack) {
          throw new Error('Send back not allowed for this step')
        }

        const updatedTask = sendBackTask(
          task,
          previousStep,
          assignedTo,
          assignedBy,
          comments
        )

        setTask(updatedTask)
        return true
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error sending task back'
        )
        return false
      }
    },
    completeWorkflowTask: async (
      completedBy: string,
      comments?: string
    ): Promise<boolean> => {
      if (!task) return false

      try {
        const updatedTask = completeTask(task, completedBy, comments)

        if (updatedTask) {
          setTask(updatedTask)
          return true
        }
        return false
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error completing task')
        return false
      }
    },
    refresh: async () => {
      setIsLoading(true)
      setError(null)
      setTask(null)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    },
  }
}
