import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from '@/features/users/data/schema'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'
import { getAvailableAssignees } from '../utils/engine'

interface AssigneeSelectorProps {
  currentStep: string
  currentUserRole: string
  users: User[]
  onAssigneeSelected: (userId: string) => void
  defaultValue?: string
  disabled?: boolean
}

export function AssigneeSelector({
  currentStep,
  currentUserRole,
  users,
  onAssigneeSelected,
  defaultValue,
  disabled = false,
}: AssigneeSelectorProps) {
  const { config } = useWorkflow()

  // Get available assignees based on workflow rules
  const availableAssignees = useMemo(() => {
    if (!config || !users) return []

    return getAvailableAssignees(
      config,
      currentStep,
      currentUserRole,
      users.map((u) => ({ id: u.id, role: u.role }))
    )
  }, [config, currentStep, currentUserRole, users])

  // Filter the full user list to only show available assignees
  const filteredUsers = useMemo(() => {
    if (!users) return []

    const availableIds = availableAssignees.map((a) => a.id)
    return users.filter((user) => availableIds.includes(user.id))
  }, [availableAssignees, users])

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Assign to</label>
      <Select
        onValueChange={onAssigneeSelected}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select assignee' />
        </SelectTrigger>
        <SelectContent>
          {filteredUsers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filteredUsers.length === 0 && !disabled && (
        <p className='text-muted-foreground text-sm'>
          No available assignees for this step
        </p>
      )}
    </div>
  )
}
