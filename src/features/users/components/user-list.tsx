import { useState, useEffect } from 'react'
import { MoreHorizontal, UserPlus, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rolesConfig } from '../config/roles'
import { useUsers } from '../context/users-context'
import { User } from '../data/schema'

export function UserList() {
  const { users, refreshUsers, setOpen, setCurrentRow } = useUsers()
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter users when role filter changes
  useEffect(() => {
    if (!roleFilter) {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(users.filter((user) => user.role === roleFilter))
    }
  }, [users, roleFilter])

  const handleRefresh = () => {
    setIsLoading(true)
    refreshUsers()
    setTimeout(() => setIsLoading(false), 500) // Simulate loading
  }

  const handleAddUser = () => {
    setCurrentRow(null)
    setOpen('add')
  }

  const handleEditUser = (user: User) => {
    setCurrentRow(user)
    setOpen('edit')
  }

  const handleDeleteUser = (user: User) => {
    setCurrentRow(user)
    setOpen('delete')
  }

  const handleAssignUser = (user: User) => {
    setCurrentRow(user)
    setOpen('assign')
  }

  // Get role name from role ID
  const getRoleName = (roleId: string) => {
    const role = rolesConfig.find((r) => r.id === roleId)
    return role ? role.name : roleId
  }

  // Get role badge color based on role
  const getRoleBadgeVariant = (
    roleId: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (roleId) {
      case 'superadmin':
        return 'destructive'
      case 'admin':
        return 'destructive'
      case 'manager':
        return 'secondary'
      case 'underwriter':
        return 'default'
      case 'risk_reviewer':
        return 'default'
      case 'approver':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setRoleFilter(null)}
            className={!roleFilter ? 'bg-primary text-primary-foreground' : ''}
          >
            All
          </Button>
          {rolesConfig.map((role) => (
            <Button
              key={role.id}
              variant='outline'
              size='sm'
              onClick={() => setRoleFilter(role.id)}
              className={
                roleFilter === role.id
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }
            >
              {role.name}
            </Button>
          ))}
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button size='sm' onClick={handleAddUser}>
            <UserPlus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[80px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-muted-foreground py-4 text-center'
                >
                  {users.length === 0
                    ? 'No users found. Add some users to get started.'
                    : 'No users match the selected filter.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'active' ? 'outline' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          Edit user
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAssignUser(user)}
                        >
                          Assign to workflow
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className='text-destructive focus:text-destructive'
                        >
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
