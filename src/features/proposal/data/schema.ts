import { z } from 'zod'

export const policyholderInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\s-]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  nrcNumber: z
    .string()
    .min(1, 'NRC number is required')
    .regex(/^[0-9/()]+$/, 'Invalid NRC number format'),
  address: z.string().optional().or(z.literal('')),
})

export const parcelDetailsSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  declaredValue: z
    .number()
    .min(1, 'Declared value must be greater than 0')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((val) => val > 0, 'Declared value must be greater than 0'),
  weightKg: z
    .number()
    .optional()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
        .optional()
    ),
  lengthCm: z
    .number()
    .optional()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
        .optional()
    ),
  widthCm: z
    .number()
    .optional()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
        .optional()
    ),
  heightCm: z
    .number()
    .optional()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
        .optional()
    ),
  fragileItem: z.boolean().default(false),
  highRiskItem: z.boolean().default(false),
})

export const shippingCoverageSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  shippingDate: z.date({
    required_error: 'Shipping date is required',
    invalid_type_error: 'Invalid shipping date',
  }),
  deliveryDate: z.date({
    required_error: 'Delivery date is required',
    invalid_type_error: 'Invalid delivery date',
  }),
  coverageType: z.string().min(1, 'Coverage type is required'),
  deductible: z
    .number()
    .optional()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
        .optional()
    ),
  riders: z.array(z.string()).optional(),
})

export const premiumCalculationSchema = z.object({
  proposalNo: z.string().min(1, 'Proposal number is required'),
  basePremium: z.number(),
  riskLoad: z.number(),
  totalPremium: z.number(),
  discountCode: z.string().optional().or(z.literal('')),
})

// Define a proper file schema for document uploads
const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  // Base64 data or file reference
  data: z.string().optional(),
})

export const documentsConsentSchema = z.object({
  identityDoc: fileSchema.optional().nullable(),
  ownershipProof: fileSchema.optional().nullable(),
  invoice: fileSchema.optional().nullable(),
  agreeTerms: z.boolean().refine((val) => val, 'You must agree to the terms'),
  confirmAccuracy: z
    .boolean()
    .refine((val) => val, 'You must confirm accuracy'),
})


export const workflowSubmitSchema = z.object({
  assignedTo: z.string().min(1, 'Assignee is required'),
  comments: z.string().optional(),
  workflowStep: z.enum(['proposal', 'risk_review', 'approval'] as const).default('proposal'),
})


export const proposalFormSchema = z.object({
  policyholderInfo: policyholderInfoSchema,
  parcelDetails: parcelDetailsSchema,
  shippingCoverage: shippingCoverageSchema,
  premiumCalculation: premiumCalculationSchema,
  documentsConsent: documentsConsentSchema,
  workflowSubmit: workflowSubmitSchema,
})

export type PolicyholderInfo = z.infer<typeof policyholderInfoSchema>
export type ParcelDetails = z.infer<typeof parcelDetailsSchema>
export type ShippingCoverage = z.infer<typeof shippingCoverageSchema>
export type PremiumCalculation = z.infer<typeof premiumCalculationSchema>
export type DocumentsConsent = z.infer<typeof documentsConsentSchema>
export type WorkflowSubmit = z.infer<typeof workflowSubmitSchema>
export type ProposalFormData = z.infer<typeof proposalFormSchema>

export type CoverageType = 'Basic' | 'Standard' | 'Premium' | 'Custom'
export type ParcelCategory =
  | 'Electronics'
  | 'Documents'
  | 'Clothing'
  | 'Fragile'
  | 'Perishable'
  | 'Other'
export type RiderOption =
  | 'Water Damage'
  | 'Theft Protection'
  | 'Extended Coverage'
  | 'Express Claims'
export type ProposalStepId =
  | 'policyholderInfo'
  | 'parcelDetails'
  | 'shippingCoverage'
  | 'premiumCalculation'
  | 'documentsConsent'
  | 'workflowSubmit'
