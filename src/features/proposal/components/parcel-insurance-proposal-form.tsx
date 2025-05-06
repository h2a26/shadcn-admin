import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { defineStepper } from '@/components/ui/stepper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { PolicyholderInfoForm } from '@/features/proposal/components/policy-holder-info-form';
import { ParcelDetailsForm } from '@/features/proposal/components/parcel-details-form';
import { ShippingCoverageForm } from '@/features/proposal/components/shipping-coverage-form';
import { PremiumCalculationForm } from '@/features/proposal/components/premium-calculation-form';
import { DocumentsConsentForm } from '@/features/proposal/components/documents-consent-form';
import { stepperSchemas } from '@/features/proposal/schemas/form-schemas';
import { generateProposalNumber, saveProposalToLocalStorage } from '@/features/proposal';
import { ParcelInsuranceProposal } from '@/features/proposal/types';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { SaveIcon } from 'lucide-react';
import { useDrafts } from '@/features/drafts';
import { DraftStatus, DraftType } from '@/features/drafts/types';
import { saveDraftToStorage, updateDraftInStorage } from '@/features/drafts/utils/storage-utils';
import { getDraftById } from '@/features/drafts/utils/storage-utils';

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

const proposalFormSchema = z.object({
  policyholderInfo: stepperSchemas.policyholderInfo,
  parcelDetails: stepperSchemas.parcelDetails,
  shippingCoverage: stepperSchemas.shippingCoverage,
  premiumCalculation: stepperSchemas.premiumCalculation,
  documentsConsent: stepperSchemas.documentsConsent,
});

export function ParcelInsuranceProposalForm() {
  return (
    <Stepper.Provider>
      <FormStepperComponent />
    </Stepper.Provider>
  );
}

