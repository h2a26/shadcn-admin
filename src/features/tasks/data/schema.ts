import { z } from 'zod'

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
  workflowTask: z
    .object({
      id: z.string(),
      proposalId: z.string(),
      currentStep: z.string(),
      assignedTo: z.string(),
      assignedBy: z.string(),
      status: z.enum([
        'pending',
        'in_progress',
        'completed',
        'rejected',
        'sent_back',
      ]),
      history: z.array(
        z.object({
          assignedTo: z.string(),
          assignedBy: z.string(),
          step: z.string(),
          timestamp: z.string(),
          comments: z.string().optional(),
        })
      ),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .optional(),
})

export type Task = z.infer<typeof taskSchema>
