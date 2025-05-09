import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RoleBasedUserSelector } from '@/features/users/components/role-based-user-selector'
import { useFormContext } from 'react-hook-form'
import { WorkflowSubmit } from '@/features/proposal/data/schema'

const INITIAL_WORKFLOW_STEP = 'proposal'

export function WorkflowSubmitForm() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<{ workflowSubmit: WorkflowSubmit }>()

  // Watch the assignee to ensure correct data binding
  const selectedAssignee = watch('workflowSubmit.assignedTo')

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
        <CardDescription>
          Assign this proposal to a reviewer in the workflow
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Based User Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assign To</label>
          <RoleBasedUserSelector
            workflowStep={INITIAL_WORKFLOW_STEP}
            selectedUserId={selectedAssignee}
            onUserSelect={(user) =>
              setValue('workflowSubmit.assignedTo', user.id, { shouldValidate: true })
            }
            placeholder="Select assignee"
          />
          {errors.workflowSubmit?.assignedTo && (
            <p className="text-sm text-red-500">
              {errors.workflowSubmit.assignedTo.message}
            </p>
          )}
        </div>

        {/* Comments Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Comments</label>
          <Textarea
            {...register('workflowSubmit.comments')}
            placeholder="Add any comments about this proposal"
            className="min-h-[100px]"
          />
          {errors.workflowSubmit?.comments && (
            <p className="text-sm text-red-500">
              {errors.workflowSubmit.comments.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
