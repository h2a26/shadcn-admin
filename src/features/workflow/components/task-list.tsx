import { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { User } from '@/features/users/data/schema'
import { WorkflowTask, WorkflowTaskStatus } from '../data/schema'
import { TaskDetails } from './task-details'

interface TaskListProps {
  tasks: WorkflowTask[]
  users: User[]
  currentUserRole: string
  currentUserId: string
  onTaskUpdated: () => void
  onTaskSelected?: (taskId: string) => void
}

export function TaskList({
  tasks,
  users,
  currentUserRole,
  currentUserId,
  onTaskUpdated,
  onTaskSelected,
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  // Helper function to get username from ID
  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : userId
  }

  // Helper function to format task status for display
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
      }
    > = {
      pending: { label: 'Pending', variant: 'secondary' },
      in_progress: { label: 'In Progress', variant: 'default' },
      completed: { label: 'Completed', variant: 'outline' },
      rejected: { label: 'Rejected', variant: 'destructive' },
      sent_back: { label: 'Sent Back', variant: 'destructive' },
    }

    const statusInfo = statusMap[status] || {
      label: status,
      variant: 'secondary',
    }

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  // Handle task selection
  const handleTaskSelect = (task: WorkflowTask) => {
    setSelectedTask(task)

    // If an external handler is provided, use that instead of opening the dialog
    if (onTaskSelected) {
      onTaskSelected(task.id)
    } else {
      setDialogOpen(true)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => {
      setSelectedTask(null)
    }, 300)
  }

  // Handle task update
  const handleTaskUpdated = () => {
    onTaskUpdated()
    handleDialogClose()
  }

  // Sort tasks by status and updated date
  const statusOrder: Record<WorkflowTaskStatus, number> = {
    pending: 0,
    in_progress: 1,
    sent_back: 2,
    completed: 3,
    rejected: 4,
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusA = statusOrder[a.status] || 999
    const statusB = statusOrder[b.status] || 999

    if (statusA !== statusB) {
      return statusA - statusB
    }

    // If same status, sort by updatedAt
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
            <TableHead>Proposal ID</TableHead>
            <TableHead>Current Step</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='py-4 text-center'>
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className='font-medium'>{task.id}</TableCell>
                <TableCell>{task.proposalId}</TableCell>
                <TableCell className='capitalize'>{task.currentStep}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getUserName(task.assignedTo)}</TableCell>
                <TableCell>{format(task.updatedAt, 'PPp')}</TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleTaskSelect(task)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              currentUserRole={currentUserRole}
              currentUserId={currentUserId}
              users={users}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
