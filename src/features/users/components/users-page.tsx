import UsersProvider from '../context/users-context'
import { UserDialogs } from './user-dialogs'
import { UserList } from './user-list'

export function UsersPage() {
  return (
    <UsersProvider>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>User Management</h2>
          <p className='text-muted-foreground'>
            Manage users and their roles for the insurance core platform
          </p>
        </div>

        <UserList />
        <UserDialogs />
      </div>
    </UsersProvider>
  )
}
