import { useState } from 'react'
import {
  ArrowRightCircle,
  Clock,
  UserCircle,
  ClipboardList,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { hasPermission } from '@/features/users/config/roles'
import { useUsers } from '@/features/users/context/users-context'
import { StepTransition } from '@/features/workflow/components/step-transition'
import { TaskHistory } from '@/features/workflow/components/task-history'
import { useWorkflow } from '@/features/workflow/context/workflow-context'
import { WorkflowStatusBadge } from '@/features/workflow/utils/workflow-components'
import { ProposalFormData } from '../data/schema'

interface ProposalWorkflowStatusProps {
  proposal: ProposalFormData & {
    workflowTaskId: string
    proposalId: string
  }
}

export function ProposalWorkflowStatus({
  proposal,
}: ProposalWorkflowStatusProps) {
  const { getTaskById } = useWorkflow()
  const { currentUser, users } = useUsers()
  const [showTransition, setShowTransition] = useState(false)

  const task = getTaskById(proposal.workflowTaskId)

  // Check if current user has permission to transition this task
  const canTransition =
    currentUser &&
    hasPermission(currentUser.role, 'workflow.transition') &&
    task?.assignedTo === currentUser.id

  // Check if current user has permission to view task history
  const canViewHistory =
    currentUser && hasPermission(currentUser.role, 'workflow.view')

  if (!task) {
    return <div className='text-yellow-500'>No workflow task assigned yet</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle>Workflow Status</CardTitle>
            <CardDescription>
              Current workflow status and actions
            </CardDescription>
          </div>
          <WorkflowStatusBadge
            workflowTaskId={task.id}
            currentStep={task.currentStep}
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Task Details */}
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Task Details</h4>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Created:</span>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className='flex items-center gap-2'>
              <UserCircle className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Assignee:</span>
              <span>{task.assignedTo}</span>
            </div>
            <div className='flex items-center gap-2'>
              <ArrowRightCircle className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Current Step:</span>
              <span>{task.currentStep}</span>
            </div>
            <div className='flex items-center gap-2'>
              <ClipboardList className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground'>Task ID:</span>
              <span className='font-mono text-xs'>
                {task.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Task History */}
        {canViewHistory && (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Task History</h4>
            <TaskHistory task={task} users={users} />
          </div>
        )}

        {/* Step Transition Form */}
        {showTransition && canTransition && (
          <>
            <Separator />
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Update Workflow Status</h4>
              <StepTransition
                task={task}
                currentUserRole={currentUser?.role || ''}
                currentUserId={currentUser?.id || ''}
                users={users}
                onComplete={() => setShowTransition(false)}
              />
            </div>
          </>
        )}
      </CardContent>

      {canTransition && !showTransition && (
        <CardFooter className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowTransition(true)}
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            Update Status
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