const FormStepperComponent = () => {
  const methods = useStepper();
  const router = useRouter();
  const { refreshDrafts } = useDrafts();
  
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled] = useState(true);
  const autoSaveIntervalRef = useRef<number | null>(null);
  const formDataRef = useRef<Partial<ParcelInsuranceProposal> | null>(null);

  type FormData = ParcelInsuranceProposal;
  
  const form = useForm<FormData>({
    mode: 'onTouched',
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

  const getCurrentFormData = useCallback((): Partial<ParcelInsuranceProposal> => {
    return form.getValues();
  }, [form]);

  const hasFormData = useCallback((): boolean => {
    const formData = getCurrentFormData();
    
    const hasPolicyholderInfo = formData.policyholderInfo && Object.values(formData.policyholderInfo).some(
      value => typeof value === 'string' && value.trim() !== ''
    );
    
    // Check if parcel details has any non-empty values
    const hasParcelDetails = formData.parcelDetails && Object.entries(formData.parcelDetails).some(
      ([_, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return value > 0;
        if (typeof value === 'boolean') return value;
        return false;
      }
    );
    
    return Boolean(hasPolicyholderInfo || hasParcelDetails);
  }, [getCurrentFormData]);

  const saveAsDraft = useCallback(async (): Promise<string> => {
    try {
      const formData = getCurrentFormData();
      formDataRef.current = formData;
      
      // Don't save if there's no meaningful data (prevents empty drafts)
      if (!currentDraftId && !hasFormData()) {
        throw new Error('No data to save as draft');
      }
      
      // Create or update draft
      let draftId: string;
      if (currentDraftId) {
        // Update existing draft
        const draftData = {
          title: formData.policyholderInfo?.fullName 
            ? `Proposal for ${formData.policyholderInfo.fullName}` 
            : 'Untitled Proposal',
          content: formData,
          metadata: {
            currentStep: methods.current.id,
            lastEditedAt: new Date().toISOString(),
            proposalNo: formData.premiumCalculation?.proposalNo || '',
          },
          updatedAt: new Date().toISOString(),
        };
        
        const success = updateDraftInStorage(currentDraftId, draftData);
        if (!success) {
          throw new Error('Failed to update draft');
        }
        draftId = currentDraftId;
      } else {
        // Create new draft
        const draftData = {
          title: formData.policyholderInfo?.fullName 
            ? `Proposal for ${formData.policyholderInfo.fullName}` 
            : 'Untitled Proposal',
          type: 'proposal' as DraftType,
          status: 'draft' as DraftStatus,
          content: formData,
          metadata: {
            currentStep: methods.current.id,
            lastEditedAt: new Date().toISOString(),
            proposalNo: formData.premiumCalculation?.proposalNo || '',
          },
          tags: ['proposal', methods.current.id],
        };
        
        draftId = saveDraftToStorage(draftData);
        setCurrentDraftId(draftId);
      }
      
      setLastSaved(new Date());
      refreshDrafts();
      return draftId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to save draft: ${errorMessage}`);
      throw error;
    }
  }, [currentDraftId, getCurrentFormData, hasFormData, methods, refreshDrafts]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled) {
      // Set up auto-save interval (every 2 minutes)
      autoSaveIntervalRef.current = window.setInterval(async () => {
        try {
          if (currentDraftId || hasFormData()) {
            await saveAsDraft();
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          throw new Error(`Auto-save failed: ${errorMessage}`);
        }
      }, 2 * 60 * 1000); // 2 minutes
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [autoSaveEnabled, saveAsDraft, currentDraftId, hasFormData]);

  // Save on navigation
  useEffect(() => {
    const unsubscribe = router.history.subscribe(() => {
      // Only save draft when navigating away if there's meaningful data or updating existing draft
      if (formDataRef.current && (currentDraftId || hasFormData())) {
        saveAsDraft().catch((error) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          throw new Error(`Auto-save failed: ${errorMessage}`);
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router.history, saveAsDraft, currentDraftId, hasFormData]);

  // Handle beforeunload event to save draft when closing the browser
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only attempt to save if there's an existing draft ID
      // This prevents creating new empty drafts on page load/unload cycles
      if (formDataRef.current && currentDraftId) {
        // Synchronous save attempt for beforeunload
        try {
          const formData = formDataRef.current;
          const draftData = {
            content: formData,
            metadata: {
              currentStep: methods.current.id,
              lastEditedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
          updateDraftInStorage(currentDraftId, draftData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          throw new Error(`Failed to save draft on beforeunload: ${errorMessage}`);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentDraftId, methods, methods.current.id]);

  // Check for a draft to resume on component mount
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resume_draft_id');
    if (resumeDraftId) {
      // Clear the session storage to avoid loading the draft again on refresh
      sessionStorage.removeItem('resume_draft_id');
      
      try {
        // Import the getDraftById function from the drafts feature
        const draft = getDraftById(resumeDraftId);
        
        if (draft && draft.type === 'proposal') {
          // Set the current draft ID
          setCurrentDraftId(resumeDraftId);
          
          // Get the saved form data from the draft
          const formData = draft.content as ParcelInsuranceProposal;
          
          // Reset the form with the draft data
          form.reset(formData);
          
          // Navigate to the last active step
          const lastStep = draft.metadata.currentStep as string;
          // Check if the step ID is valid
          if (lastStep && methods.all.some(step => step.id === lastStep)) {
            // Type assertion to ensure type safety
            const validStepId = lastStep as "policyholderInfo" | "parcelDetails" | "shippingCoverage" | "premiumCalculation" | "documentsConsent";
            methods.goTo(validStepId);
          }
          
          // Show a toast notification
          toast.success('Draft loaded successfully', {
            description: `Resuming from where you left off.`
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load draft: ${errorMessage}`);
      }
    }
  }, [form, methods]);

  // Generate proposal number when reaching the premium calculation step
  useEffect(() => {
    if (methods.current.id === 'premiumCalculation') {
      const nrcNumber = form.getValues('policyholderInfo.nrcNumber');
      if (nrcNumber && !form.getValues('premiumCalculation.proposalNo')) {
        const proposalNo = generateProposalNumber(nrcNumber);
        form.setValue('premiumCalculation.proposalNo', proposalNo);
      }
    }
    
    // Update formDataRef whenever the step changes
    formDataRef.current = form.getValues();
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
      <form onSubmit={onSubmit} className='space-y-6'>
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

        <div className='bg-card p-6 rounded-lg border shadow-sm w-full'>
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
          <div className='flex gap-2'>
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
              variant='outline'
              onClick={async () => {
                try {
                  const draftId = await saveAsDraft();
                  toast.success(
                    lastSaved ? 'Draft updated successfully' : 'Draft saved successfully', 
                    { 
                      description: `Draft ID: ${draftId}`,
                      closeButton: true,
                      duration: 80000,
                      position: 'top-right'
                    }
                  );
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                  toast.error(`Failed to load draft: ${errorMessage}`);
                }
              }}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </div>
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
