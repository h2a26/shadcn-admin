import React, { useState, useEffect, createContext, useContext } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Draft, DraftFilters, DraftSortOptions } from '../types';
import { getDraftsFromStorage, saveDraftToStorage, updateDraftInStorage, deleteDraftFromStorage } from '../utils/storage-utils';

// Define the types of dialogs that can be opened in the drafts feature
type DraftsDialogType = 'create' | 'view' | 'edit' | 'delete';

// Define the shape of the drafts context
interface DraftsContextType {
  // Dialog state
  open: DraftsDialogType | null;
  setOpen: (type: DraftsDialogType | null) => void;
  
  // Current draft being viewed or edited
  currentDraft: Draft | null;
  setCurrentDraft: React.Dispatch<React.SetStateAction<Draft | null>>;
  
  // All drafts
  drafts: Draft[];
  
  // Filters and sorting
  filters: DraftFilters;
  setFilters: React.Dispatch<React.SetStateAction<DraftFilters>>;
  sortOptions: DraftSortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<DraftSortOptions>>;
  
  // Actions
  refreshDrafts: () => void;
  saveDraft: (draft: Omit<Draft, 'id' | 'createdAt'>) => string;
  updateDraft: (id: string, draft: Partial<Draft>) => boolean;
  deleteDraft: (id: string) => boolean;
}

// Create the context with null as default value
const DraftsContext = createContext<DraftsContextType | null>(null);

interface DraftsProviderProps {
  children: React.ReactNode;
}

export function DraftsProvider({ children }: DraftsProviderProps) {
  // Dialog state using the project's custom hook
  const [open, setOpen] = useDialogState<DraftsDialogType>(null);
  
  // Current draft being viewed or edited
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
  
  // All drafts
  const [drafts, setDrafts] = useState<Draft[]>([]);
  
  // Filters and sorting
  const [filters, setFilters] = useState<DraftFilters>({});
  const [sortOptions, setSortOptions] = useState<DraftSortOptions>({
    field: 'updatedAt',
    direction: 'desc'
  });

  // Load drafts from storage on initial render
  useEffect(() => {
    refreshDrafts();
  }, []);

  // Function to refresh drafts from storage
  const refreshDrafts = () => {
    try {
      const storedDrafts = getDraftsFromStorage();
      setDrafts(storedDrafts);
    } catch {
      // If there's an error retrieving drafts, reset to empty array
      setDrafts([]);
    }
  };

  // Function to save a new draft
  const saveDraft = (draft: Omit<Draft, 'id' | 'createdAt'>): string => {
    try {
      const draftId = saveDraftToStorage(draft);
      refreshDrafts();
      return draftId;
    } catch (error) {
      // Rethrow with a more specific message, using the original error if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to save draft: ${errorMessage}`);
    }
  };

  // Function to update an existing draft
  const updateDraft = (id: string, updatedData: Partial<Draft>): boolean => {
    try {
      const success = updateDraftInStorage(id, updatedData);
      if (success) {
        refreshDrafts();
      }
      return success;
    } catch {
      // If there's an error updating the draft, return false to indicate failure
      return false;
    }
  };

  // Function to delete a draft
  const deleteDraft = (id: string): boolean => {
    try {
      const success = deleteDraftFromStorage(id);
      if (success) {
        refreshDrafts();
      }
      return success;
    } catch {
      // If there's an error deleting the draft, return false to indicate failure
      return false;
    }
  };

  // Context value
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
    deleteDraft
  };

  return (
    <DraftsContext.Provider value={contextValue}>
      {children}
    </DraftsContext.Provider>
  );
}

// Custom hook to use the drafts context
export function useDrafts() {
  const draftsContext = useContext(DraftsContext);

  if (!draftsContext) {
    throw new Error('useDrafts must be used within a DraftsProvider');
  }

  return draftsContext;
}
