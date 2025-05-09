import { z } from 'zod'

// Define the workflow step types
export const workflowStepSchema = z.enum([
  'proposal',
  'risk_review',
  'approval',
])
export type WorkflowStep = z.infer<typeof workflowStepSchema>

// Define the role types that can be used in workflows
export const workflowRoleSchema = z.enum([
  'underwriter',
  'risk_reviewer',
  'approver',
])
export type WorkflowRole = z.infer<typeof workflowRoleSchema>

// Define the status of a workflow task
export const workflowTaskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'rejected',
  'sent_back',
])
export type WorkflowTaskStatus = z.infer<typeof workflowTaskStatusSchema>

// Define a workflow step configuration
export const stepConfigSchema = z.object({
  name: z.string(),
  nextSteps: z.array(z.string()),
  roles: z.array(z.string()),
  allowReassignment: z.boolean(),
  allowSendBack: z.boolean(),
})
export type StepConfig = z.infer<typeof stepConfigSchema>

// Define the complete workflow configuration
export const workflowConfigSchema = z.object({
  product: z.string(),
  steps: z.array(stepConfigSchema),
  roleBasedFiltering: z.record(
    z.string(),
    z.record(z.string(), z.array(z.string()))
  ),
})
export type WorkflowConfig = z.infer<typeof workflowConfigSchema>

// Define a workflow transition history entry
export const workflowHistoryEntrySchema = z.object({
  step: z.string(),
  assignedTo: z.string(),
  assignedBy: z.string(),
  timestamp: z.string(),
  comments: z.string().optional(),
})
export type WorkflowHistoryEntry = z.infer<typeof workflowHistoryEntrySchema>

// Define a workflow task (an instance of a workflow step)
export const workflowTaskSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  currentStep: z.string(),
  assignedTo: z.string(),
  assignedBy: z.string(),
  status: workflowTaskStatusSchema,
  history: z.array(workflowHistoryEntrySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type WorkflowTask = z.infer<typeof workflowTaskSchema>
