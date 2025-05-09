import { Task } from '../types/task'

export interface TasksDialogsProps {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Task | null
  setCurrentRow: (task: Task | null) => void
}
