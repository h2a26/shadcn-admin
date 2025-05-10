import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Form } from '@/components/ui/form'
import { defineStepper } from '@/components/ui/stepper'
import { updateDraftInStorage } from '@/features/drafts/utils/storage-utils'
import { DocumentsConsentForm } from '@/features/proposal/components/documents-consent-form'
import { ParcelDetailsForm } from '@/features/proposal/components/parcel-details-form'
import { PolicyholderInfoForm } from '@/features/proposal/components/policy-holder-info-form'
import { PremiumCalculationForm } from '@/features/proposal/components/premium-calculation-form'
import { ProposalStepperContent } from '@/features/proposal/components/proposal-stepper-content'
import { ProposalStepperControls } from '@/features/proposal/components/proposal-stepper-controls'
import { ProposalStepperNavigation } from '@/features/proposal/components/proposal-stepper-navigation'
import { ProposalWorkflowStatus } from '@/features/proposal/components/proposal-workflow-status'
import { ShippingCoverageForm } from '@/features/proposal/components/shipping-coverage-form'
import { WorkflowSubmitForm } from '@/features/proposal/components/workflow-submit-form'
import { useProposal } from '@/features/proposal/context/proposal-context'
import {
  policyholderInfoSchema,
  parcelDetailsSchema,
  shippingCoverageSchema,
  premiumCalculationSchema,
  documentsConsentSchema,
  workflowSubmitSchema,
  ProposalStepId,
} from '@/features/proposal/data/schema'
import { useDraftOperations } from '@/features/proposal/hooks/use-draft-operations'
import { useProposalForm } from '@/features/proposal/hooks/use-proposal-form'
import {
  generateProposalNumber,
  saveProposalToLocalStorage,
} from '@/features/proposal/utils'
import { getStepDescription } from '@/features/proposal/utils/stepper-utils'

// Create the stepper with the proposal steps
const { Stepper, useStepper } = defineStepper(
  {
    id: 'policyholderInfo' as ProposalStepId,
    title: 'Policyholder Info',
    schema: policyholderInfoSchema,
    Component: PolicyholderInfoForm,
  },
  {
    id: 'parcelDetails' as ProposalStepId,
    title: 'Parcel Details',
    schema: parcelDetailsSchema,
    Component: ParcelDetailsForm,
  },
  {
    id: 'shippingCoverage' as ProposalStepId,
    title: 'Shipping & Coverage',
    schema: shippingCoverageSchema,
    Component: ShippingCoverageForm,
  },
  {
    id: 'premiumCalculation' as ProposalStepId,
    title: 'Premium Calculation',
    schema: premiumCalculationSchema,
    Component: PremiumCalculationForm,
  },
  {
    id: 'documentsConsent' as ProposalStepId,
    title: 'Documents & Consent',
    schema: documentsConsentSchema,
    Component: DocumentsConsentForm,
  },
  {
    id: 'workflowSubmit' as ProposalStepId,
    title: 'Workflow Submission',
    schema: workflowSubmitSchema,
    Component: WorkflowSubmitForm,
  }
)

export function ParcelInsuranceProposalForm() {
  return (
    <Stepper.Provider>
      <FormStepperComponent />
    </Stepper.Provider>
  )
}

