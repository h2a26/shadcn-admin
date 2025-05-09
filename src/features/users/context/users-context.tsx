import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { RoleId } from '../config/roles'
import { User } from '../data/schema'
import {
  getAllUsers,
  getUsersByRole,
  getCurrentUser,
} from '../services/user-service'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'assign'

interface UsersContextType {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  users: User[]
  currentUser: User | null
  getUsersByRole: (role: RoleId) => User[]
  refreshUsers: () => void
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load users on mount
  useEffect(() => {
    refreshUsers()
  }, [])

  // Function to refresh users from storage/API
  const refreshUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
    setCurrentUser(getCurrentUser())
  }

  // Function to get users by role
  const getUsersByRoleFunction = (role: RoleId) => {
    return getUsersByRole(role)
  }

  return (
    <UsersContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        users,
        currentUser,
        getUsersByRole: getUsersByRoleFunction,
        refreshUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
