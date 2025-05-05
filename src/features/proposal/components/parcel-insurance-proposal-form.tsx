import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { defineStepper } from '@/components/ui/stepper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { PolicyholderInfoForm } from './policy-holder-info-form.tsx';
import { ParcelDetailsForm } from './parcel-details-form.tsx';
import { ShippingCoverageForm } from './shipping-coverage-form.tsx';
import { PremiumCalculationForm } from './premium-calculation-form.tsx';
import { DocumentsConsentForm } from './documents-consent-form.tsx';
import { stepperSchemas } from '../schemas/form-schemas.ts';
import { generateProposalNumber, saveProposalToLocalStorage } from '@/features/proposal';
import { ParcelInsuranceProposal } from '../types';

// Define the stepper with all steps
const { Stepper, useStepper } = defineStepper(
  {
    id: 'policyholderInfo',
    title: 'Policyholder Info',
    schema: stepperSchemas.policyholderInfo,
    Component: PolicyholderInfoForm,
  },
  {
    id: 'parcelDetails',
    title: 'Parcel Details',
    schema: stepperSchemas.parcelDetails,
    Component: ParcelDetailsForm,
  },
  {
    id: 'shippingCoverage',
    title: 'Shipping & Coverage',
    schema: stepperSchemas.shippingCoverage,
    Component: ShippingCoverageForm,
  },
  {
    id: 'premiumCalculation',
    title: 'Premium Calculation',
    schema: stepperSchemas.premiumCalculation,
    Component: PremiumCalculationForm,
  },
  {
    id: 'documentsConsent',
    title: 'Documents & Consent',
    schema: stepperSchemas.documentsConsent,
    Component: DocumentsConsentForm,
  }
);

// Create a merged schema for the entire form using the stepper schemas
const proposalFormSchema = z.object({
  policyholderInfo: stepperSchemas.policyholderInfo,
  parcelDetails: stepperSchemas.parcelDetails,
  shippingCoverage: stepperSchemas.shippingCoverage,
  premiumCalculation: stepperSchemas.premiumCalculation,
  documentsConsent: stepperSchemas.documentsConsent,
});

export function ParcelInsuranceProposalForm() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Parcel Insurance Underwriting</h1>
        <p className='text-muted-foreground'>
          Complete the form below to create a new parcel insurance proposal
        </p>
      </div>
      <Stepper.Provider>
        <FormStepperComponent />
      </Stepper.Provider>
    </div>
  );
}

