import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DraftViewDialog } from '@/features/drafts/components/draft-view-dialog.tsx'
import { DraftsTable } from '@/features/drafts/components/drafts-table'
import { DraftsProvider } from '@/features/drafts/context/drafts-context'

// Export only the component
export { DraftsProvider }

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
