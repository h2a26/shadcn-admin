import { Draft, DraftType } from '@/features/drafts/types'
import {
  saveDraftToStorage,
  updateDraftInStorage,
} from '@/features/drafts/utils'
import { ProposalFormData } from '@/features/proposal/data/schema'

function proposalToDraft(
  proposal: Partial<ProposalFormData>,
  currentStep: string
): Omit<Draft, 'id' | 'createdAt'> {
  let title = 'Untitled Proposal'

  if (proposal.policyholderInfo?.fullName) {
    title = `${proposal.policyholderInfo.fullName}`
  } else if (proposal.parcelDetails?.description) {
    title = `${proposal.parcelDetails.description}`
  }

  const totalSteps = 6
  const stepIndices = {
    policyholderInfo: 1,
    parcelDetails: 2,
    shippingCoverage: 3,
    premiumCalculation: 4,
    documentsConsent: 5,
    workflowSubmit: 6,
  }

  const currentStepIndex =
    stepIndices[currentStep as keyof typeof stepIndices] || 1
  const completionPercentage = Math.round((currentStepIndex / totalSteps) * 100)

  return {
    title,
    type: 'proposal' as DraftType,
    status: 'draft',
    content: proposal,
    metadata: {
      currentStep,
      completionPercentage,
      lastEditedAt: new Date().toISOString(),
      proposalNo: proposal.premiumCalculation?.proposalNo || '',
    },
    tags: ['proposal', currentStep],
  }
}

export function saveProposalAsDraft(
  proposal: Partial<ProposalFormData>,
  currentStep: string,
  existingDraftId?: string
): string {
  const draftData = proposalToDraft(proposal, currentStep)

  if (existingDraftId) {
    // Update existing draft
    const success = updateDraftInStorage(existingDraftId, draftData)
    if (!success) {
      throw new Error('Failed to update draft')
    }
    return existingDraftId
  } else {
    // Create new draft
    return saveDraftToStorage(draftData)
  }
}

export function draftToProposal(draft: Draft): Partial<ProposalFormData> {
  if (draft.type !== 'proposal') {
    throw new Error('Draft is not a proposal')
  }

  return draft.content as Partial<ProposalFormData>
}
