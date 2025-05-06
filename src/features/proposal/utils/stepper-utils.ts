/**
 * Get the description for a proposal step
 * @param stepId The step ID
 * @returns The step description
 */
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

/**
 * Type guard to check if a step ID is valid
 * @param id The step ID to check
 * @returns True if the ID is a valid step ID
 */
export function isValidStepId(id: string): boolean {
  return ['policyholderInfo', 'parcelDetails', 'shippingCoverage', 
          'premiumCalculation', 'documentsConsent'].includes(id);
}
