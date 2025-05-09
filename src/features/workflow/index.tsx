import React from 'react'
import { WorkflowProvider } from './context/workflow-context'

interface WorkflowProps {
  children: React.ReactNode
  product?: string
}

export default function Workflow({
  children,
  product = 'ParcelInsurance',
}: WorkflowProps) {
  return <WorkflowProvider product={product}>{children}</WorkflowProvider>
}
