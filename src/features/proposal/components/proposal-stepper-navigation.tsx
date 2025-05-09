import React from 'react'
import { ProposalStepId } from '../data/schema'

interface StepperNavigationProps {
  steps: Array<{
    id: ProposalStepId
    title: string
  }>
  currentStepId: ProposalStepId
  onStepClick: (stepId: ProposalStepId) => void
  StepperNavigation: React.ComponentType<
    React.PropsWithChildren<{ className?: string }>
  >
  // Use any to allow for type conversion between string and ProposalStepId
  StepperStep: React.ComponentType<
    React.ComponentProps<'button'> & {
      of: ProposalStepId
      icon?: React.ReactNode
    }
  >
  StepperTitle: React.ComponentType<React.PropsWithChildren<object>>
}

export function ProposalStepperNavigation({
  steps,
  currentStepId,
  onStepClick,
  StepperNavigation,
  StepperStep,
  StepperTitle,
}: StepperNavigationProps): React.ReactElement {
  return (
    <StepperNavigation className='mb-8'>
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
              onStepClick(step.id as ProposalStepId)
            }
          }}
        >
          <StepperTitle>{step.title}</StepperTitle>
        </StepperStep>
      ))}
    </StepperNavigation>
  )
}
