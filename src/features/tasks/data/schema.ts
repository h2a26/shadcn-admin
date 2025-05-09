import { z } from 'zod'

// We're keeping a simple non-relational data here.
// IRL, you will have a data for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum([
    'pending',
    'in_progress',
    'completed',
    'rejected',
    'sent_back',
    'workflow',
  ]),
  label: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>
