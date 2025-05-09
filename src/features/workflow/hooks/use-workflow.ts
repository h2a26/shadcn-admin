import React from 'react'
import { WorkflowContext } from '@/features/workflow/context/workflow-context-instance.ts'
import { WorkflowContextType } from '../data/types'

export const useWorkflow = (): WorkflowContextType => {
  const context = React.useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
