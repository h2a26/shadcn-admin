import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DraftsProvider } from '@/features/drafts'
import { ParcelInsuranceProposalForm } from '@/features/proposal/components/parcel-insurance-proposal-form'
import { ProposalProvider } from '@/features/proposal/context/proposal-context'
import { WorkflowProvider } from '@/features/workflow/context/workflow-context.tsx'
import UsersProvider from '@/features/users/context/users-context.tsx'

export default function Proposal() {
  return (
    <DraftsProvider>
      <ProposalProvider>
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
              <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
                <div>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Parcel Insurance Proposal
                  </h2>
                  <p className='text-muted-foreground'>
                    Create a new insurance proposal for your parcel shipment
                  </p>
                </div>
              </div>
              <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                <ParcelInsuranceProposalForm />
              </div>
            </Main>
          </UsersProvider>
        </WorkflowProvider>
      </ProposalProvider>
    </DraftsProvider>
  )
}