const FormStepperComponent = () => {
  const methods = useStepper()
  const router = useRouter()

  const autoSaveIntervalRef = useRef<number | null>(null)

  const { form, formDataRef, getCurrentFormData, hasFormData, validateStep } =
    useProposalForm()

  const { currentDraftId, saveAsDraft, loadDraft } = useDraftOperations(
    form,
    getCurrentFormData,
    hasFormData,
    (stepId) => methods.goTo(stepId as ProposalStepId)
  )

  // Check for a draft to resume on component mount
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resume_draft_id')
    if (!resumeDraftId) return

    // Clear the session storage to avoid loading the draft again on refresh
    sessionStorage.removeItem('resume_draft_id')

    // Load the draft
    ;(async () => {
      await loadDraft(resumeDraftId)
    })()
  }, [loadDraft])

  // Generate proposal number when reaching the premium calculation step
  useEffect(() => {
    if (methods.current.id === 'premiumCalculation') {
      const nrcNumber = form.getValues('policyholderInfo.nrcNumber')
      if (nrcNumber && !form.getValues('premiumCalculation.proposalNo')) {
        const proposalNo = generateProposalNumber(nrcNumber)
        form.setValue('premiumCalculation.proposalNo', proposalNo)
      }
    }

    // Update formDataRef whenever the step changes
    formDataRef.current = form.getValues()
  }, [methods.current.id, form, methods, formDataRef])

  // Auto-save functionality
  useEffect(() => {
    // Set up auto-save interval (every 2 minutes)
    autoSaveIntervalRef.current = window.setInterval(
      async () => {
        try {
          if (currentDraftId || hasFormData()) {
            await saveAsDraft(methods.current.id as ProposalStepId)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          toast.error(`Auto-save failed: ${errorMessage}`, {
            closeButton: true,
            duration: 30000,
            position: 'top-right',
          })
        }
      },
      2 * 60 * 1000
    ) // 2 minutes

    return () => {
      if (autoSaveIntervalRef.current !== null) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [saveAsDraft, currentDraftId, hasFormData, methods.current.id, methods])

  // Save on navigation
  useEffect(() => {
    const handleNavigation = async () => {
      const hasDraftData =
        formDataRef.current && (currentDraftId || hasFormData())
      if (!hasDraftData) return

      try {
        const draftId = await saveAsDraft(methods.current.id as ProposalStepId)
        toast.success('Draft saved successfully', {
          description: `Draft ID: ${draftId}`,
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Auto-save failed: ${errorMessage}`, {
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        })
      }
    }

    const unsubscribe = router.history.subscribe(handleNavigation)

    return () => {
      unsubscribe()
    }
  }, [
    router.history,
    saveAsDraft,
    currentDraftId,
    hasFormData,
    methods.current.id,
    formDataRef,
    methods,
  ])

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
          }

          // Use the storage utility directly for this synchronous operation
          updateDraftInStorage(currentDraftId, updateData)
        } catch {
          // Cannot show errors during beforeunload
          // Silent failure is acceptable here
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentDraftId, methods.current.id, formDataRef, methods])

  // The workflow context and user data are now defined above

  // Define a properly typed submit handler
  const onSubmit = form.handleSubmit((data) => {
    try {
      if (methods.isLast) {
        // Save the proposal to local storage
        const proposalId = saveProposalToLocalStorage(data)

        toast.success('Proposal submitted successfully!', {
          description: `Proposal ID: ${proposalId}`,
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        })

        // Reset the form and go back to the first step
        form.reset()
        methods.reset()
      } else {
        // Move to the next step
        methods.next()
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      toast.error(
        `There was an error submitting your proposal: ${errorMessage}`,
        {
          closeButton: true,
          duration: 30000,
          position: 'top-right',
        }
      )
    }
  })

  // Handle continue button click
  const handleContinue = async () => {
    // If it's the last step, submit the form
    if (methods.isLast) {
      await onSubmit()
    } else {
      const currentStepId = methods.current.id

      // Special handling for step 4 (Premium Calculation) to step 5 (Documents & Consent)
      if (currentStepId === 'premiumCalculation') {
        // For Premium Calculation step, just proceed to the next step
        // since all fields are calculated automatically
        methods.next()
      } else {
        // For other steps, validate normally
        const isValid = await validateStep(currentStepId as ProposalStepId)

        // If validation fails, show errors
        if (!isValid) {
          // Get all errors for the current step
          const errors = form.formState.errors
          const stepErrors = errors[currentStepId as keyof typeof errors]

          if (stepErrors) {
            // Show a toast with validation errors
            toast.error('Please fix the errors before continuing', {
              description: 'There are validation errors in the form',
              closeButton: true,
              duration: 30000,
              position: 'top-right',
            })
          }
        } else {
          methods.next()
        }
      }
    }
  }

  const { currentProposal } = useProposal()

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='space-y-6'>
        {/* Stepper Navigation */}
        <ProposalStepperNavigation
          steps={methods.all}
          currentStepId={methods.current.id}
          onStepClick={(stepId) => methods.goTo(stepId as ProposalStepId)}
          StepperNavigation={Stepper.Navigation}
          StepperStep={Stepper.Step}
          StepperTitle={Stepper.Title}
        />

        {/* Workflow Status */}
        {currentProposal?.workflowTaskId && (
          <ProposalWorkflowStatus
            proposal={{
              ...currentProposal,
              workflowTaskId: currentProposal.workflowTaskId,
              proposalId: currentProposal.id,
            }}
          />
        )}

        {/* Stepper Content */}
        <ProposalStepperContent
          currentStep={methods.current}
          getStepDescription={getStepDescription}
        />

        {/* Stepper Controls */}
        <ProposalStepperControls
          isFirstStep={methods.isFirst}
          isLastStep={methods.isLast}
          onPrevious={methods.prev}
          onContinue={handleContinue}
          onSaveDraft={() => saveAsDraft(methods.current.id as ProposalStepId)}
        />
      </form>
    </Form>
  )
}
