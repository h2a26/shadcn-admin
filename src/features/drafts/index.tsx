import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DraftsTable } from '@/features/drafts/components/drafts-table'
import { DraftViewDialog } from '@/features/drafts/components/draft-view-dialog'
import { DraftsProvider } from '@/features/drafts/context/drafts-context'

// Export utilities and types for use in other modules
export * from './types'
export * from './utils/storage-utils'
export { DraftsProvider, useDrafts } from './context/drafts-context'

export default function Drafts() {
  return (
    <DraftsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Drafts</h2>
            <p className='text-muted-foreground'>
              Manage your saved drafts and resume your work
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DraftsTable />
        </div>
        
        <DraftViewDialog />
      </Main>
    </DraftsProvider>
  )
}
