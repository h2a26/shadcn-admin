import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from '@/features/users/data/schema'
import { useWorkflow } from '@/features/workflow/context/workflow-context.tsx'
import { getAvailableAssignees } from '@/features/workflow/utils/engine'

interface ProposalAssigneeSelectorProps {
  form: UseFormReturn<{
    workflowAssignee: string
    [key: string]: unknown
  }>
  users: User[]
  currentUserRole: string
  currentUserId: string
}

export function ProposalAssigneeSelector({
  form,
  users,
  currentUserRole,
  currentUserId,
}: ProposalAssigneeSelectorProps) {
  const { config } = useWorkflow()
  const [availableAssignees, setAvailableAssignees] = useState<User[]>([])

  useEffect(() => {
    if (!config || !users) {
      setAvailableAssignees([])
      return
    }

    // For the initial proposal step, we need to get users who can be assigned to the 'proposal' step
    const currentStep = 'proposal'

    // Get available assignees based on workflow rules
    const assignees = getAvailableAssignees(
      config,
      currentStep,
      currentUserRole,
      users.map((u) => ({ id: u.id, role: u.role }))
    )

    // Filter the full user list to only show available assignees
    const filteredUsers = users.filter((user) =>
      assignees.some((a) => a.id === user.id)
    )

    setAvailableAssignees(filteredUsers)
  }, [config, users, currentUserRole])

  return (
    <FormField
      control={form.control}
      name='workflowAssignee'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assign To</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || currentUserId}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select assignee' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableAssignees.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
