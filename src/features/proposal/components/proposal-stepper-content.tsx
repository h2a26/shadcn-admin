import React, { JSX } from 'react'

interface StepperContentProps {
  currentStep: {
    id: string;
    title: string;
    Component: React.ComponentType;
  };
  getStepDescription: (stepId: string) => string;
}

export function ProposalStepperContent({ 
  currentStep,
  getStepDescription
}: StepperContentProps): JSX.Element {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{currentStep.title}</h2>
        <p className="text-sm text-muted-foreground">
          {getStepDescription(currentStep.id)}
        </p>
      </div>

      <currentStep.Component />
    </div>
  );
}
