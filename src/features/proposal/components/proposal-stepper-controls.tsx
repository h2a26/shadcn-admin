import { JSX } from 'react'
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

interface StepperControlsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onContinue: () => Promise<void>;
  onSaveDraft: () => Promise<string>;
}

/**
 * Component for rendering the stepper controls (previous, save, continue buttons)
 */
export function ProposalStepperControls({ 
  isFirstStep, 
  isLastStep, 
  onPrevious, 
  onContinue, 
  onSaveDraft 
}: StepperControlsProps): JSX.Element {
  return (
    <div className="flex justify-between mt-6">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            try {
              const draftId = await onSaveDraft();
              toast.success('Draft saved successfully', { 
                description: `Draft ID: ${draftId}`,
                closeButton: true,
                duration: 30000,
                position: 'top-right'
              });
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              throw new Error(`Failed to save draft: ${errorMessage}`)
            }
          }}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
      </div>
      <Button 
        type="button"
        onClick={onContinue}
      >
        {isLastStep ? 'Submit Proposal' : 'Continue'}
      </Button>
    </div>
  );
}
