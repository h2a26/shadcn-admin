import { useFormContext } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { WorkflowSubmit } from '@/features/proposal/data/schema'
import { RoleBasedUserSelector } from '@/features/users/components/role-based-user-selector'

const INITIAL_WORKFLOW_STEP = 'proposal'

export function WorkflowSubmitForm() {
  const { control } = useFormContext<{ workflowSubmit: WorkflowSubmit }>()

  return (
    <Card className='border-muted mx-auto w-full max-w-lg rounded-2xl border shadow-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-xl font-semibold'>Submit Proposal</CardTitle>
        <CardDescription className='text-muted-foreground text-sm'>
          Choose a reviewer and optionally leave comments before submitting.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Assignee Field */}
        <FormField
          control={control}
          name='workflowSubmit.assignedTo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assign To <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <RoleBasedUserSelector
                  workflowStep={INITIAL_WORKFLOW_STEP}
                  selectedUserId={field.value}
                  onUserSelect={(user) => field.onChange(user.id)}
                  placeholder='Select a reviewer'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comments Field */}
        <FormField
          control={control}
          name='workflowSubmit.comments'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Add any comments about this proposal...'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
