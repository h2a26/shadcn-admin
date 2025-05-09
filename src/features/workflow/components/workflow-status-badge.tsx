import { formatDistanceToNow } from 'date-fns'
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRightCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'

interface WorkflowStatusBadgeProps {
  workflowTaskId?: string
  currentStep?: string
}

export function WorkflowStatusBadge({
  workflowTaskId,
  currentStep,
}: WorkflowStatusBadgeProps) {
  const { getTaskById, config } = useWorkflow()

  if (!workflowTaskId || !currentStep) {
    return (
      <Badge variant='outline' className='gap-1'>
        <HelpCircle className='h-3 w-3' />
        <span>No Workflow</span>
      </Badge>
    )
  }

  const task = getTaskById(workflowTaskId)

  if (!task) {
    return (
      <Badge variant='outline' className='gap-1'>
        <AlertCircle className='h-3 w-3' />
        <span>Task Not Found</span>
      </Badge>
    )
  }

  // Get step configuration
  const stepConfig = config?.steps.find(
    (s: { name: string }) => s.name.toLowerCase() === task.currentStep
  )

  // Determine badge variant based on step
  const getBadgeVariant = () => {
    switch (task.currentStep) {
      case 'proposal':
        return 'default'
      case 'risk_review':
        return 'secondary'
      case 'approval':
        return 'outline'
      case 'completed':
        return 'secondary'
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Get appropriate icon based on step
  const getStepIcon = () => {
    switch (task.currentStep) {
      case 'proposal':
        return <Clock className='h-3 w-3' />
      case 'risk_review':
        return <ArrowRightCircle className='h-3 w-3' />
      case 'approval':
        return <ArrowRightCircle className='h-3 w-3' />
      case 'completed':
        return <CheckCircle2 className='h-3 w-3' />
      case 'rejected':
        return <AlertCircle className='h-3 w-3' />
      default:
        return <HelpCircle className='h-3 w-3' />
    }
  }

  // Format last updated time
  const lastUpdated =
    task.history.length > 0
      ? formatDistanceToNow(
          new Date(task.history[task.history.length - 1].timestamp),
          { addSuffix: true }
        )
      : 'Unknown'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getBadgeVariant()} className='cursor-help gap-1'>
            {getStepIcon()}
            <span>{stepConfig?.name || task.currentStep}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className='max-w-xs'>
          <div className='space-y-2 p-1'>
            <p className='font-medium'>Workflow Status</p>
            <div className='space-y-1 text-xs'>
              <p>
                <span className='font-medium'>Step:</span>{' '}
                {stepConfig?.name || task.currentStep}
              </p>
              <p>
                <span className='font-medium'>Assignee:</span> {task.assignedTo}
              </p>
              <p>
                <span className='font-medium'>Updated:</span> {lastUpdated}
              </p>
              {task.history.length > 0 &&
                task.history[task.history.length - 1].comments && (
                  <p>
                    <span className='font-medium'>Comments:</span>{' '}
                    {task.history[task.history.length - 1].comments}
                  </p>
                )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
