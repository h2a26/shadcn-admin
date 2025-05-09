import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowRightCircle,
  Clock,
  UserCircle,
  ClipboardList,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PermissionGuard } from '@/features/users/components/permission-guard.tsx'
import { useUsers } from '@/features/users/context/users-context'
import { useWorkflow } from '../context/workflow-context'
import { StepTransition } from './step-transition'
import { TaskHistory } from './task-history'

interface TaskDetailsEnhancedProps {
  taskId: string
  onBack?: () => void
}

export function TaskDetailsEnhanced({
  taskId,
  onBack,
}: TaskDetailsEnhancedProps) {
  const { getTaskById, config, completeTask } = useWorkflow()
  const { currentUser, users } = useUsers()
  const [showTransition, setShowTransition] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const task = getTaskById(taskId)
  const currentStep = task?.currentStep
  const stepConfig =
    config && currentStep
      ? config.steps.find((s) => s.name === currentStep)
      : undefined

  if (!task) {
    return <div className='text-red-500'>Task not found</div>
  }

  const getStatusBadgeVariant = ():
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline' => {
    switch (task.status) {
      case 'pending':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'completed':
        return 'outline'
      case 'rejected':
        return 'destructive'
      case 'sent_back':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const handleCompleteTask = async () => {
    if (!currentUser) return

    try {
      setIsCompleting(true)

      // Complete the task
      completeTask(task, task.assignedBy)

      // Hide transition form if it's open
      setShowTransition(false)
    } catch (error) {
      // Display error to user instead of console.error
      toast.error(
        `Error completing task: ${error instanceof Error ? error.message : String(error)}`
      )
      // Re-throw the error for upstream error handling
      throw new Error(
        `Error completing task: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Workflow task information and actions
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant()}>{task.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Task Details */}
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Task Information</h4>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Created:</span>
              <span>
                {formatDistanceToNow(task.createdAt, { addSuffix: true })}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <UserCircle className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Assignee:</span>
              <span>
                {users.find((u) => u.id === task.assignedTo)
                  ? `${users.find((u) => u.id === task.assignedTo)?.firstName} ${users.find((u) => u.id === task.assignedTo)?.lastName}`
                  : task.assignedTo}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <ArrowRightCircle className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Current Step:</span>
              <span>{stepConfig?.name || task.currentStep}</span>
            </div>
            <div className='flex items-center gap-2'>
              <ClipboardList className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Proposal ID:</span>
              <span className='font-mono text-xs'>
                {task.proposalId.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Task History - Only visible to users with workflow.view permission */}
        <PermissionGuard
          userRole={currentUser?.role || ''}
          requiredPermission='workflow.view'
        >
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Task History</h4>
            <TaskHistory task={task} users={users} />
          </div>
        </PermissionGuard>

        {/* Step Transition Form - Only visible to assigned user with workflow.transition permission */}
        {showTransition &&
          currentUser &&
          task.assignedTo === currentUser.id && (
            <PermissionGuard
              userRole={currentUser.role}
              requiredPermission='workflow.transition'
            >
              <Separator />
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Update Workflow Status</h4>
                <StepTransition
                  task={task}
                  currentUserRole={currentUser.role}
                  currentUserId={currentUser.id}
                  users={users}
                  onComplete={() => {
                    setShowTransition(false)
                  }}
                />
              </div>
            </PermissionGuard>
          )}
      </CardContent>

      <CardFooter className='flex justify-between'>
        {onBack && (
          <Button variant='outline' onClick={onBack}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        )}

        <div className='flex gap-2'>
          {/* Transition button - Only visible to assigned user with workflow.transition permission */}
          {!showTransition &&
            currentUser &&
            task.assignedTo === currentUser.id &&
            task.status !== 'completed' && (
              <PermissionGuard
                userRole={currentUser.role}
                requiredPermission='workflow.transition'
              >
                <Button
                  variant='outline'
                  onClick={() => setShowTransition(true)}
                >
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Update Status
                </Button>
              </PermissionGuard>
            )}

          {/* Complete button - Only visible to assigned user with workflow.transition permission */}
          {currentUser &&
            task.assignedTo === currentUser.id &&
            task.status !== 'completed' && (
              <PermissionGuard
                userRole={currentUser.role}
                requiredPermission='workflow.transition'
              >
                <Button onClick={handleCompleteTask} disabled={isCompleting}>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  {isCompleting ? 'Completing...' : 'Complete Task'}
                </Button>
              </PermissionGuard>
            )}
        </div>
      </CardFooter>
    </Card>
  )
}
