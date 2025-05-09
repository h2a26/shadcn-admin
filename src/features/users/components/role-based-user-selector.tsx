import { useEffect, useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RoleId, getRolesForWorkflowStep } from '../config/roles'
import { useUsers } from '../context/users-context'
import { User } from '../data/schema'

interface RoleBasedUserSelectorProps {
  workflowStep: string
  onUserSelect: (user: User) => void
  selectedUserId?: string
  placeholder?: string
  disabled?: boolean
}

export function RoleBasedUserSelector({
                                        workflowStep,
                                        onUserSelect,
                                        selectedUserId,
                                        placeholder = 'Select user',
                                        disabled = false,
                                      }: RoleBasedUserSelectorProps) {
  const { getUsersByRole } = useUsers()
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Get eligible roles for this workflow step
  const eligibleRoles = getRolesForWorkflowStep(workflowStep)

  // Memoize the computation of eligible users to avoid redundant recalculations
  const eligibleUsers = useMemo(() => {
    const allEligibleUsers: User[] = []

    eligibleRoles.forEach((role) => {
      const usersWithRole = getUsersByRole(role.id as RoleId)
      allEligibleUsers.push(...usersWithRole)
    })

    // Remove duplicates (in case a user has multiple eligible roles)
    return allEligibleUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    )
  }, [eligibleRoles, getUsersByRole])

  // Set the selected user if selectedUserId is provided
  useEffect(() => {
    // Only update state if the selectedUserId is different from the current selected user
    const user = eligibleUsers.find((u) => u.id === selectedUserId) || null
    if (selectedUserId && user && user.id !== selectedUser?.id) {
      setSelectedUser(user)
    } else if (!selectedUserId) {
      setSelectedUser(null)
    }
  }, [selectedUserId, eligibleUsers, selectedUser?.id])

  // Handle case where no users are available for selection
  if (eligibleUsers.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No users available for this workflow step.
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          disabled={disabled}
        >
          {selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput placeholder='Search user...' />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {eligibleUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  setSelectedUser(user)
                  onUserSelect(user)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {user.firstName} {user.lastName} ({user.role})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}