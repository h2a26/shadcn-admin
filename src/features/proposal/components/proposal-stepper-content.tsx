import React, { JSX } from 'react'

interface StepperContentProps {
  currentStep: {
    id: string
    title: string
    Component: React.ComponentType
  }
  getStepDescription: (stepId: string) => string
}

export function ProposalStepperContent({
  currentStep,
  getStepDescription,
}: StepperContentProps): JSX.Element {
  return (
    <div className='bg-card w-full rounded-lg border p-6 shadow-sm'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold'>{currentStep.title}</h2>
        <p className='text-muted-foreground text-sm'>
          {getStepDescription(currentStep.id)}
        </p>
      </div>

      <currentStep.Component />
    </div>
  )
}
