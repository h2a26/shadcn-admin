import React, { useState, useEffect, createContext, useContext } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import {
  getDraftsFromStorage,
  saveDraftToStorage,
  updateDraftInStorage,
  deleteDraftFromStorage,
} from '@/features/drafts'
import { Draft, DraftFilters, DraftSortOptions } from '@/features/drafts/types'

type DraftsDialogType = 'create' | 'view' | 'edit' | 'delete'

interface DraftsContextType {
  open: DraftsDialogType | null
  setOpen: (type: DraftsDialogType | null) => void

  currentDraft: Draft | null
  setCurrentDraft: React.Dispatch<React.SetStateAction<Draft | null>>

  drafts: Draft[]

  filters: DraftFilters
  setFilters: React.Dispatch<React.SetStateAction<DraftFilters>>
  sortOptions: DraftSortOptions
  setSortOptions: React.Dispatch<React.SetStateAction<DraftSortOptions>>

  refreshDrafts: () => void
  saveDraft: (draft: Omit<Draft, 'id' | 'createdAt'>) => string
  updateDraft: (id: string, draft: Partial<Draft>) => boolean
  deleteDraft: (id: string) => boolean
}

const DraftsContext = createContext<DraftsContextType | null>(null)

interface DraftsProviderProps {
  children: React.ReactNode
}

export function DraftsProvider({ children }: DraftsProviderProps) {
  const [open, setOpen] = useDialogState<DraftsDialogType>(null)

  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null)

  const [drafts, setDrafts] = useState<Draft[]>([])

  const [filters, setFilters] = useState<DraftFilters>({})
  const [sortOptions, setSortOptions] = useState<DraftSortOptions>({
    field: 'updatedAt',
    direction: 'desc',
  })

  useEffect(() => {
    refreshDrafts()
  }, [])

  const refreshDrafts = () => {
    try {
      const storedDrafts = getDraftsFromStorage()
      setDrafts(storedDrafts)
    } catch {
      setDrafts([])
    }
  }

  const saveDraft = (draft: Omit<Draft, 'id' | 'createdAt'>): string => {
    try {
      const draftId = saveDraftToStorage(draft)
      refreshDrafts()
      return draftId
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to save draft: ${errorMessage}`)
    }
  }

  const updateDraft = (id: string, updatedData: Partial<Draft>): boolean => {
    try {
      const success = updateDraftInStorage(id, updatedData)
      if (success) {
        refreshDrafts()
      }
      return success
    } catch {
      return false
    }
  }

  const deleteDraft = (id: string): boolean => {
    try {
      const success = deleteDraftFromStorage(id)
      if (success) {
        refreshDrafts()
      }
      return success
    } catch {
      // If there's an error deleting the draft, return false to indicate failure
      return false
    }
  }

  const contextValue: DraftsContextType = {
    open,
    setOpen,
    currentDraft,
    setCurrentDraft,
    drafts,
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
    refreshDrafts,
    saveDraft,
    updateDraft,
    deleteDraft,
  }

  return (
    <DraftsContext.Provider value={contextValue}>
      {children}
    </DraftsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDrafts() {
  const draftsContext = useContext(DraftsContext)

  if (!draftsContext) {
    throw new Error('useDrafts must be used within a DraftsProvider')
  }

  return draftsContext
}
