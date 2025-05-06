import { ProposalStepId } from '@/features/proposal'

export function getStepDescription(stepId: string): string {
  switch (stepId) {
    case 'policyholderInfo':
      return 'Enter the policyholder\'s personal information';
    case 'parcelDetails':
      return 'Provide details about the parcel being insured';
    case 'shippingCoverage':
      return 'Specify shipping information and coverage options';
    case 'premiumCalculation':
      return 'Review the calculated premium for your insurance';
    case 'documentsConsent':
      return 'Upload required documents and provide consent';
    default:
      return '';
  }
}

export function isValidStepId(id: string): id is ProposalStepId {
  return [
    'policyholderInfo',
    'parcelDetails',
    'shippingCoverage',
    'premiumCalculation',
    'documentsConsent',
  ].includes(id as ProposalStepId)
}