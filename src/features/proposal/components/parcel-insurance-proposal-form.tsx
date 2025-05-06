import { Form } from '@/components/ui/form';
import { defineStepper } from '@/components/ui/stepper';
import { useEffect, useRef } from 'react';
import { PolicyholderInfoForm } from '@/features/proposal/components/policy-holder-info-form';
import { ParcelDetailsForm } from '@/features/proposal/components/parcel-details-form';
import { ShippingCoverageForm } from '@/features/proposal/components/shipping-coverage-form';
import { PremiumCalculationForm } from '@/features/proposal/components/premium-calculation-form';
import { DocumentsConsentForm } from '@/features/proposal/components/documents-consent-form';
import { stepperSchemas } from '@/features/proposal/schemas/form-schemas';
import { saveProposalToLocalStorage, generateProposalNumber } from '@/features/proposal';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { updateDraftInStorage } from '@/features/drafts/utils/storage-utils';
import { useProposalForm } from '../hooks/useProposalForm';
import { useDraftOperations } from '../hooks/useDraftOperations';
import { ProposalStepperNavigation } from './proposal-stepper-navigation';
import { ProposalStepperContent } from './proposal-stepper-content';
import { ProposalStepperControls } from './proposal-stepper-controls';

// Define the stepper configuration
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

  // Create ref outside of useEffect to avoid ESLint error
  const autoSaveIntervalRef = useRef<number | null>(null);

  // Use the custom hooks for form state and draft operations
  const {
    form,
    formDataRef,
    getCurrentFormData,
    hasFormData,
    validateStep
  } = useProposalForm();

  const {
    currentDraftId,
    saveAsDraft,
    loadDraft,
  } = useDraftOperations(
    form,
    getCurrentFormData,
    hasFormData,
    (stepId) => methods.goTo(stepId as never)
  );

  // Check for a draft to resume on component mount
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resume_draft_id');
    if (!resumeDraftId) return;

    // Clear the session storage to avoid loading the draft again on refresh
    sessionStorage.removeItem('resume_draft_id');

    // Load the draft
    loadDraft(resumeDraftId);
  }, [loadDraft]);

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
  }, [methods.current.id, form, methods, formDataRef]);

  // Auto-save functionality
  useEffect(() => {
    // Set up auto-save interval (every 2 minutes)
    autoSaveIntervalRef.current = window.setInterval(async () => {
      try {
        if (currentDraftId || hasFormData()) {
          await saveAsDraft(methods.current.id);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Auto-save failed: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      if (autoSaveIntervalRef.current !== null) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [saveAsDraft, currentDraftId, hasFormData, methods.current.id, methods]);

  // Save on navigation
  useEffect(() => {
    const handleNavigation = async () => {
      const hasDraftData = formDataRef.current && (currentDraftId || hasFormData());
      if (!hasDraftData) return;

      try {
        const draftId = await saveAsDraft(methods.current.id);
        toast.success('Draft saved successfully', {
          description: `Draft ID: ${draftId}`,
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Auto-save failed: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        });
      }
    };

    const unsubscribe = router.history.subscribe(handleNavigation);

    return () => {
      unsubscribe();
    };
  }, [router.history, saveAsDraft, currentDraftId, hasFormData, methods.current.id, formDataRef, methods]);

  // Handle beforeunload event to save draft when closing the browser
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only attempt to save if there's an existing draft ID
      if (formDataRef.current && currentDraftId) {
        try {
          // Create a minimal update with just the essential data
          const updateData = {
            content: formDataRef.current,
            metadata: {
              currentStep: methods.current.id,
              lastEditedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };

          // Use the storage utility directly for this synchronous operation
          updateDraftInStorage(currentDraftId, updateData);
        } catch {
          // Cannot show errors during beforeunload
          // Silent failure is acceptable here
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentDraftId, methods.current.id, formDataRef, methods]);

  // Define a properly typed submit handler
  const onSubmit = form.handleSubmit((data) => {
    try {
      if (methods.isLast) {
        // Save the proposal to local storage
        const proposalId = saveProposalToLocalStorage(data);

        toast.success('Proposal submitted successfully!', {
          description: `Proposal ID: ${proposalId}`,
          closeButton: true,
          duration: 30000,
          position: 'top-right'
        });

        // Reset the form and go back to the first step
        form.reset();
        methods.reset();
      } else {
        // Move to the next step
        methods.next();
      }
    } catch (error: unknown) {
      // In a production environment, implement proper error handling and logging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`There was an error submitting your proposal: ${errorMessage}`, {
        closeButton: true,
        duration: 30000,
        position: 'top-right'
      });
    }
  });

  // Handle continue button click
  const handleContinue = async () => {
    // If it's the last step, submit the form
    if (methods.isLast) {
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
        const isValid = await validateStep(currentStepId as never);
        if (isValid) {
          methods.next();
        }
        // If validation fails, form errors will be displayed automatically
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Stepper Navigation */}
        <ProposalStepperNavigation
          steps={methods.all}
          currentStepId={methods.current.id}
          onStepClick={(stepId) => methods.goTo(stepId as never)}
          StepperNavigation={Stepper.Navigation}
          StepperStep={Stepper.Step as never}
          StepperTitle={Stepper.Title}
        />

        {/* Current Step Content */}
        <ProposalStepperContent
          currentStep={methods.current}
          getStepDescription={(stepId) => {
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
          }}
        />

        {/* Stepper Controls */}
        <ProposalStepperControls
          isFirstStep={methods.isFirst}
          isLastStep={methods.isLast}
          onPrevious={methods.prev}
          onContinue={handleContinue}
          onSaveDraft={() => saveAsDraft(methods.current.id)}
        />
      </form>
    </Form>
  );
};
