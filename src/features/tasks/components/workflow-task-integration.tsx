import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle, CheckCircle2, Clock, UserIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTasks } from '@/features/tasks/context/tasks-context'
import { Task } from '@/features/tasks/data/schema'
import { hasPermission } from '@/features/users/config/roles'
import { useUsers } from '@/features/users/context/users-context'
import { TaskList } from '@/features/workflow/components/task-list'
import { useWorkflow } from '@/features/workflow/context/workflow-context.tsx'
import { WorkflowTask } from '@/features/workflow/data/schema'

/**
 * WorkflowTaskIntegration component
 *
 * This component integrates workflow tasks with the regular task system
 * It displays workflow tasks assigned to the current user and allows for quick actions
 */
export function WorkflowTaskIntegration() {
  const { tasks: workflowTasks } = useWorkflow()
  const { setOpen, setCurrentRow } = useTasks()
  const { currentUser, users } = useUsers()
  const [activeTab, setActiveTab] = useState<
    'assigned' | 'created' | 'completed' | 'all'
  >('assigned')

  // Get icon for workflow step
  const getStepIcon = (step: string) => {
    const icons = {
      proposal: Clock,
      risk_review: AlertCircle,
      approval: CheckCircle2,
    }
    const Icon = icons[step as keyof typeof icons] || UserIcon
    return <Icon className='h-4 w-4' />
  }

  // Get badge variant for task status
  const getStatusBadgeVariant = (status: WorkflowTask['status']) => {
    const variants: Record<
      WorkflowTask['status'],
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      pending: 'default',
      in_progress: 'secondary',
      completed: 'outline',
      rejected: 'destructive',
      sent_back: 'destructive',
    }
    return variants[status] || 'outline'
  }

  // Map workflow task to task type
  const mapWorkflowToTask = (workflowTask: WorkflowTask): Task => ({
    id: workflowTask.id,
    title: `Workflow: ${workflowTask.currentStep}`,
    status: 'workflow' as const,
    label: `Proposal: ${workflowTask.proposalId?.substring(0, 8) || 'N/A'}`,
    priority: 'high',
    workflowTask,
  })

  // Handle task click
  const handleTaskClick = (task: WorkflowTask) => {
    if (!task.proposalId || !task.id || !currentUser) return

    const mappedTask = mapWorkflowToTask(task)
    setCurrentRow(mappedTask)
    setOpen('update')
  }

  // Filter tasks based on active tab with role-based permissions
  const filteredTasks = useMemo(() => {
    if (!currentUser || !workflowTasks) {
      return []
    }

    // Get user's workflow permissions
    const hasViewPermission = hasPermission(currentUser.role, 'workflow.view')
    const hasAssignPermission = hasPermission(
      currentUser.role,
      'workflow.assign'
    )
    const hasReassignPermission = hasPermission(
      currentUser.role,
      'workflow.reassign'
    )

    return workflowTasks.filter((task) => {
      switch (activeTab) {
        case 'assigned':
          return (
            hasAssignPermission &&
            task.assignedTo === currentUser.id &&
            task.status !== 'completed' &&
            task.status !== 'rejected'
          )
        case 'created':
          return (
            hasReassignPermission &&
            task.assignedBy === currentUser.id &&
            task.status !== 'completed' &&
            task.status !== 'rejected'
          )
        case 'completed':
          return (
            (task.assignedTo === currentUser.id ||
              task.assignedBy === currentUser.id) &&
            (task.status === 'completed' ||
              task.status === 'rejected' ||
              task.status === 'sent_back')
          )
        case 'all':
          return hasViewPermission
        default:
          return false
      }
    })
  }, [workflowTasks, currentUser, activeTab])

  // Check user permissions
  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground py-4 text-center text-sm'>
            Please log in to view workflow tasks
          </p>
        </CardContent>
      </Card>
    )
  }

  // Check workflow permissions
  const hasWorkflowPermissions = hasPermission(
    currentUser.role,
    'workflow.view'
  )

  if (!hasWorkflowPermissions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground py-4 text-center text-sm'>
            You don't have permission to view workflow tasks
          </p>
        </CardContent>
      </Card>
    )
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
          onValueChange={(value) => {
            setActiveTab(value as typeof activeTab)
          }}
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
            <TaskList
              tasks={filteredTasks}
              users={users}
              currentUserRole={currentUser?.role || ''}
              currentUserId={currentUser?.id || ''}
              onTaskUpdated={() => handleTaskClick(filteredTasks[0])}
              onTaskSelected={(taskId: string) => {
                const task = filteredTasks.find((t) => t.id === taskId)
                if (task) {
                  handleTaskClick(task)
                }
              }}
            />
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
                    <div>{getStepIcon(task.currentStep)}</div>
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
                        {task.updatedAt
                          ? formatDistanceToNow(new Date(task.updatedAt), {
                              addSuffix: true,
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value='completed' className='space-y-4'>
            {filteredTasks.length === 0 ? (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No completed workflow tasks
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className='hover:bg-accent flex cursor-pointer items-center justify-between rounded-md border p-3'
                  onClick={() => handleTaskClick(task)}
                >
                  <div className='flex items-center gap-2'>
                    <div>{getStepIcon(task.currentStep)}</div>
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
                        {task.updatedAt
                          ? formatDistanceToNow(new Date(task.updatedAt), {
                              addSuffix: true,
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {hasPermission(currentUser?.role, 'workflow.view') && (
            <TabsContent value='all' className='space-y-4'>
              {filteredTasks.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  No workflow tasks available
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
                          {formatDistanceToNow(new Date(task.updatedAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
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
