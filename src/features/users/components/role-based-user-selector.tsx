import { useEffect, useMemo, useState, useCallback } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { getAuthStore } from '@/stores/auth-store'
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
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { getRoles } = getAuthStore()

  const eligibleRoles = useMemo(
    () =>
      getRolesForWorkflowStep(workflowStep).filter((role) =>
        getRoles().includes(role.id as RoleId)
      ),
    [workflowStep, getRoles]
  )

  const eligibleUsers = useMemo(() => {
    const users = eligibleRoles.flatMap((role) =>
      getUsersByRole(role.id as RoleId)
    )

    // Deduplicate by user ID
    const uniqueUsersMap = new Map<string, User>()
    users.forEach((user) => {
      if (!uniqueUsersMap.has(user.id)) {
        uniqueUsersMap.set(user.id, user)
      }
    })

    return Array.from(uniqueUsersMap.values())
  }, [eligibleRoles, getUsersByRole])

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return eligibleUsers
    return eligibleUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      return (
        fullName.includes(term) ||
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      )
    })
  }, [search, eligibleUsers])

  // Sync selected user with selectedUserId prop
  useEffect(() => {
    const match = eligibleUsers.find((u) => u.id === selectedUserId) || null
    setSelectedUser((prev) => (match?.id !== prev?.id ? match : prev))
  }, [selectedUserId, eligibleUsers])

  const handleSelectUser = useCallback(
    (user: User) => {
      setSelectedUser(user)
      onUserSelect(user)
      setOpen(false)
      setSearch('')
    },
    [onUserSelect]
  )

  if (!eligibleUsers.length) {
    return (
      <div className='text-muted-foreground bg-muted rounded-md border px-2 py-2 text-sm'>
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
          className={cn(
            'focus:ring-primary w-full justify-between rounded-md border px-4 py-2 text-sm font-normal focus:ring-2 focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
        >
          {selectedUser ? (
            `${selectedUser.firstName} ${selectedUser.lastName}`
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='z-50 max-w-[480px] min-w-[360px] rounded-md border p-0 shadow-lg'
        align='start'
      >
        <Command>
          <CommandInput
            placeholder='Search user...'
            value={search}
            onValueChange={setSearch}
            className='px-3 py-2 text-sm'
          />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={`${user.firstName} ${user.lastName} ${user.role}`}
                onSelect={() => handleSelectUser(user)}
                className='flex items-center gap-2 text-sm'
              >
                <Check
                  className={cn(
                    'text-primary h-4 w-4',
                    selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <span>
                  {user.firstName} {user.lastName}
                  <span className='text-muted-foreground ml-1 text-xs'>
                    ({user.role})
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
