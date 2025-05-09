import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Task } from '@/features/tasks/types/task'
import { TaskDetailsEnhanced } from '@/features/workflow/components/task-details-enhanced'
import { useWorkflow } from '@/features/workflow/context/workflow-context'
import { useTasks } from '../context/tasks-context'

interface WorkflowTaskDetailsProps {
  open: boolean
  onClose: () => void
}

export function WorkflowTaskDetails({
  open,
  onClose,
}: WorkflowTaskDetailsProps) {
  const { currentRow } = useTasks()
  const task = currentRow as Task
  const { setCurrentTask } = useWorkflow()

  // Extract the workflow task from the task object
  const workflowTask = task?.workflowTask

  // When a workflow task is selected in the tasks context,
  // also set it as the current task in the workflow context
  useEffect(() => {
    if (workflowTask) {
      setCurrentTask(workflowTask)
    }

    // Clean up when dialog closes
    return () => {
      setCurrentTask(null)
    }
  }, [workflowTask, setCurrentTask])

  if (!workflowTask) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Workflow Task Details</DialogTitle>
          <DialogDescription>
            View and manage the workflow task
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <TaskDetailsEnhanced taskId={workflowTask.id} onBack={onClose} />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <a
              href={`/workflow?taskId=${workflowTask.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ArrowRight className='mr-2 h-4 w-4' />
              View in Workflow
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
