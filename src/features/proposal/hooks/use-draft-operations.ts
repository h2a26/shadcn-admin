import React, { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useDrafts } from '@/features/drafts'
import { getDraftById } from '@/features/drafts/utils/storage-utils'
import {
  ProposalFormData,
  ProposalStepId,
} from '@/features/proposal/data/schema'
import {
  saveProposalAsDraft,
  draftToProposal,
} from '@/features/proposal/utils/draft-utils'
import { isValidStepId } from '@/features/proposal/utils/stepper-utils'

export interface UseDraftOperationsReturn {
  currentDraftId: string | null
  lastSaved: Date | null
  saveAsDraft: (currentStep: ProposalStepId) => Promise<string>
  loadDraft: (draftId: string) => Promise<void>
  setCurrentDraftId: React.Dispatch<React.SetStateAction<string | null>>
}

export function useDraftOperations(
  form: UseFormReturn<ProposalFormData>,
  getCurrentFormData: () => Partial<ProposalFormData>,
  hasFormData: () => boolean,
  setCurrentStep: (stepId: ProposalStepId) => void
): UseDraftOperationsReturn {
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { refreshDrafts } = useDrafts()

  const saveAsDraft = useCallback(
    async (currentStep: ProposalStepId): Promise<string> => {
      try {
        const formData = getCurrentFormData()

        if (!currentDraftId && !hasFormData()) {
          toast.error('No data to save as draft', {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
          return Promise.reject(new Error('No data to save as draft'))
        }

        const draftId = saveProposalAsDraft(
          formData,
          currentStep,
          currentDraftId || undefined
        )

        if (!currentDraftId) {
          setCurrentDraftId(draftId)
        }

        setLastSaved(new Date())
        refreshDrafts()
        return draftId
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Failed to save draft: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        })
        throw error
      }
    },
    [currentDraftId, getCurrentFormData, hasFormData, refreshDrafts]
  )

  const loadDraft = useCallback(
    async (draftId: string): Promise<void> => {
      try {
        const draft = getDraftById(draftId)

        if (!draft) {
          toast.error('Draft not found', {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
          return
        }

        if (draft.type !== 'proposal') {
          toast.error('Invalid draft type', {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
          return
        }

        setCurrentDraftId(draftId)

        let formData: Partial<ProposalFormData>
        try {
          formData = draftToProposal(draft)

          // Reset the form with the draft data
          form.reset(formData)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          toast.error(`Failed to process draft: ${errorMessage}`, {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
          return
        }

        // Navigate to the last active step with proper type checking
        const metadata = draft.metadata
        if (!metadata || typeof metadata !== 'object') {
          toast.error('Invalid draft metadata', {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
          return
        }

        const lastStep = metadata.currentStep
        if (typeof lastStep === 'string' && isValidStepId(lastStep)) {
          // Navigate to the saved step
          setCurrentStep(lastStep)

          // Show a success notification
          toast.success('Draft loaded successfully', {
            description: `Resuming from where you left off.`,
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Failed to load draft: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        })
      }
    },
    [form, setCurrentStep]
  )

  return {
    currentDraftId,
    lastSaved,
    saveAsDraft,
    loadDraft,
    setCurrentDraftId,
  }
}
