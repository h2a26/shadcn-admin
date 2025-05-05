import React, { useState, useEffect, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ParcelInsuranceProposal } from '../types'
import {
  getProposalsFromLocalStorage,
  saveProposalToLocalStorage,
  updateProposalInLocalStorage,
  deleteProposalFromLocalStorage
} from '../utils/proposal-utils'

// Define the types of dialogs that can be opened in the proposal feature
type ProposalDialogType = 'create' | 'view' | 'edit' | 'delete'

// Interface for the stored proposal with additional metadata
interface StoredProposal extends ParcelInsuranceProposal {
  id: string
  createdAt: string
  updatedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

// Define the shape of the proposal context
interface ProposalContextType {
  // Dialog state
  open: ProposalDialogType | null
  setOpen: (type: ProposalDialogType | null) => void
  
  // Current proposal being viewed or edited
  currentProposal: StoredProposal | null
  setCurrentProposal: React.Dispatch<React.SetStateAction<StoredProposal | null>>
  
  // All proposals
  proposals: StoredProposal[]
  
  // Actions
  refreshProposals: () => void
  saveProposal: (proposal: ParcelInsuranceProposal) => string
  updateProposal: (id: string, proposal: Partial<ParcelInsuranceProposal>) => boolean
  deleteProposal: (id: string) => boolean
}

// Create the context with null as default value
const ProposalContext = React.createContext<ProposalContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProposalProvider({ children }: Props) {
  // Dialog state using the project's custom hook
  const [open, setOpen] = useDialogState<ProposalDialogType>(null)
  
  // Current proposal being viewed or edited
  const [currentProposal, setCurrentProposal] = useState<StoredProposal | null>(null)
  
  // All proposals
  const [proposals, setProposals] = useState<StoredProposal[]>([])

  // Function to refresh proposals from local storage
  const refreshProposals = useCallback(() => {
    const data = getProposalsFromLocalStorage()
    setProposals(data)
  }, [])

  // Load proposals from local storage on initial render
  useEffect(() => {
    refreshProposals()
  }, [refreshProposals])

  // Function to save a new proposal
  const saveProposal = (proposal: ParcelInsuranceProposal): string => {
    const id = saveProposalToLocalStorage(proposal)
    refreshProposals()
    return id
  }

  // Function to update an existing proposal
  const updateProposal = (id: string, proposal: Partial<ParcelInsuranceProposal>): boolean => {
    const success = updateProposalInLocalStorage(id, proposal)
    if (success) {
      refreshProposals()
    }
    return success
  }

  // Function to delete a proposal
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
