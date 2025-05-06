import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ParcelInsuranceProposalForm } from '@/features/proposal/components/parcel-insurance-proposal-form'
import { ProposalProvider } from '@/features/proposal/context/proposal-context'
import { DraftsProvider } from '@/features/drafts'

// Export types and utilities for use in other modules
export * from '@/features/proposal/types'
export * from '@/features/proposal/utils/proposal-utils'
export * from '@/features/proposal/utils/draft-utils'
export { ProposalProvider } from '@/features/proposal/context/proposal-context'

export default function Proposal() {
  return (
    <DraftsProvider>
      <ProposalProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Parcel Insurance Proposal</h2>
              <p className='text-muted-foreground'>
                Create a new insurance proposal for your parcel shipment
              </p>
            </div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <ParcelInsuranceProposalForm />
          </div>

        </Main>

      </ProposalProvider>
    </DraftsProvider>
  )
}
