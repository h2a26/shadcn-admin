/**
 * Role configuration for the insurance core platform
 * This defines all available roles and their permissions
 */
import { z } from 'zod'

// Define permission types
export const permissionSchema = z.enum([
  // User management permissions
  'users.view',
  'users.create',
  'users.update',
  'users.delete',

  // Proposal permissions
  'proposals.view',
  'proposals.create',
  'proposals.update',
  'proposals.delete',

  // Workflow permissions
  'workflow.view',
  'workflow.assign',
  'workflow.transition',
  'workflow.reassign',
  'workflow.sendBack',

  // Admin permissions
  'admin.settings',
  'admin.roles',
  'admin.workflow',
  'admin.reports',
])

export type Permission = z.infer<typeof permissionSchema>

// Define role interface
export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  workflowSteps?: string[] // Steps this role can be assigned to
}

// Define the roles configuration
export const rolesConfig: Role[] = [
  {
    id: 'superadmin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      'users.view',
      'users.create',
      'users.update',
      'users.delete',
      'proposals.view',
      'proposals.create',
      'proposals.update',
      'proposals.delete',
      'workflow.view',
      'workflow.assign',
      'workflow.transition',
      'workflow.reassign',
      'workflow.sendBack',
      'admin.settings',
      'admin.roles',
      'admin.workflow',
      'admin.reports',
    ],
    workflowSteps: ['proposal', 'risk_review', 'approval'],
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'System administrator with access to most features',
    permissions: [
      'users.view',
      'users.create',
      'users.update',
      'proposals.view',
      'workflow.view',
      'admin.settings',
      'admin.reports',
    ],
    workflowSteps: [],
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Department manager with oversight capabilities',
    permissions: [
      'users.view',
      'proposals.view',
      'workflow.view',
      'workflow.reassign',
      'admin.reports',
    ],
    workflowSteps: [],
  },
  {
    id: 'underwriter',
    name: 'Underwriter',
    description: 'Creates and processes insurance proposals',
    permissions: [
      'proposals.view',
      'proposals.create',
      'proposals.update',
      'workflow.view',
      'workflow.assign',
    ],
    workflowSteps: ['proposal'],
  },
  {
    id: 'risk_reviewer',
    name: 'Risk Reviewer',
    description: 'Reviews and assesses risk for insurance proposals',
    permissions: [
      'proposals.view',
      'proposals.update',
      'workflow.view',
      'workflow.transition',
      'workflow.sendBack',
    ],
    workflowSteps: ['risk_review'],
  },
  {
    id: 'approver',
    name: 'Approver',
    description: 'Final approval authority for insurance proposals',
    permissions: ['proposals.view', 'workflow.view', 'workflow.transition'],
    workflowSteps: ['approval'],
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Handles financial transactions',
    permissions: ['proposals.view'],
    workflowSteps: [],
  },
]

// Helper function to check if a user has a specific permission
export function hasPermission(
  userRole: string,
  permission: Permission
): boolean {
  const role = rolesConfig.find((r) => r.id === userRole)
  if (!role) return false
  return role.permissions.includes(permission)
}

// Helper function to check if a role can be assigned to a workflow step
export function canBeAssignedToStep(roleId: string, stepId: string): boolean {
  const role = rolesConfig.find((r) => r.id === roleId)
  if (!role || !role.workflowSteps) return false
  return role.workflowSteps.includes(stepId)
}

// Helper function to get all roles that can be assigned to a specific workflow step
export function getRolesForWorkflowStep(step: string): Role[] {
  return rolesConfig.filter(
    (role) =>
      role.workflowSteps?.includes(step) &&
      role.permissions.includes('workflow.assign')
  )
}

// Export the role IDs as a union type
export type RoleId = (typeof rolesConfig)[number]['id']
