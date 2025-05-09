import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasPermission } from '@/features/users/config/roles'
import { useUsers } from '@/features/users/context/users-context'
import { useWorkflow } from '@/features/workflow/context/workflow-context.tsx'
import { WorkflowConfig } from '../data/schema'
import { TaskDetailsEnhanced } from './task-details-enhanced'
import { TaskList } from './task-list'

export function WorkflowDashboard() {
  const { tasks, config, refreshTasks } = useWorkflow()
  const { currentUser, users } = useUsers()
  const [activeTab, setActiveTab] = useState('assigned')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Get task ID from URL if present
  useEffect(() => {
    // In a real implementation, we would get the taskId from the URL
    // For now, we'll just use a dummy implementation
    const urlParams = new URLSearchParams(window.location.search)
    const taskId = urlParams.get('taskId')
    if (taskId) {
      setSelectedTaskId(taskId)
    }
  }, [])

  // Refresh tasks when component mounts
  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => {
    if (!currentUser) return false

    switch (activeTab) {
      case 'assigned':
        return task.assignedTo === currentUser.id
      case 'created':
        return task.assignedBy === currentUser.id
      case 'all':
        return hasPermission(currentUser.role, 'workflow.view')
      default:
        return false
    }
  })

  // Get workflow statistics
  const getWorkflowStats = (config: WorkflowConfig | null) => {
    if (!config) return []

    return config.steps.map((step) => {
      const tasksInStep = tasks.filter((task) => task.currentStep === step.name)
      return {
        name: step.name,
        count: tasksInStep.length,
        roles: step.roles.join(', '),
      }
    })
  }

  const workflowStats = getWorkflowStats(config)

  return (
    <div className='space-y-8'>
      {/* Show task details if a task is selected */}
      {selectedTaskId && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskDetailsEnhanced
              taskId={selectedTaskId}
              onBack={() => setSelectedTaskId(null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Workflow Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {workflowStats.map((stat) => (
              <Card key={stat.name} className='bg-muted/50'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium capitalize'>
                    {stat.name.replace('_', ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.count}</div>
                  <p className='text-muted-foreground text-xs'>
                    Assigned to: {stat.roles}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
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
              <TaskList
                tasks={filteredTasks}
                users={users}
                currentUserRole={currentUser?.role || ''}
                currentUserId={currentUser?.id || ''}
                onTaskUpdated={() => refreshTasks()}
                onTaskSelected={(taskId) => setSelectedTaskId(taskId)}
              />
            </TabsContent>

            <TabsContent value='created' className='space-y-4'>
              <TaskList
                tasks={filteredTasks}
                users={users}
                currentUserRole={currentUser?.role || ''}
                currentUserId={currentUser?.id || ''}
                onTaskUpdated={() => refreshTasks()}
                onTaskSelected={(taskId) => setSelectedTaskId(taskId)}
              />
            </TabsContent>

            {currentUser &&
              hasPermission(currentUser.role, 'workflow.view') && (
                <TabsContent value='all' className='space-y-4'>
                  <TaskList
                    tasks={filteredTasks}
                    users={users}
                    currentUserRole={currentUser.role}
                    currentUserId={currentUser.id}
                    onTaskUpdated={() => refreshTasks()}
                    onTaskSelected={(taskId) => setSelectedTaskId(taskId)}
                  />
                </TabsContent>
              )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
