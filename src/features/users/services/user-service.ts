/**
 * User service for managing user data
 * Currently uses local storage, but designed to be easily replaceable with API calls
 */
import { RoleId } from '../config/roles'
import { User } from '../data/schema'

const USER_STORAGE_KEY = 'insurance_platform_users'

// Mock initial users for development
const initialUsers: User[] = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phoneNumber: '123-456-7890',
    status: 'active',
    role: 'underwriter',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    phoneNumber: '123-456-7891',
    status: 'active',
    role: 'risk_reviewer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    username: 'bobjohnson',
    email: 'bob@example.com',
    phoneNumber: '123-456-7892',
    status: 'active',
    role: 'approver',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-4',
    firstName: 'Alice',
    lastName: 'Williams',
    username: 'alicew',
    email: 'alice@example.com',
    phoneNumber: '123-456-7893',
    status: 'active',
    role: 'superadmin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

/**
 * Initialize the user storage with mock data if it doesn't exist
 */
function initializeUserStorage(): void {
  const existingUsers = localStorage.getItem(USER_STORAGE_KEY)
  if (!existingUsers) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(initialUsers))
  }
}

/**
 * Get all users from storage
 */
export function getAllUsers(): User[] {
  initializeUserStorage()
  try {
    const usersJson = localStorage.getItem(USER_STORAGE_KEY)
    if (!usersJson) return []

    const parsedUsers = JSON.parse(usersJson)

    // Convert string dates back to Date objects
    const users = parsedUsers.map(
      (
        user: Omit<User, 'createdAt' | 'updatedAt'> & {
          createdAt: string
          updatedAt: string
        }
      ) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      })
    )

    return users
  } catch (error) {
    throw new Error(
      `Error getting users from storage: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Get a user by ID
 */
export function getUserById(userId: string): User | null {
  const users = getAllUsers()
  return users.find((user) => user.id === userId) || null
}

/**
 * Get users by role
 */
export function getUsersByRole(role: RoleId): User[] {
  const users = getAllUsers()
  return users.filter((user) => user.role === role)
}

/**
 * Create a new user
 */
export function createUser(
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): User {
  const users = getAllUsers()

  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([...users, newUser]))

  return newUser
}

/**
 * Update an existing user
 */
export function updateUser(
  userId: string,
  userData: Partial<Omit<User, 'id' | 'createdAt'>>
): User | null {
  const users = getAllUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) return null

  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date(),
  }

  users[userIndex] = updatedUser
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))

  return updatedUser
}

/**
 * Delete a user
 */
export function deleteUser(userId: string): boolean {
  const users = getAllUsers()
  const filteredUsers = users.filter((user) => user.id !== userId)

  if (filteredUsers.length === users.length) {
    return false
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(filteredUsers))
  return true
}

/**
 * Get the current user (in a real app, this would come from auth)
 * For now, we'll just return the first superadmin user
 */
export function getCurrentUser(): User | null {
  const users = getAllUsers()
  return users.find((user) => user.role === 'superadmin') || users[0] || null
}
