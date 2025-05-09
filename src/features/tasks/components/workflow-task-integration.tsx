import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRightCircle,
  User as UserIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTasks } from '@/features/tasks/context/tasks-context'
import { Task, TaskStatus } from '@/features/tasks/types/task'
import { hasPermission } from '@/features/users/config/roles'
import { useUsers } from '@/features/users/context/users-context'
import { WorkflowTask } from '@/features/workflow/data/schema'
import { useWorkflow } from '@/features/workflow/hooks/use-workflow.ts'

/**
 * WorkflowTaskIntegration component
 *
 * This component integrates workflow tasks with the regular task system
 * It displays workflow tasks assigned to the current user and allows for quick actions
 */
export function WorkflowTaskIntegration() {
  const { tasks } = useWorkflow()
  const { setOpen: setTasksOpen, setCurrentRow } = useTasks()
  const { currentUser, users } = useUsers()
  const [activeTab, setActiveTab] = useState('assigned')
  const [filteredTasks, setFilteredTasks] = useState<WorkflowTask[]>([])

  // Filter tasks based on active tab
  useEffect(() => {
    if (!currentUser) {
      setFilteredTasks([])
      return
    }

    if (activeTab === 'assigned') {
      // Tasks assigned to current user
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.assignedTo === currentUser.id &&
            task.status !== 'completed' &&
            task.status !== 'rejected'
        )
      )
    } else if (activeTab === 'created') {
      // Tasks created by current user
      setFilteredTasks(
        tasks.filter((task) => task.assignedBy === currentUser.id)
      )
    } else if (
      activeTab === 'all' &&
      hasPermission(currentUser.role, 'workflow.view')
    ) {
      // All tasks (for users with permission)
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks([])
    }
  }, [tasks, activeTab, currentUser])

  // Get username from ID
  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : userId
  }

  // Get appropriate icon based on step
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'proposal':
        return <Clock className='h-4 w-4' />
      case 'risk_review':
        return <ArrowRightCircle className='h-4 w-4' />
      case 'approval':
        return <ArrowRightCircle className='h-4 w-4' />
      case 'completed':
        return <CheckCircle2 className='h-4 w-4' />
      case 'rejected':
        return <AlertCircle className='h-4 w-4' />
      default:
        return <Clock className='h-4 w-4' />
    }
  }

  // Get badge variant based on status
  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'pending':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'completed':
        return 'outline'
      case 'rejected':
        return 'destructive'
      case 'sent_back':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Handle task click
  const handleTaskClick = (task: WorkflowTask) => {
    // Set the current task in the tasks context
    setCurrentRow({
      id: task.id,
      title: `Workflow: ${task.currentStep}`,
      status: task.status as TaskStatus,
      label: `Proposal: ${task.proposalId.substring(0, 8)}...`,
      priority: 'high',
      workflowTask: task,
    } as Task)

    // Open the task details dialog
    setTasksOpen('update')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue='assigned'
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className='mb-4'>
            <TabsTrigger value='assigned'>Assigned to Me</TabsTrigger>
            <TabsTrigger value='created'>Created by Me</TabsTrigger>
            {currentUser &&
              hasPermission(currentUser.role, 'workflow.view') && (
                <TabsTrigger value='all'>All Tasks</TabsTrigger>
              )}
          </TabsList>

          <TabsContent value='assigned' className='space-y-4'>
            {filteredTasks.length === 0 ? (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No workflow tasks assigned to you
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className='hover:bg-accent flex cursor-pointer items-center justify-between rounded-md border p-3'
                  onClick={() => handleTaskClick(task)}
                >
                  <div className='flex items-center gap-2'>
                    {getStepIcon(task.currentStep)}
                    <div>
                      <p className='text-sm font-medium'>
                        {task.currentStep.charAt(0).toUpperCase() +
                          task.currentStep.slice(1).replace('_', ' ')}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Proposal ID: {task.proposalId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                    <div className='text-right text-xs'>
                      <p className='text-muted-foreground'>Updated</p>
                      <p>
                        {formatDistanceToNow(task.updatedAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value='created' className='space-y-4'>
            {filteredTasks.length === 0 ? (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No workflow tasks created by you
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className='hover:bg-accent flex cursor-pointer items-center justify-between rounded-md border p-3'
                  onClick={() => handleTaskClick(task)}
                >
                  <div className='flex items-center gap-2'>
                    {getStepIcon(task.currentStep)}
                    <div>
                      <p className='text-sm font-medium'>
                        {task.currentStep.charAt(0).toUpperCase() +
                          task.currentStep.slice(1).replace('_', ' ')}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Proposal ID: {task.proposalId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <UserIcon className='text-muted-foreground h-3 w-3' />
                      <span className='text-xs'>
                        {getUserName(task.assignedTo)}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {currentUser && hasPermission(currentUser.role, 'workflow.view') && (
            <TabsContent value='all' className='space-y-4'>
              {filteredTasks.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  No workflow tasks found
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className='hover:bg-accent flex cursor-pointer items-center justify-between rounded-md border p-3'
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className='flex items-center gap-2'>
                      {getStepIcon(task.currentStep)}
                      <div>
                        <p className='text-sm font-medium'>
                          {task.currentStep.charAt(0).toUpperCase() +
                            task.currentStep.slice(1).replace('_', ' ')}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Proposal ID: {task.proposalId.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <UserIcon className='text-muted-foreground h-3 w-3' />
                        <span className='text-xs'>
                          {getUserName(task.assignedTo)}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
