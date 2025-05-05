import { z } from "zod";

// Policyholder Info Schema
export const policyholderInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\s-]+$/, "Invalid phone number format"),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  nrcNumber: z
    .string()
    .min(1, "NRC number is required")
    .regex(/^[0-9/()]+$/, "Invalid NRC number format"),
  address: z.string().optional().or(z.literal("")),
});

// Parcel Details Schema
export const parcelDetailsSchema = z.object({
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  declaredValue: z
    .number()
    .min(1, "Declared value must be greater than 0")
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((val) => val > 0, "Declared value must be greater than 0"),
  weightKg: z
    .number()
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number).optional()),
  lengthCm: z
    .number()
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number).optional()),
  widthCm: z
    .number()
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number).optional()),
  heightCm: z
    .number()
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number).optional()),
  fragileItem: z.boolean().default(false),
  highRiskItem: z.boolean().default(false),
});

// Shipping & Coverage Schema
export const shippingCoverageSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  shippingDate: z.date({
    required_error: "Shipping date is required",
    invalid_type_error: "Invalid shipping date",
  }),
  deliveryDate: z.date({
    required_error: "Delivery date is required",
    invalid_type_error: "Invalid delivery date",
  }),
  coverageType: z.string().min(1, "Coverage type is required"),
  deductible: z
    .number()
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number).optional()),
  riders: z.array(z.string()).optional(),
});

// Premium Calculation Schema
export const premiumCalculationSchema = z.object({
  proposalNo: z.string().min(1, "Proposal number is required"),
  basePremium: z.number(),
  riskLoad: z.number(),
  totalPremium: z.number(),
  discountCode: z.string().optional().or(z.literal("")),
});

// Documents & Consent Schema
export const documentsConsentSchema = z.object({
  // Make file validation more flexible to handle both File objects and null/undefined
  identityDoc: z.any().optional().nullable(),
  ownershipProof: z.any().optional().nullable(),
  invoice: z.any().optional().nullable(),
  agreeTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
  confirmAccuracy: z.boolean().refine((val) => val, "You must confirm accuracy"),
});

// For form validation in stepper
export const stepperSchemas = {
  policyholderInfo: policyholderInfoSchema,
  parcelDetails: parcelDetailsSchema,
  shippingCoverage: shippingCoverageSchema,
  premiumCalculation: premiumCalculationSchema,
  documentsConsent: documentsConsentSchema,
};
