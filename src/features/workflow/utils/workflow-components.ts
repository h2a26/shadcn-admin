import React from 'react'
import { WorkflowStatusBadge } from '../components/workflow-status-badge'
import { WorkflowTask } from '../data/schema'
import { getTaskHistory } from '../utils/workflow-utils'

export { WorkflowStatusBadge }

interface WorkflowHistoryProps {
  task: WorkflowTask
}

export const WorkflowHistory: React.FC<WorkflowHistoryProps> = ({ task }) => {
  const history = getTaskHistory(task)

  return React.createElement(
    'div',
    { className: 'space-y-2' },
    history.map((entry, index) =>
      React.createElement(
        'div',
        { key: index, className: 'flex items-center gap-2' },
        React.createElement(
          'span',
          { className: 'text-sm text-muted-foreground' },
          entry.timestamp
        ),
        React.createElement('span', { className: 'text-sm' }, entry.action)
      )
    )
  )
}
