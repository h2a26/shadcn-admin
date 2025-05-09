import React from 'react'
import { WorkflowContextType } from '../data/types'
import { WorkflowContext } from './workflow-context-instance'

export const useWorkflow = (): WorkflowContextType => {
  const context = React.useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
