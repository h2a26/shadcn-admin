import React, { useEffect, useState, useCallback } from 'react'
import { getWorkflowConfig } from '../data/config'
import {
  WorkflowTask,
  WorkflowConfig,
  StepConfig,
  WorkflowHistoryEntry,
  workflowTaskSchema,
  WorkflowStep,
} from '../data/schema'
import {
  getStepConfig,
  createHistoryEntry,
  transitionTask,
  reassignTask,
  sendBackTask,
  completeTask,
} from '../utils/engine'
import {
  getWorkflowTasksFromStorage,
  saveWorkflowTaskToStorage,
  deleteWorkflowTaskFromStorage,
  generateWorkflowTaskId,
} from '../utils/storage-utils'

interface WorkflowContextType {
  currentTask: WorkflowTask | null
  setCurrentTask: (task: WorkflowTask | null) => void
  tasks: WorkflowTask[]
  config: WorkflowConfig | null
  refreshTasks: () => void
  createTask: (
    proposalId: string,
    step: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  updateTask: (task: WorkflowTask) => void
  deleteTask: (taskId: string) => void
  getStepConfig: (
    config: WorkflowConfig,
    stepName: string
  ) => StepConfig | undefined
  createHistoryEntry: (
    step: string,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowHistoryEntry
  transitionTask: (
    task: WorkflowTask,
    stepId: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  reassignTask: (
    task: WorkflowTask,
    userId: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  sendBackTask: (
    task: WorkflowTask,
    stepId: WorkflowStep,
    assignedTo: string,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  completeTask: (
    task: WorkflowTask,
    assignedBy: string,
    comments?: string
  ) => WorkflowTask
  getTaskById: (id: string) => WorkflowTask | undefined
}

const WorkflowContext = React.createContext<WorkflowContextType | null>(null)

interface Props {
  children: React.ReactNode
  product?: string
}

export function WorkflowProvider({
  children,
  product = 'ParcelInsurance',
}: Props) {
  const [tasks, setTasks] = useState<WorkflowTask[]>([])
  const [config, setConfig] = useState<WorkflowConfig | null>(null)

  const refreshTasks = useCallback(() => {
    const storedTasks = getWorkflowTasksFromStorage()
    const validatedTasks = storedTasks.filter((task): task is WorkflowTask => {
      try {
        workflowTaskSchema.parse(task)
        return true
      } catch {
        return false
      }
    })
    setTasks(validatedTasks)
  }, [])

  useEffect(() => {
    const config = getWorkflowConfig(product)
    setConfig(config)
    refreshTasks()
  }, [product, refreshTasks])

  const createTask = useCallback(
    (
      proposalId: string,
      step: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): WorkflowTask => {
      const taskId = generateWorkflowTaskId()
      const historyEntry = createHistoryEntry(
        step,
        assignedTo,
        assignedBy,
        comments
      )

      const newTask: WorkflowTask = {
        id: taskId,
        proposalId,
        currentStep: step,
        status: 'pending',
        assignedTo,
        assignedBy,
        history: [historyEntry],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveWorkflowTaskToStorage(newTask)
      refreshTasks()
      return newTask
    },
    [refreshTasks]
  )

  const updateTask = useCallback(
    (task: WorkflowTask) => {
      saveWorkflowTaskToStorage(task)
      refreshTasks()
    },
    [refreshTasks]
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      deleteWorkflowTaskFromStorage(taskId)
      refreshTasks()
    },
    [refreshTasks]
  )

  const value: WorkflowContextType = {
    currentTask: null,
    setCurrentTask: () => {},
    tasks,
    config,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    getStepConfig: (config: WorkflowConfig, stepName: string) =>
      getStepConfig(config, stepName),
    createHistoryEntry: (
      step: string,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ) => createHistoryEntry(step, assignedTo, assignedBy, comments),
    transitionTask: (
      task: WorkflowTask,
      stepId: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ) => {
      const updatedTask = transitionTask(
        task,
        stepId,
        assignedTo,
        assignedBy,
        comments
      )
      updateTask(updatedTask)
      return updatedTask
    },
    reassignTask: (
      task: WorkflowTask,
      userId: string,
      assignedBy: string,
      comments?: string
    ) => {
      const updatedTask = reassignTask(task, userId, assignedBy, comments)
      updateTask(updatedTask)
      return updatedTask
    },
    sendBackTask: (
      task: WorkflowTask,
      stepId: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ) => {
      const updatedTask = sendBackTask(
        task,
        stepId,
        assignedTo,
        assignedBy,
        comments
      )
      updateTask(updatedTask)
      return updatedTask
    },
    completeTask: (
      task: WorkflowTask,
      assignedBy: string,
      comments?: string
    ) => {
      const updatedTask = completeTask(task, assignedBy, comments)
      updateTask(updatedTask)
      return updatedTask
    },
    getTaskById: (id: string): WorkflowTask | undefined => {
      return tasks.find((task) => task.id === id)
    },
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkflow(): WorkflowContextType {
  const context = React.useContext(WorkflowContext)
  if (context === null) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
