import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// No longer needed after using RoleBasedUserSelector
import { Textarea } from '@/components/ui/textarea'
import { ProposalFormData } from '@/features/proposal/data/schema'
import {
  saveProposalToLocalStorage,
  updateProposalInLocalStorage,
} from '@/features/proposal/utils/proposal-utils'
import { RoleBasedUserSelector } from '@/features/users/components/role-based-user-selector'
import { useUsers } from '@/features/users/context/users-context'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'

interface ProposalWorkflowSubmitProps {
  proposalData: ProposalFormData
  onSuccess: () => void
  onCancel: () => void
}

// Initial workflow step for proposals
const INITIAL_WORKFLOW_STEP = 'proposal'

export function ProposalWorkflowSubmit({
  proposalData,
  onSuccess,
  onCancel,
}: ProposalWorkflowSubmitProps) {
  const { createTask } = useWorkflow()
  const { currentUser } = useUsers()
  const [selectedAssignee, setSelectedAssignee] = useState<string>('')
  const [comments, setComments] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!selectedAssignee) {
      toast.error('Please select an assignee')
      return
    }

    if (!currentUser) {
      toast.error('No current user found')
      return
    }

    try {
      setIsSubmitting(true)

      // Save the proposal to local storage
      const proposalId = saveProposalToLocalStorage(proposalData)

      // Create a workflow task for the proposal
      const workflowTask = createTask(
        proposalId,
        INITIAL_WORKFLOW_STEP,
        selectedAssignee,
        currentUser.id,
        comments || 'Initial proposal submission'
      )

      // Update the proposal with workflow information
      updateProposalInLocalStorage(proposalId, {
        workflowTaskId: workflowTask.id,
        currentWorkflowStep: INITIAL_WORKFLOW_STEP,
      })

      toast.success('Proposal submitted successfully!', {
        description: `Proposal ID: ${proposalId}\nAssigned to workflow task: ${workflowTask.id}`,
        closeButton: true,
        duration: 5000,
      })

      onSuccess()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Error submitting proposal: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
        <CardDescription>
          Assign this proposal to a reviewer in the workflow
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Assign To</label>
          <RoleBasedUserSelector
            workflowStep={INITIAL_WORKFLOW_STEP}
            onUserSelect={(user) => setSelectedAssignee(user.id)}
            selectedUserId={selectedAssignee}
            placeholder='Select assignee'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Comments</label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder='Add any comments about this proposal'
            className='min-h-[100px]'
          />
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedAssignee}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
        </Button>
      </CardFooter>
    </Card>
  )
}
