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

  const selectedAssignee = watch('workflowSubmit.assignedTo')

  return (
    <Card className="mx-auto w-full max-w-lg rounded-2xl shadow-md border border-muted">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">Submit Proposal</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Choose a reviewer and optionally leave comments before submitting.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Assignee Selector */}
        <div className="space-y-1">
          <label htmlFor="assignee" className="block text-sm font-medium">
            Assign To <span className="text-red-500">*</span>
          </label>
          <RoleBasedUserSelector
            workflowStep={INITIAL_WORKFLOW_STEP}
            selectedUserId={selectedAssignee}
            onUserSelect={(user) =>
              setValue('workflowSubmit.assignedTo', user.id, { shouldValidate: true })
            }
            placeholder="Select a reviewer"
          />
          {errors.workflowSubmit?.assignedTo && (
            <p className="text-xs text-destructive mt-1">
              {errors.workflowSubmit.assignedTo.message}
            </p>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-1">
          <label htmlFor="comments" className="block text-sm font-medium">
            Comments
          </label>
          <Textarea
            {...register('workflowSubmit.comments')}
            placeholder="Add any comments about this proposal..."
            className="min-h-[100px]"
          />
          {errors.workflowSubmit?.comments && (
            <p className="text-xs text-destructive mt-1">
              {errors.workflowSubmit.comments.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}