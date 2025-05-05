import { ParcelDetails, ShippingCoverage } from "../types";

/**
 * Generates a proposal number in the format FNI+year+month+day+nrc number
 * @param nrcNumber The NRC number of the policyholder
 * @returns A formatted proposal number
 */
export const generateProposalNumber = (nrcNumber: string): string => {
  const date = new Date();
  const year = date.getFullYear().toString();
  // Ensure month and day are 2 digits
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  
  // Extract only numeric part of NRC number for the proposal number
  const numericNrc = nrcNumber.replace(/[^0-9]/g, "");
  
  return `FNI${year}${month}${day}${numericNrc}`;
};

/**
 * Calculates the base premium based on declared value and coverage type
 * @param declaredValue The declared value of the parcel
 * @param coverageType The selected coverage type
 * @returns The calculated base premium
 */
export const calculateBasePremium = (
  declaredValue: number,
  coverageType: string
): number => {
  let rate = 0;
  
  switch (coverageType) {
    case "Basic":
      rate = 0.02; // 2% of declared value
      break;
    case "Standard":
      rate = 0.035; // 3.5% of declared value
      break;
    case "Premium":
      rate = 0.05; // 5% of declared value
      break;
    case "Custom":
      rate = 0.045; // 4.5% of declared value
      break;
    default:
      rate = 0.03; // Default 3% of declared value
  }
  
  return parseFloat((declaredValue * rate).toFixed(2));
};

/**
 * Calculates the risk load based on parcel details
 * @param parcelDetails The details of the parcel
 * @returns The calculated risk load
 */
export const calculateRiskLoad = (parcelDetails: ParcelDetails): number => {
  let riskFactor = 0;
  
  // Add risk factors based on parcel attributes
  if (parcelDetails.fragileItem) riskFactor += 0.02;
  if (parcelDetails.highRiskItem) riskFactor += 0.03;
  
  // Category-based risk factors
  switch (parcelDetails.category) {
    case "Electronics":
      riskFactor += 0.015;
      break;
    case "Fragile":
      riskFactor += 0.025;
      break;
    case "Perishable":
      riskFactor += 0.02;
      break;
    default:
      riskFactor += 0.005;
  }
  
  return parseFloat((parcelDetails.declaredValue * riskFactor).toFixed(2));
};

/**
 * Calculates the total premium
 * @param basePremium The base premium amount
 * @param riskLoad The risk load amount
 * @param discountCode Optional discount code
 * @returns The calculated total premium
 */
export const calculateTotalPremium = (
  basePremium: number,
  riskLoad: number,
  discountCode?: string
): number => {
  let total = basePremium + riskLoad;
  
  // Apply discount if valid code is provided
  if (discountCode) {
    // This would typically check against a database of valid codes
    // For now, we'll just check if it starts with "DISCOUNT"
    if (discountCode.startsWith("DISCOUNT")) {
      total = total * 0.9; // 10% discount
    }
  }
  
  return parseFloat(total.toFixed(2));
};

/**
 * Calculates all premium components
 * @param parcelDetails The details of the parcel
 * @param shippingCoverage The shipping and coverage details
 * @param discountCode Optional discount code
 * @returns Object containing all premium calculation components
 */
export const calculatePremium = (
  parcelDetails: ParcelDetails,
  shippingCoverage: ShippingCoverage,
  discountCode?: string
) => {
  const basePremium = calculateBasePremium(
    parcelDetails.declaredValue,
    shippingCoverage.coverageType
  );
  
  const riskLoad = calculateRiskLoad(parcelDetails);
  
  const totalPremium = calculateTotalPremium(
    basePremium,
    riskLoad,
    discountCode
  );
  
  return {
    basePremium,
    riskLoad,
    totalPremium,
  };
};

/**
 * Saves the proposal data to local storage
 * @param proposalData The complete proposal data
 */
export const saveProposalToLocalStorage = (proposalData: any) => {
  try {
    // Get existing proposals or initialize empty array
    const existingProposals = JSON.parse(
      localStorage.getItem("parcelInsuranceProposals") || "[]"
    );
    
    // Add new proposal with timestamp
    const proposalWithTimestamp = {
      ...proposalData,
      createdAt: new Date().toISOString(),
      id: `proposal-${Date.now()}`,
    };
    
    // Save updated proposals array
    localStorage.setItem(
      "parcelInsuranceProposals",
      JSON.stringify([...existingProposals, proposalWithTimestamp])
    );
    
    return proposalWithTimestamp.id;
  } catch (error) {
    console.error("Error saving proposal to local storage:", error);
    throw new Error("Failed to save proposal");
  }
};

/**
 * Retrieves all proposals from local storage
 * @returns Array of saved proposals
 */
export const getProposalsFromLocalStorage = () => {
  try {
    return JSON.parse(
      localStorage.getItem("parcelInsuranceProposals") || "[]"
    );
  } catch (error) {
    console.error("Error retrieving proposals from local storage:", error);
    return [];
  }
};
