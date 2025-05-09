import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkflowTask, WorkflowHistoryEntry } from '../data/schema'

interface TaskHistoryProps {
  task: WorkflowTask
  users: Array<{ id: string; firstName: string; lastName: string }>
}

export function TaskHistory({ task, users }: TaskHistoryProps) {
  // Sort history entries by timestamp (newest first)
  const sortedHistory = task.history.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // Helper function to get user name from ID
  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : userId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {sortedHistory.map((entry, index) => (
            <HistoryEntry
              key={`${entry.step}-${index}`}
              entry={entry}
              getUserName={getUserName}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HistoryEntryProps {
  entry: WorkflowHistoryEntry
  getUserName: (userId: string) => string
}

function HistoryEntry({ entry, getUserName }: HistoryEntryProps) {
  return (
    <div className='border-primary border-l-2 py-2 pl-4'>
      <div className='flex items-start justify-between'>
        <div>
          <h4 className='font-medium capitalize'>{entry.step}</h4>
          <p className='text-muted-foreground text-sm'>
            Assigned to: {getUserName(entry.assignedTo)}
          </p>
          <p className='text-muted-foreground text-sm'>
            By: {getUserName(entry.assignedBy)}
          </p>
        </div>
        <div className='text-muted-foreground text-sm'>
          {format(entry.timestamp, 'PPpp')}
        </div>
      </div>
      {entry.comments && (
        <div className='bg-muted mt-2 rounded-md p-2 text-sm'>
          {entry.comments}
        </div>
      )}
    </div>
  )
}
