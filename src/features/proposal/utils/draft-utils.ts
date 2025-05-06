import { Draft, DraftType } from '@/features/drafts';
import { ParcelInsuranceProposal } from '../types';
import { saveDraftToStorage, updateDraftInStorage } from '@/features/drafts';

/**
 * Converts a proposal form state to a draft object
 * @param proposal The proposal form data
 * @param currentStep The current step in the form
 * @returns The draft object
 */
export function proposalToDraft(
  proposal: Partial<ParcelInsuranceProposal>, 
  currentStep: string
): Omit<Draft, 'id' | 'createdAt'> {
  // Generate a title based on available data
  let title = 'Untitled Proposal';
  
  if (proposal.policyholderInfo?.fullName) {
    title = `Proposal for ${proposal.policyholderInfo.fullName}`;
  } else if (proposal.parcelDetails?.description) {
    title = `Proposal: ${proposal.parcelDetails.description}`;
  }

  // Calculate completion percentage based on steps completed
  const totalSteps = 5; // Total number of steps in the proposal form
  const stepIndices = {
    'policyholderInfo': 1,
    'parcelDetails': 2,
    'shippingCoverage': 3,
    'premiumCalculation': 4,
    'documentsConsent': 5
  };
  
  const currentStepIndex = stepIndices[currentStep as keyof typeof stepIndices] || 1;
  const completionPercentage = Math.round((currentStepIndex / totalSteps) * 100);

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
    tags: ['proposal', currentStep]
  };
}

/**
 * Saves a proposal as a draft
 * @param proposal The proposal form data
 * @param currentStep The current step in the form
 * @param existingDraftId Optional existing draft ID to update
 * @returns The ID of the saved draft
 */
export function saveProposalAsDraft(
  proposal: Partial<ParcelInsuranceProposal>,
  currentStep: string,
  existingDraftId?: string
): string {
  const draftData = proposalToDraft(proposal, currentStep);
  
  if (existingDraftId) {
    // Update existing draft
    const success = updateDraftInStorage(existingDraftId, draftData);
    if (!success) {
      throw new Error('Failed to update draft');
    }
    return existingDraftId;
  } else {
    // Create new draft
    return saveDraftToStorage(draftData);
  }
}

/**
 * Extracts a proposal from a draft
 * @param draft The draft object
 * @returns The proposal form data
 */
export function draftToProposal(draft: Draft): Partial<ParcelInsuranceProposal> {
  if (draft.type !== 'proposal') {
    throw new Error('Draft is not a proposal');
  }
  
  return draft.content as Partial<ParcelInsuranceProposal>;
}
