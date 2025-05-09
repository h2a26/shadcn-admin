import { useEffect, useState } from 'react'
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
  const { users, getUsersByRole } = useUsers()
  const [open, setOpen] = useState(false)
  const [eligibleUsers, setEligibleUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Get eligible roles for this workflow step
  const eligibleRoles = getRolesForWorkflowStep(workflowStep)

  // When component mounts or when the workflow step changes,
  // fetch all eligible users based on roles
  useEffect(() => {
    const allEligibleUsers: User[] = []

    eligibleRoles.forEach((role) => {
      const usersWithRole = getUsersByRole(role.id as RoleId)
      allEligibleUsers.push(...usersWithRole)
    })

    // Remove duplicates (in case a user has multiple eligible roles)
    const uniqueUsers = allEligibleUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    )

    setEligibleUsers(uniqueUsers)
  }, [workflowStep, users, getUsersByRole, eligibleRoles])

  // Set the selected user if selectedUserId is provided
  useEffect(() => {
    if (selectedUserId) {
      const user = eligibleUsers.find((u) => u.id === selectedUserId) || null
      setSelectedUser(user)
    } else {
      setSelectedUser(null)
    }
  }, [selectedUserId, eligibleUsers])

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
