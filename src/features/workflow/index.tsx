import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { WorkflowProvider } from '@/features/workflow/context/workflow-context.tsx'
import { WorkflowDashboard } from './components/workflow-dashboard'
import UsersProvider from '@/features/users/context/users-context.tsx'

export default function Workflow() {
  return (
    <>
      <WorkflowProvider>
        <UsersProvider>
          <Header fixed>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>

          <Main>
            <WorkflowDashboard />
          </Main>
        </UsersProvider>
      </WorkflowProvider>
    </>
  )
}
