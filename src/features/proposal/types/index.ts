export interface PolicyholderInfo {
  fullName: string;
  phoneNumber: string;
  email?: string;
  nrcNumber: string;
  address?: string;
}

export interface ParcelDetails {
  description: string;
  category: string;
  declaredValue: number;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  fragileItem: boolean;
  highRiskItem: boolean;
}

export interface ShippingCoverage {
  origin: string;
  destination: string;
  shippingDate: Date;
  deliveryDate: Date;
  coverageType: string;
  deductible?: number;
  riders?: string[];
}

export interface PremiumCalculation {
  proposalNo: string;
  basePremium: number;
  riskLoad: number;
  totalPremium: number;
  discountCode?: string;
}

export interface DocumentsConsent {
  identityDoc?: File | null;
  ownershipProof?: File | null;
  invoice?: File | null;
  agreeTerms: boolean;
  confirmAccuracy: boolean;
}

export interface ParcelInsuranceProposal {
  policyholderInfo: PolicyholderInfo;
  parcelDetails: ParcelDetails;
  shippingCoverage: ShippingCoverage;
  premiumCalculation: PremiumCalculation;
  documentsConsent: DocumentsConsent;
}

export type CoverageType = "Basic" | "Standard" | "Premium" | "Custom";
export type ParcelCategory = "Electronics" | "Documents" | "Clothing" | "Fragile" | "Perishable" | "Other";
export type RiderOption = "Water Damage" | "Theft Protection" | "Extended Coverage" | "Express Claims";
