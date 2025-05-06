import React, { useState, useEffect, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ParcelInsuranceProposal } from '@/features/proposal/types'
import {
  getProposalsFromLocalStorage,
  saveProposalToLocalStorage,
  updateProposalInLocalStorage,
  deleteProposalFromLocalStorage
} from '@/features/proposal/utils/proposal-utils'

type ProposalDialogType = 'create' | 'view' | 'edit' | 'delete'

interface StoredProposal extends ParcelInsuranceProposal {
  id: string
  createdAt: string
  updatedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

interface ProposalContextType {
  open: ProposalDialogType | null
  setOpen: (type: ProposalDialogType | null) => void
  
  currentProposal: StoredProposal | null
  setCurrentProposal: React.Dispatch<React.SetStateAction<StoredProposal | null>>
  
  proposals: StoredProposal[]
  
  refreshProposals: () => void
  saveProposal: (proposal: ParcelInsuranceProposal) => string
  updateProposal: (id: string, proposal: Partial<ParcelInsuranceProposal>) => boolean
  deleteProposal: (id: string) => boolean
}

const ProposalContext = React.createContext<ProposalContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export function ProposalProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProposalDialogType>(null)
  
  const [currentProposal, setCurrentProposal] = useState<StoredProposal | null>(null)
  
  const [proposals, setProposals] = useState<StoredProposal[]>([])

  const refreshProposals = useCallback(() => {
    const data = getProposalsFromLocalStorage()
    setProposals(data)
  }, [])

  // Load proposals from local storage on initial render
  useEffect(() => {
    refreshProposals()
  }, [refreshProposals])

  const saveProposal = (proposal: ParcelInsuranceProposal): string => {
    const id = saveProposalToLocalStorage(proposal)
    refreshProposals()
    return id
  }

  const updateProposal = (id: string, proposal: Partial<ParcelInsuranceProposal>): boolean => {
    const success = updateProposalInLocalStorage(id, proposal)
    if (success) {
      refreshProposals()
    }
    return success
  }

  const deleteProposal = (id: string): boolean => {
    const success = deleteProposalFromLocalStorage(id)
    if (success) {
      refreshProposals()
    }
    return success
  }

  return (
    <ProposalContext.Provider
      value={{
        open,
        setOpen,
        currentProposal,
        setCurrentProposal,
        proposals,
        refreshProposals,
        saveProposal,
        updateProposal,
        deleteProposal
      }}
    >
      {children}
    </ProposalContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProposal = () => {
  const context = React.useContext(ProposalContext)

  if (!context) {
    throw new Error('useProposal must be used within a ProposalProvider')
  }

  return context
}