const FormStepperComponent = () => {
  const methods = useStepper();

  // Use the ParcelInsuranceProposal interface from types/index.ts
  type FormData = ParcelInsuranceProposal;
  
  const form = useForm<FormData>({
    mode: 'onTouched',
    // Cast the resolver to the correct type to resolve TypeScript errors
    // This is safe because we're using the correct schema for our form data
    resolver: zodResolver(proposalFormSchema) as unknown as Resolver<FormData>,
    shouldUnregister: false,
    defaultValues: {
      policyholderInfo: {
        fullName: '',
        phoneNumber: '',
        email: '',
        nrcNumber: '',
        address: '',
      },
      parcelDetails: {
        description: '',
        category: '',
        declaredValue: 0,
        weightKg: undefined,
        lengthCm: undefined,
        widthCm: undefined,
        heightCm: undefined,
        fragileItem: false,
        highRiskItem: false,
      },
      shippingCoverage: {
        origin: '',
        destination: '',
        shippingDate: new Date(),
        deliveryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        coverageType: '',
        deductible: undefined,
        riders: [],
      },
      premiumCalculation: {
        proposalNo: '',
        basePremium: 0,
        riskLoad: 0,
        totalPremium: 0,
        discountCode: '',
      },
      documentsConsent: {
        identityDoc: undefined,
        ownershipProof: undefined,
        invoice: undefined,
        agreeTerms: false,
        confirmAccuracy: false,
      },
    },
  });

  // Generate proposal number when reaching the premium calculation step
  useEffect(() => {
    if (methods.current.id === 'premiumCalculation') {
      const nrcNumber = form.getValues('policyholderInfo.nrcNumber');
      if (nrcNumber && !form.getValues('premiumCalculation.proposalNo')) {
        const proposalNo = generateProposalNumber(nrcNumber);
        form.setValue('premiumCalculation.proposalNo', proposalNo);
      }
    }
  }, [methods.current.id, form, methods]);

  // Define a properly typed submit handler
  const onSubmit = form.handleSubmit((data: FormData) => {
    try {
      if (methods.isLast) {
        // Save the proposal to local storage
        const proposalId = saveProposalToLocalStorage(data);
        
        // Use a more user-friendly notification method in a production environment
        // This is a placeholder for demonstration purposes
        alert(`Proposal submitted successfully! ID: ${proposalId}`);
        
        // Reset the form and go back to the first step
        form.reset();
        methods.reset();
      } else {
        // Move to the next step
        methods.next();
      }
    } catch (error: unknown) {
      // In a production environment, implement proper error handling and logging
      // For example, send error to a monitoring service
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`There was an error submitting your proposal: ${errorMessage}`);
    }
  });

  // Validate the current step's fields
  const validateCurrentStep = (): Promise<boolean> => {
    const currentStepId = methods.current.id;
    
    // Use type assertion with a type predicate to ensure type safety
    const isValidStepId = (id: string): id is keyof FormData => {
      return ['policyholderInfo', 'parcelDetails', 'shippingCoverage', 
              'premiumCalculation', 'documentsConsent'].includes(id);
    };
    
    if (isValidStepId(currentStepId)) {
      return form.trigger(currentStepId);
    }
    
    // If the step ID is not recognized, return a resolved promise with false
    return Promise.resolve(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='space-y-8'>
        <Stepper.Navigation className='mb-8'>
          {methods.all.map((step) => (
            <Stepper.Step
              key={step.id}
              of={step.id}
              disabled={
                methods.all.findIndex((s) => s.id === step.id) >
                methods.all.findIndex((s) => s.id === methods.current.id)
              }
              onClick={() => {
                if (
                  methods.all.findIndex((s) => s.id === step.id) <=
                  methods.all.findIndex((s) => s.id === methods.current.id)
                ) {
                  methods.goTo(step.id);
                }
              }}
            >
              <Stepper.Title>{step.title}</Stepper.Title>
            </Stepper.Step>
          ))}
        </Stepper.Navigation>

        <div className='bg-card p-6 rounded-lg border shadow-sm'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold'>{methods.current.title}</h2>
            <p className='text-sm text-muted-foreground'>
              {getStepDescription(methods.current.id)}
            </p>
          </div>

          {methods.switch({
            policyholderInfo: ({ Component }) => <Component />,
            parcelDetails: ({ Component }) => <Component />,
            shippingCoverage: ({ Component }) => <Component />,
            premiumCalculation: ({ Component }) => <Component />,
            documentsConsent: ({ Component }) => <Component />,
          })}
        </div>

        <Stepper.Controls className='flex justify-between mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={methods.prev}
            disabled={methods.isFirst}
          >
            Previous
          </Button>
          <Button 
            type='button'
            onClick={async () => {
              // If it's the last step, submit the form
              if (methods.isLast) {
                // Use await to properly handle the Promise returned by onSubmit
                await onSubmit();
              } else {
                const currentStepId = methods.current.id;
                
                // Special handling for step 4 (Premium Calculation) to step 5 (Documents & Consent)
                if (currentStepId === 'premiumCalculation') {
                  // For Premium Calculation step, just proceed to the next step
                  // since all fields are calculated automatically
                  methods.next();
                } else {
                  // For other steps, validate normally
                  const isValid = await validateCurrentStep();
                  if (isValid) {
                    methods.next();
                  }
                  // If validation fails, form errors will be displayed automatically
                  // by React Hook Form, so no additional handling is needed here
                }
              }
            }}
          >
            {methods.isLast ? 'Submit Proposal' : 'Continue'}
          </Button>
        </Stepper.Controls>
      </form>
    </Form>
  );
};

// Helper function to get step descriptions
const getStepDescription = (stepId: string): string => {
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
};
