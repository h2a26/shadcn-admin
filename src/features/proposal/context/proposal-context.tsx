import React, { useState, useEffect, useCallback } from 'react'
import { ProposalFormData } from '@/features/proposal/data/schema.ts'
import {
  getProposalsFromLocalStorage,
  saveProposalToLocalStorage,
  updateProposalInLocalStorage,
  deleteProposalFromLocalStorage,
  ProposalWorkflowData,
} from '@/features/proposal/utils/proposal-utils'

interface StoredProposal extends ProposalFormData {
  id: string
  createdAt: string
  updatedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  workflowTaskId?: string
  currentWorkflowStep?: string
}

interface ProposalContextType {
  currentProposal: StoredProposal | null
  setCurrentProposal: React.Dispatch<
    React.SetStateAction<StoredProposal | null>
  >

  proposals: StoredProposal[]

  refreshProposals: () => void
  saveProposal: (proposal: ProposalFormData) => string
  updateProposal: (
    id: string,
    proposal: Partial<ProposalFormData> & ProposalWorkflowData
  ) => boolean
  deleteProposal: (id: string) => boolean
}

const ProposalContext = React.createContext<ProposalContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export function ProposalProvider({ children }: Props) {
  const [currentProposal, setCurrentProposal] = useState<StoredProposal | null>(
    null
  )

  const [proposals, setProposals] = useState<StoredProposal[]>([])

  const refreshProposals = useCallback(() => {
    const data = getProposalsFromLocalStorage()
    setProposals(data)
  }, [])

  // Load proposals from local storage on initial render
  useEffect(() => {
    refreshProposals()
  }, [refreshProposals])

  const saveProposal = (proposal: ProposalFormData): string => {
    const id = saveProposalToLocalStorage(proposal)
    refreshProposals()
    return id
  }

  const updateProposal = (
    id: string,
    proposal: Partial<ProposalFormData> & ProposalWorkflowData
  ): boolean => {
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
        currentProposal,
        setCurrentProposal,
        proposals,
        refreshProposals,
        saveProposal,
        updateProposal,
        deleteProposal,
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
    throw new Error('useProposal has to be used within <ProposalProvider>')
  }

  return context
}
