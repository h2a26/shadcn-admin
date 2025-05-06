import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useDrafts } from '@/features/drafts';
import { getDraftById } from '@/features/drafts/utils/storage-utils';
import { ParcelInsuranceProposal } from '../types';
import { UseFormReturn } from 'react-hook-form';

export interface UseDraftOperationsReturn {
  currentDraftId: string | null;
  lastSaved: Date | null;
  saveAsDraft: (currentStep: string) => Promise<string>;
  loadDraft: (draftId: string) => Promise<void>;
  setCurrentDraftId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Custom hook for handling draft operations
 */
export function useDraftOperations(
  form: UseFormReturn<ParcelInsuranceProposal>,
  getCurrentFormData: () => Partial<ParcelInsuranceProposal>,
  hasFormData: () => boolean,
  setCurrentStep: (stepId: string) => void
): UseDraftOperationsReturn {
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { refreshDrafts } = useDrafts();

  /**
   * Save the current form state as a draft
   */
  const saveAsDraft = useCallback(async (currentStep: string): Promise<string> => {
    try {
      const formData = getCurrentFormData();
      
      // Don't save if there's no meaningful data (prevents empty drafts)
      if (!currentDraftId && !hasFormData()) {
        throw new Error('No data to save as draft');
      }
      
      // Import the saveProposalAsDraft function from draft-utils
      const { saveProposalAsDraft } = await import('../utils/draft-utils');
      
      // Use the utility function to save the draft
      const draftId = saveProposalAsDraft(
        formData,
        currentStep,
        currentDraftId || undefined
      );
      
      // Update state if this is a new draft
      if (!currentDraftId) {
        setCurrentDraftId(draftId);
      }
      
      setLastSaved(new Date());
      refreshDrafts();
      return draftId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to save draft: ${errorMessage}`, {
        closeButton: true,
        duration: 30000,
        position: 'top-right'
      });
      throw error;
    }
  }, [currentDraftId, getCurrentFormData, hasFormData, refreshDrafts]);

  /**
   * Load a draft by ID
   */
  const loadDraft = useCallback(async (draftId: string): Promise<void> => {
    try {
      const draft = getDraftById(draftId);
      
      if (!draft) {
        toast.error('Draft not found', {
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
        return;
      }
      
      if (draft.type !== 'proposal') {
        toast.error('Invalid draft type', {
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
        return;
      }
      
      // Set the current draft ID
      setCurrentDraftId(draftId);
      
      // Import the utility function
      const draftUtilsModule = await import('../utils/draft-utils');
      
      // Convert the draft to proposal data
      let formData: Partial<ParcelInsuranceProposal>;
      try {
        formData = draftUtilsModule.draftToProposal(draft);
        
        // Reset the form with the draft data
        form.reset(formData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to process draft: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
        return;
      }
      
      // Navigate to the last active step with proper type checking
      const metadata = draft.metadata;
      if (!metadata || typeof metadata !== 'object') {
        toast.error('Invalid draft metadata', {
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
        return;
      }
      
      const lastStep = metadata.currentStep;
      if (typeof lastStep === 'string') {
        // Navigate to the saved step
        setCurrentStep(lastStep);
        
        // Show a success notification
        toast.success('Draft loaded successfully', {
          description: `Resuming from where you left off.`,
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to load draft: ${errorMessage}`, {
        closeButton: true,
        duration: 30000,
        position: 'top-right'
      });
    }
  }, [form, setCurrentStep]);

  return {
    currentDraftId,
    lastSaved,
    saveAsDraft,
    loadDraft,
    setCurrentDraftId
  };
}
