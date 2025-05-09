import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/features/users/data/schema'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'
import { WorkflowTask, StepConfig, WorkflowStep } from '../data/schema'
import {
  getAvailableNextSteps,
  canPerformAction,
  transitionTask,
  sendBackTask,
  getStepConfig,
} from '../utils/engine'
import { AssigneeSelector } from './assignee-selector'

interface StepTransitionProps {
  task: WorkflowTask
  currentUserRole: string
  currentUserId: string
  users: User[]
  onComplete: () => void
}

export function StepTransition({
  task,
  currentUserRole,
  currentUserId,
  users,
  onComplete,
}: StepTransitionProps) {
  const { config } = useWorkflow()
  const [selectedNextStep, setSelectedNextStep] = useState<WorkflowStep | ''>(
    ''
  )
  const [selectedAssignee, setSelectedAssignee] = useState<string>('')
  const [comments, setComments] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleSelectNextStep = (stepId: WorkflowStep) => {
    if (stepId) {
      setSelectedNextStep(stepId)
    }
  }

  const handleSelectAssignee = (userId: string) => {
    setSelectedAssignee(userId)
  }

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }

  const handleTransition = () => {
    if (!selectedNextStep || !selectedAssignee) {
      toast.error('Please select a next step and assignee')
      return
    }

    if (!config) {
      toast.error('Workflow configuration not loaded')
      return
    }

    try {
      setIsLoading(true)
      setError(undefined)

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig) {
        throw new Error('Current step not found in workflow configuration')
      }

      if (!stepConfig.nextSteps.includes(selectedNextStep)) {
        throw new Error('Selected next step is not valid for this step')
      }

      const updatedTask = selectedNextStep
        ? transitionTask(
            task,
            selectedNextStep,
            selectedAssignee,
            currentUserId,
            comments
          )
        : null

      if (updatedTask) {
        toast.success('Task transitioned successfully')
        onComplete()
      } else if (selectedNextStep) {
        throw new Error('Failed to transition task')
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to transition task')
      toast.error(error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendBack = () => {
    if (!previousStep || !comments) {
      toast.error('Please add comments for sending back')
      return
    }

    if (!config) {
      toast.error('Workflow configuration not loaded')
      return
    }

    try {
      setIsLoading(true)
      setError(undefined)

      const stepConfig = getStepConfig(config, task.currentStep)
      if (!stepConfig) {
        throw new Error('Current step not found in workflow configuration')
      }

      if (!stepConfig.allowSendBack) {
        throw new Error('Sending back is not allowed for this step')
      }

      const updatedTask = sendBackTask(
        task,
        previousStep,
        selectedAssignee,
        currentUserId,
        comments
      )

      if (updatedTask) {
        toast.success('Task sent back successfully')
        onComplete()
      } else {
        throw new Error('Failed to send task back')
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to send task back')
      toast.error(error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSteps = useMemo<StepConfig[]>(() => {
    if (!config) return []
    return getAvailableNextSteps(config, task.currentStep)
  }, [config, task.currentStep])

  // Check if send-back is allowed for this step
  const canSendBack = useMemo<boolean>(() => {
    if (!config) return false
    return canPerformAction(
      config,
      task.currentStep,
      'sendBack',
      currentUserRole
    )
  }, [config, task.currentStep, currentUserRole])

  // Get previous step from task history for send-back
  const previousStep = useMemo<WorkflowStep | undefined>(() => {
    if (!task.history || task.history.length < 2) return undefined
    const sortedHistory = [...task.history].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    return sortedHistory[1]?.step as WorkflowStep
  }, [task.history])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transition Task</CardTitle>
        <CardDescription>
          Move this task to the next step in the workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Next Step</label>
            <Select
              value={selectedNextStep}
              onValueChange={handleSelectNextStep}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select next step' />
              </SelectTrigger>
              <SelectContent>
                {nextSteps.map((step) => (
                  <SelectItem key={step.name} value={step.name}>
                    {step.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='block text-sm font-medium'>Assignee</label>
            <AssigneeSelector
              currentStep={task.currentStep}
              currentUserRole={currentUserRole}
              users={users}
              onAssigneeSelected={handleSelectAssignee}
              defaultValue={selectedAssignee}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Comments</label>
            <Textarea
              value={comments}
              onChange={handleCommentsChange}
              placeholder='Add any comments about the transition...'
              className='mt-2'
              disabled={isLoading}
            />
          </div>

          {error && <div className='mt-2 text-sm text-red-600'>{error}</div>}

          <div className='mt-4 flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={handleSendBack}
              disabled={!canSendBack || !previousStep || !comments || isLoading}
            >
              Send Back
            </Button>
            <Button
              onClick={handleTransition}
              disabled={!selectedNextStep || !selectedAssignee || isLoading}
            >
              Transition
            </Button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium'>Next Step</label>
              <Select
                value={selectedNextStep}
                onValueChange={handleSelectNextStep}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select next step' />
                </SelectTrigger>
                <SelectContent>
                  {nextSteps.map((step) => (
                    <SelectItem key={step.name} value={step.name}>
                      {step.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium'>Assignee</label>
              <AssigneeSelector
                currentStep={task.currentStep}
                currentUserRole={currentUserRole}
                users={users}
                onAssigneeSelected={handleSelectAssignee}
                defaultValue={selectedAssignee}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>Comments</label>
              <Textarea
                value={comments}
                onChange={handleCommentsChange}
                placeholder='Add any comments about the transition...'
                className='mt-2'
                disabled={isLoading}
              />
            </div>

            {error && <div className='mt-2 text-sm text-red-600'>{error}</div>}

            {canSendBack && previousStep && (
              <div className='mt-4'>
                <Button
                  variant='outline'
                  onClick={handleSendBack}
                  disabled={!comments || isLoading}
                >
                  Send Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onComplete} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleTransition}
          disabled={!selectedNextStep || !selectedAssignee || isLoading}
        >
          {isLoading ? 'Transitioning...' : 'Transition'}
        </Button>
      </CardFooter>
    </Card>
  )
}
