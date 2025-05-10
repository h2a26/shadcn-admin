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
    .union([
      z
        .string()
        .min(1, 'Declared value is required')
        .regex(/^\d+$/, 'Declared value must be a valid number'),
      z.number({ invalid_type_error: 'Declared value is required' }),
    ])
    .transform((val) => (typeof val === 'string' ? Number(val) : val))
    .refine((val) => val > 0, {
      message: 'Declared value must be greater than 0',
    }),
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
  identityDoc: fileSchema
    .optional()
    .nullable()
    .refine(
      (val) =>
        !val || val.type.startsWith('image/') || val.type === 'application/pdf',
      'Only image files or PDFs are allowed'
    )
    .refine(
      (val) => !val || val.size <= 5 * 1024 * 1024, // Max 5MB
      'File size must be less than 5MB'
    ),
  ownershipProof: fileSchema
    .optional()
    .nullable()
    .refine(
      (val) =>
        !val || val.type.startsWith('image/') || val.type === 'application/pdf',
      'Only image files or PDFs are allowed'
    )
    .refine(
      (val) => !val || val.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    ),
  invoice: fileSchema
    .optional()
    .nullable()
    .refine(
      (val) =>
        !val || val.type.startsWith('image/') || val.type === 'application/pdf',
      'Only image files or PDFs are allowed'
    )
    .refine(
      (val) => !val || val.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    ),
  agreeTerms: z.boolean().refine((val) => val, 'You must agree to the terms'),
  confirmAccuracy: z
    .boolean()
    .refine((val) => val, 'You must confirm accuracy'),
})

export const workflowSubmitSchema = z.object({
  assignedTo: z
    .string({
      required_error: 'Assignee is required', // Handles both undefined and empty string; no need for invalid_type_error unless null is expected
    })
    .min(1, 'Assignee is required'),
  comments: z.string().optional(),
  workflowStep: z
    .enum(['proposal', 'risk_review', 'approval'] as const)
    .default('proposal'),
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
