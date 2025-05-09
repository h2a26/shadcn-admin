import { WorkflowConfig } from './schema'

// Default workflow configuration for Parcel Insurance
export const parcelInsuranceWorkflowConfig: WorkflowConfig = {
  product: 'ParcelInsurance',
  steps: [
    {
      name: 'proposal',
      nextSteps: ['risk_review'],
      roles: ['underwriter'],
      allowReassignment: true,
      allowSendBack: true,
    },
    {
      name: 'risk_review',
      nextSteps: ['approval', 'proposal'],
      roles: ['risk_reviewer'],
      allowReassignment: true,
      allowSendBack: true,
    },
    {
      name: 'approval',
      nextSteps: [],
      roles: ['approver'],
      allowReassignment: false,
      allowSendBack: false,
    },
  ],
  roleBasedFiltering: {
    proposal: {
      underwriter: ['risk_reviewer'],
    },
    risk_review: {
      risk_reviewer: ['approver', 'underwriter'],
    },
  },
}

// Function to get workflow configuration for a specific product
export function getWorkflowConfig(product: string): WorkflowConfig | null {
  // In the future, this would fetch from an API
  if (product === 'ParcelInsurance') {
    return parcelInsuranceWorkflowConfig
  }

  return null
}
