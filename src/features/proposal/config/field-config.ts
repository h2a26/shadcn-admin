import { ParcelCategory, CoverageType, RiderOption } from '../types';

// Configuration for Policyholder Info fields
export const policyholderInfoConfig = {
  fields: [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      validation: {
        required: 'Full name is required',
      },
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter phone number',
      required: true,
      validation: {
        required: 'Phone number is required',
        pattern: {
          value: /^[0-9+\s-]+$/,
          message: 'Invalid phone number format',
        },
      },
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: false,
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      },
    },
    {
      id: 'nrcNumber',
      label: 'NRC Number',
      type: 'text',
      placeholder: 'Enter NRC number',
      required: true,
      validation: {
        required: 'NRC number is required',
        pattern: {
          value: /^[0-9/()]+$/,
          message: 'Invalid NRC number format',
        },
      },
    },
    {
      id: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter address',
      required: false,
      rows: 3,
    },
  ],
};

// Configuration for Parcel Details fields
export const parcelDetailsConfig = {
  fields: [
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Describe the parcel contents',
      required: true,
      rows: 3,
      validation: {
        required: 'Description is required',
      },
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select category',
      required: true,
      options: [
        'Electronics',
        'Documents',
        'Clothing',
        'Fragile',
        'Perishable',
        'Other',
      ] as ParcelCategory[],
      validation: {
        required: 'Category is required',
      },
    },
    {
      id: 'declaredValue',
      label: 'Declared Value',
      type: 'number',
      placeholder: 'Enter declared value',
      required: true,
      min: 1,
      step: '0.01',
      validation: {
        required: 'Declared value is required',
        min: {
          value: 1,
          message: 'Declared value must be greater than 0',
        },
      },
    },
    {
      id: 'weightKg',
      label: 'Weight (kg)',
      type: 'number',
      placeholder: 'Enter weight',
      required: false,
      step: '0.01',
    },
    {
      id: 'dimensions',
      label: 'Dimensions (cm)',
      type: 'group',
      fields: [
        {
          id: 'lengthCm',
          label: 'Length',
          type: 'number',
          placeholder: 'Length',
          required: false,
          step: '0.1',
        },
        {
          id: 'widthCm',
          label: 'Width',
          type: 'number',
          placeholder: 'Width',
          required: false,
          step: '0.1',
        },
        {
          id: 'heightCm',
          label: 'Height',
          type: 'number',
          placeholder: 'Height',
          required: false,
          step: '0.1',
        },
      ],
    },
    {
      id: 'fragileItem',
      label: 'Fragile Item',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'highRiskItem',
      label: 'High Risk Item',
      type: 'checkbox',
      required: false,
    },
  ],
};

// Configuration for Shipping & Coverage fields
export const shippingCoverageConfig = {
  fields: [
    {
      id: 'origin',
      label: 'Origin',
      type: 'text',
      placeholder: 'Enter origin location',
      required: true,
      validation: {
        required: 'Origin is required',
      },
    },
    {
      id: 'destination',
      label: 'Destination',
      type: 'text',
      placeholder: 'Enter destination location',
      required: true,
      validation: {
        required: 'Destination is required',
      },
    },
    {
      id: 'shippingDate',
      label: 'Shipping Date',
      type: 'date',
      required: true,
      validation: {
        required: 'Shipping date is required',
      },
    },
    {
      id: 'deliveryDate',
      label: 'Delivery Date',
      type: 'date',
      required: true,
      validation: {
        required: 'Delivery date is required',
      },
    },
    {
      id: 'coverageType',
      label: 'Coverage Type',
      type: 'select',
      placeholder: 'Select coverage type',
      required: true,
      options: ['Basic', 'Standard', 'Premium', 'Custom'] as CoverageType[],
      validation: {
        required: 'Coverage type is required',
      },
    },
    {
      id: 'deductible',
      label: 'Deductible',
      type: 'number',
      placeholder: 'Enter deductible amount',
      required: false,
      min: 0,
      step: '0.01',
    },
    {
      id: 'riders',
      label: 'Additional Riders',
      type: 'multiselect',
      placeholder: 'Select additional riders',
      required: false,
      options: [
        'Water Damage',
        'Theft Protection',
        'Extended Coverage',
        'Express Claims',
      ] as RiderOption[],
    },
  ],
};

// Configuration for Premium Calculation fields
export const premiumCalculationConfig = {
  fields: [
    {
      id: 'proposalNo',
      label: 'Proposal Number',
      type: 'text',
      readOnly: true,
      required: true,
    },
    {
      id: 'basePremium',
      label: 'Base Premium',
      type: 'number',
      readOnly: true,
      required: true,
    },
    {
      id: 'riskLoad',
      label: 'Risk Load',
      type: 'number',
      readOnly: true,
      required: true,
    },
    {
      id: 'totalPremium',
      label: 'Total Premium',
      type: 'number',
      readOnly: true,
      required: true,
      className: 'font-bold',
    },
    {
      id: 'discountCode',
      label: 'Discount Code',
      type: 'text',
      placeholder: 'Enter discount code',
      required: false,
      helpText: 'Enter a valid discount code to receive a premium reduction',
    },
  ],
};

// Configuration for Documents & Consent fields
export const documentsConsentConfig = {
  fields: [
    {
      id: 'identityDoc',
      label: 'Identity Document',
      type: 'file',
      required: true,
      validation: {
        required: 'Identity document is required',
      },
      helpText: 'Upload a valid government-issued ID (passport, driver license, etc.)',
    },
    {
      id: 'ownershipProof',
      label: 'Ownership Proof',
      type: 'file',
      required: true,
      validation: {
        required: 'Ownership proof is required',
      },
      helpText: 'Upload proof of ownership for the parcel contents (receipt, certificate, etc.)',
    },
    {
      id: 'invoice',
      label: 'Invoice',
      type: 'file',
      required: false,
      helpText: 'Upload an invoice or receipt if available',
    },
    {
      id: 'agreeTerms',
      label: 'I agree to the terms and conditions',
      type: 'checkbox',
      required: true,
      validation: {
        required: 'You must agree to the terms',
      },
      helpText: 'By checking this box, you agree to the insurance policy terms, coverage limits, exclusions, and claims process as outlined in our terms and conditions.',
    },
    {
      id: 'confirmAccuracy',
      label: 'I confirm the accuracy of the information provided',
      type: 'checkbox',
      required: true,
      validation: {
        required: 'You must confirm accuracy',
      },
      helpText: 'I confirm that all information provided in this proposal is accurate and complete. I understand that providing false information may result in claim denial or policy cancellation.',
    },
  ],
};
