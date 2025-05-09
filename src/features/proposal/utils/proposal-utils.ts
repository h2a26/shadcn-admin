import {
  ParcelDetails,
  ProposalFormData,
  ShippingCoverage,
} from '@/features/proposal/data/schema'

interface StoredProposal extends ProposalFormData {
  id: string
  createdAt: string
  updatedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  workflowTaskId?: string
  currentWorkflowStep?: string
}

export const generateProposalNumber = (nrcNumber: string): string => {
  const date = new Date()
  const year = date.getFullYear().toString()
  // Ensure month and day are 2 digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  // Extract only numeric part of NRC number for the proposal number
  const numericNrc = nrcNumber.replace(/[^0-9]/g, '')

  return `FNI${year}${month}${day}${numericNrc}`
}

const calculateBasePremium = (
  declaredValue: number,
  coverageType: string
): number => {
  let rate: number

  switch (coverageType) {
    case 'Basic':
      rate = 0.02 // 2% of declared value
      break
    case 'Standard':
      rate = 0.035 // 3.5% of declared value
      break
    case 'Premium':
      rate = 0.05 // 5% of declared value
      break
    case 'Custom':
      rate = 0.045 // 4.5% of declared value
      break
    default:
      rate = 0.03 // Default 3% of declared value
  }

  return parseFloat((declaredValue * rate).toFixed(2))
}

const calculateRiskLoad = (parcelDetails: ParcelDetails): number => {
  let riskFactor = 0

  // Add risk factors based on parcel attributes
  if (parcelDetails.fragileItem) riskFactor += 0.02
  if (parcelDetails.highRiskItem) riskFactor += 0.03

  // Category-based risk factors
  switch (parcelDetails.category) {
    case 'Electronics':
      riskFactor += 0.015
      break
    case 'Fragile':
      riskFactor += 0.025
      break
    case 'Perishable':
      riskFactor += 0.02
      break
    default:
      riskFactor += 0.005
  }

  return parseFloat((parcelDetails.declaredValue * riskFactor).toFixed(2))
}

const calculateTotalPremium = (
  basePremium: number,
  riskLoad: number,
  discountCode?: string
): number => {
  let total = basePremium + riskLoad

  // Apply discount if valid code is provided
  if (discountCode) {
    if (discountCode.startsWith('DISCOUNT')) {
      total = total * 0.9 // 10% discount
    }
  }

  return parseFloat(total.toFixed(2))
}

export const calculatePremium = (
  parcelDetails: ParcelDetails,
  shippingCoverage: ShippingCoverage,
  discountCode?: string
): {
  basePremium: number
  riskLoad: number
  totalPremium: number
} => {
  const basePremium = calculateBasePremium(
    parcelDetails.declaredValue,
    shippingCoverage.coverageType
  )

  const riskLoad = calculateRiskLoad(parcelDetails)

  const totalPremium = calculateTotalPremium(
    basePremium,
    riskLoad,
    discountCode
  )

  return {
    basePremium,
    riskLoad,
    totalPremium,
  }
}

// Options for saving and updating proposals
export interface ProposalWorkflowData {
  workflowTaskId?: string
  currentWorkflowStep?: string
}

// Use ProposalWorkflowData directly as options type

export const saveProposalToLocalStorage = (
  proposalData: ProposalFormData,
  options?: ProposalWorkflowData
): string => {
  try {
    const existingProposals = JSON.parse(
      localStorage.getItem('parcelInsuranceProposals') || '[]'
    ) as StoredProposal[]

    // Generate a unique ID for the proposal
    const id = `proposal-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const now = new Date().toISOString()

    // Create the proposal object with metadata
    const proposal: StoredProposal = {
      ...proposalData,
      id,
      createdAt: now,
      status: 'submitted',
      workflowTaskId: options?.workflowTaskId,
      currentWorkflowStep: options?.currentWorkflowStep,
    }

    localStorage.setItem(
      'parcelInsuranceProposals',
      JSON.stringify([...existingProposals, proposal])
    )

    return proposal.id
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to save proposal: ${errorMessage}`)
  }
}

export const getProposalsFromLocalStorage = (): StoredProposal[] => {
  const storedData = localStorage.getItem('parcelInsuranceProposals')

  if (!storedData) {
    return []
  }

  const parsedData = JSON.parse(storedData) as unknown

  if (!Array.isArray(parsedData)) {
    localStorage.setItem('parcelInsuranceProposals', '[]')
    return []
  }

  // Type guard function to validate StoredProposal structure
  const isValidProposal = (item: unknown): item is StoredProposal => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'createdAt' in item &&
      'policyholderInfo' in item &&
      'parcelDetails' in item &&
      'shippingCoverage' in item &&
      'premiumCalculation' in item &&
      'documentsConsent' in item
    )
  }
  return parsedData.filter(isValidProposal)
}

export const updateProposalInLocalStorage = (
  id: string,
  updatedData: Partial<ProposalFormData> & ProposalWorkflowData
): boolean => {
  try {
    const proposals = getProposalsFromLocalStorage()

    const proposalIndex = proposals.findIndex((p) => p.id === id)

    if (proposalIndex === -1) {
      return false
    }

    // Create updated proposal with timestamp
    proposals[proposalIndex] = {
      ...proposals[proposalIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    }

    // Save back to local storage
    localStorage.setItem('parcelInsuranceProposals', JSON.stringify(proposals))

    return true
  } catch {
    return false
  }
}

export const deleteProposalFromLocalStorage = (id: string): boolean => {
  try {
    const proposals = getProposalsFromLocalStorage()

    const filteredProposals = proposals.filter((p) => p.id !== id)

    // If no proposal was removed, return false
    if (filteredProposals.length === proposals.length) {
      return false
    }

    localStorage.setItem(
      'parcelInsuranceProposals',
      JSON.stringify(filteredProposals)
    )

    return true
  } catch {
    return false
  }
}
