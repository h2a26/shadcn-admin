import React, { useState, useCallback, useEffect } from 'react'
import {
  isWorkflowDialogType,
  isWorkflowTask,
} from '@/features/workflow/utils/workflow-context-utils.ts'
import { getWorkflowConfig } from '../data/config'
import {
  WorkflowConfig,
  WorkflowTask,
  WorkflowTaskStatus,
  workflowTaskSchema,
  WorkflowStep,
} from '../data/schema'
import { WorkflowContextType, WorkflowDialogType } from '../data/types'
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
  generateWorkflowTaskId,
} from '../utils/storage-utils'
import { WorkflowContext } from './workflow-context-instance'

interface Props {
  children: React.ReactNode
  product?: string
}

export function WorkflowProvider({
  children,
  product = 'ParcelInsurance',
}: Props) {
  const [open, setOpen] = useState<WorkflowDialogType>(null)
  const [currentTask, setCurrentTask] = useState<WorkflowTask | null>(null)
  const [tasks, setTasks] = useState<WorkflowTask[]>([])
  const [config, setConfig] = useState<WorkflowConfig | null>(null)

  useEffect(() => {
    const workflowConfig = getWorkflowConfig(product)
    setConfig(workflowConfig)

    const storedTasks = getWorkflowTasksFromStorage() || []
    const validatedTasks = storedTasks.filter((task) => {
      try {
        workflowTaskSchema.parse(task)
        return true
      } catch {
        return false
      }
    })
    setTasks(validatedTasks)
  }, [product])

  const getTaskById = useCallback(
    (taskId: string): WorkflowTask | null =>
      tasks.find((task) => task.id === taskId) || null,
    [tasks]
  )

  const setDialog = useCallback((dialog: unknown) => {
    if (isWorkflowDialogType(dialog)) {
      setOpen(dialog)
    }
  }, [])

  const createTask = useCallback(
    (
      proposalId: string,
      initialStep: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): WorkflowTask => {
      const now = new Date()
      const task: WorkflowTask = {
        id: generateWorkflowTaskId(),
        proposalId,
        currentStep: initialStep,
        assignedTo,
        assignedBy,
        status: 'in_progress' as WorkflowTaskStatus,
        history: [
          createHistoryEntry(initialStep, assignedTo, assignedBy, comments),
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }

      const validatedTask = workflowTaskSchema.parse(task)
      const updatedTasks = [...tasks, validatedTask]
      setTasks(updatedTasks)
      saveWorkflowTaskToStorage(updatedTasks)
      return validatedTask
    },
    [tasks]
  )

  const handleTransition = useCallback(
    (
      taskId: string,
      nextStep: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): WorkflowTask | null => {
      const task = getTaskById(taskId)
      if (!task || !config) return null

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig?.nextSteps.includes(nextStep)) return null

      const updatedTask = workflowTaskSchema.parse(
        transitionTask(task, nextStep, assignedTo, assignedBy, comments)
      )

      const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
      setTasks(updatedTasks)
      saveWorkflowTaskToStorage(updatedTasks)
      return updatedTask
    },
    [getTaskById, tasks, config]
  )

  const handleReassign = useCallback(
    (
      taskId: string,
      newAssignee: string,
      assignedBy: string,
      comments?: string
    ): WorkflowTask | null => {
      const task = getTaskById(taskId)
      if (!task || !config) return null

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig?.allowReassignment) return null

      const updatedTask = workflowTaskSchema.parse(
        reassignTask(task, newAssignee, assignedBy, comments)
      )

      const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
      setTasks(updatedTasks)
      saveWorkflowTaskToStorage(updatedTasks)
      return updatedTask
    },
    [getTaskById, tasks, config]
  )

  const handleSendBack = useCallback(
    (
      taskId: string,
      previousStep: WorkflowStep,
      assignedTo: string,
      assignedBy: string,
      comments?: string
    ): WorkflowTask | null => {
      const task = getTaskById(taskId)
      if (!task || !config) return null

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig?.allowSendBack) return null

      const updatedTask = workflowTaskSchema.parse(
        sendBackTask(task, previousStep, assignedTo, assignedBy, comments)
      )

      const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
      setTasks(updatedTasks)
      saveWorkflowTaskToStorage(updatedTasks)
      return updatedTask
    },
    [getTaskById, tasks, config]
  )

  const handleComplete = useCallback(
    (
      taskId: string,
      completedBy: string,
      comments?: string
    ): WorkflowTask | null => {
      const task = getTaskById(taskId)
      if (!task || !config) return null

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig?.nextSteps.includes('completed')) return null

      const updatedTask = workflowTaskSchema.parse(
        completeTask(task, completedBy, comments)
      )

      const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
      setTasks(updatedTasks)
      saveWorkflowTaskToStorage(updatedTasks)
      return updatedTask
    },
    [getTaskById, tasks, config]
  )

  const value: WorkflowContextType = {
    open,
    setOpen: setDialog,
    currentTask,
    setCurrentTask: (task: unknown) => {
      if (isWorkflowTask(task)) {
        setCurrentTask(task)
      }
    },
    tasks,
    config,
    getTaskById,
    loadWorkflowConfig: getWorkflowConfig,
    createTask,
    transitionTaskToNextStep: handleTransition,
    reassignTaskToUser: handleReassign,
    sendTaskBack: handleSendBack,
    completeWorkflowTask: handleComplete,
    refreshTasks: async () => {
      const storedTasks = getWorkflowTasksFromStorage() || []
      const validatedTasks = storedTasks.filter((task) => {
        try {
          workflowTaskSchema.parse(task)
          return true
        } catch {
          return false
        }
      })
      setTasks(validatedTasks)
    },
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}
