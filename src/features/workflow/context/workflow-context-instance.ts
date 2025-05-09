// workflow-context-instance.ts
import React from 'react'
import { WorkflowContextType } from '../data/types'

export const WorkflowContext = React.createContext<
  WorkflowContextType | undefined
>(undefined)
