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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { hasPermission } from '@/features/users/config/roles'
import { useUsers } from '@/features/users/context/users-context'
import { StepTransition } from '@/features/workflow/components/step-transition'
import { TaskHistory } from '@/features/workflow/components/task-history'
import { WorkflowStatusBadge } from '@/features/workflow/components/workflow-status-badge'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'
import { ProposalFormData } from '../data/schema'

// Use the same StoredProposal interface as in the context
interface StoredProposal extends ProposalFormData {
  id: string
  createdAt: string
  updatedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  workflowTaskId?: string
  currentWorkflowStep?: string
}

interface ProposalWorkflowStatusProps {
  proposal: StoredProposal
}

export function ProposalWorkflowStatus({
  proposal,
}: ProposalWorkflowStatusProps) {
  const { getTaskById } = useWorkflow()
  const { currentUser, users } = useUsers()
  const [showTransition, setShowTransition] = useState(false)

  // If proposal has no workflow task, show a message
  if (!proposal.workflowTaskId || !proposal.currentWorkflowStep) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Status</CardTitle>
          <CardDescription>
            This proposal is not part of a workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-6'>
            <p className='text-muted-foreground text-sm'>
              No workflow task associated with this proposal
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const task = getTaskById(proposal.workflowTaskId)

  // If task not found, show error
  if (!task) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Status</CardTitle>
          <CardDescription>Error: Workflow task not found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-6'>
            <p className='text-destructive text-sm'>
              The workflow task (ID: {proposal.workflowTaskId}) could not be
              found
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if current user has permission to transition this task
  const canTransition =
    currentUser &&
    hasPermission(currentUser.role, 'workflow.transition') &&
    task.assignedTo === currentUser.id

  // Check if current user has permission to view task history
  const canViewHistory =
    currentUser && hasPermission(currentUser.role, 'workflow.view')

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
            workflowTaskId={proposal.workflowTaskId}
            currentStep={proposal.currentWorkflowStep}
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
