import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUsers } from '../context/users-context'
import { deleteUser } from '../services/user-service'
import { UserForm } from './user-form'

export function UserDialogs() {
  const { open, setOpen, currentRow, refreshUsers } = useUsers()

  // Handle dialog close
  const handleClose = () => {
    setOpen(null)
  }

  // Handle successful form submission
  const handleSuccess = () => {
    toast.success(
      currentRow ? 'User updated successfully' : 'User created successfully'
    )
    refreshUsers()
    handleClose()
  }

  // Handle user deletion
  const handleDelete = () => {
    if (currentRow) {
      const success = deleteUser(currentRow.id)
      if (success) {
        toast.success('User deleted successfully')
        refreshUsers()
      } else {
        toast.error('Failed to delete user')
      }
    }
    handleClose()
  }

  return (
    <>
      {/* Add/Edit User Dialog */}
      <Dialog
        open={open === 'add' || open === 'edit'}
        onOpenChange={handleClose}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {open === 'add' ? 'Add New User' : 'Edit User'}
            </DialogTitle>
            <DialogDescription>
              {open === 'add'
                ? 'Create a new user with role-based permissions'
                : 'Update user information and permissions'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={currentRow || undefined}
            onSuccess={handleSuccess}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={open === 'delete'} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{' '}
              <strong>
                {currentRow?.firstName} {currentRow?.lastName}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign User to Workflow Dialog */}
      <Dialog open={open === 'assign'} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Assign to Workflow</DialogTitle>
            <DialogDescription>
              Assign {currentRow?.firstName} {currentRow?.lastName} to workflow
              tasks based on their role.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-muted-foreground mb-4 text-sm'>
              This user has the role of <strong>{currentRow?.role}</strong> and
              can be assigned to the following workflow steps:
            </p>

            {/* This would be replaced with actual workflow assignment UI */}
            <div className='text-sm'>
              Workflow assignment functionality will be implemented in the next
              phase.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
