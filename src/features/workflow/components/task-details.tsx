import { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from '@/features/users/data/schema'
import { WorkflowTask } from '../data/schema'
import { StepTransition } from './step-transition'
import { TaskHistory } from './task-history'

interface TaskDetailsProps {
  task: WorkflowTask
  currentUserRole: string
  currentUserId: string
  users: User[]
  onTaskUpdated: () => void
}

export function TaskDetails({
  task,
  currentUserRole,
  currentUserId,
  users,
  onTaskUpdated,
}: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<string>('details')

  // Helper function to get user name from ID
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

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Task: {task.id}</CardTitle>
            <CardDescription>Proposal ID: {task.proposalId}</CardDescription>
          </div>
          {getStatusBadge(task.status)}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='action'>Take Action</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='mt-4 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium'>Current Step</h4>
                <p className='capitalize'>{task.currentStep}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium'>Status</h4>
                <p>{getStatusBadge(task.status)}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium'>Assigned To</h4>
                <p>{getUserName(task.assignedTo)}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium'>Assigned By</h4>
                <p>{getUserName(task.assignedBy)}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium'>Created</h4>
                <p>{format(task.createdAt, 'PPpp')}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium'>Last Updated</h4>
                <p>{format(task.updatedAt, 'PPpp')}</p>
              </div>
            </div>

            <div className='mt-4'>
              <Button
                onClick={() => setActiveTab('action')}
                disabled={task.status === 'completed'}
              >
                Take Action
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='action' className='mt-4'>
            {task.status !== 'completed' ? (
              <StepTransition
                task={task}
                currentUserRole={currentUserRole}
                currentUserId={currentUserId}
                users={users}
                onComplete={onTaskUpdated}
              />
            ) : (
              <div className='py-8 text-center'>
                <p className='text-muted-foreground'>
                  This task has been completed and no further action can be
                  taken.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value='history' className='mt-4'>
            <TaskHistory task={task} users={users} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
