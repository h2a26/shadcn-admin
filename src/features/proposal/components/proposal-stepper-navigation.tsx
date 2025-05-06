import React from 'react';

interface StepperNavigationProps {
  steps: Array<{
    id: string;
    title: string;
  }>;
  currentStepId: string;
  onStepClick: (stepId: string) => void;
  StepperNavigation: React.ComponentType<React.PropsWithChildren<{ className?: string }>>;
  StepperStep: React.ComponentType<React.PropsWithChildren<{
    of: string;
    disabled?: boolean;
    onClick?: () => void
  }>>;
  StepperTitle: React.ComponentType<React.PropsWithChildren<object>>;
}

export function ProposalStepperNavigation({
                                            steps,
                                            currentStepId,
                                            onStepClick,
                                            StepperNavigation,
                                            StepperStep,
                                            StepperTitle
                                          }: StepperNavigationProps): React.ReactElement {
  return (
    <StepperNavigation className="mb-8">
      {steps.map((step) => (
        <StepperStep
          key={step.id}
          of={step.id}
          disabled={
            steps.findIndex((s) => s.id === step.id) >
            steps.findIndex((s) => s.id === currentStepId)
          }
          onClick={() => {
            if (
              steps.findIndex((s) => s.id === step.id) <=
              steps.findIndex((s) => s.id === currentStepId)
            ) {
              onStepClick(step.id);
            }
          }}
        >
          <StepperTitle>{step.title}</StepperTitle>
        </StepperStep>
      ))}
    </StepperNavigation>
  );
}
