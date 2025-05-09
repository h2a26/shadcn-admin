import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { rolesConfig } from '../config/roles'
import { useUsers } from '../context/users-context'
import { User } from '../data/schema'
import { createUser, updateUser } from '../services/user-service'

// Form schema
const userFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z
    .string()
    .min(5, { message: 'Please enter a valid phone number.' }),
  role: z.enum(
    [
      'superadmin',
      'admin',
      'cashier',
      'manager',
      'underwriter',
      'risk_reviewer',
      'approver',
    ] as const,
    {
      required_error: 'Please select a role.',
    }
  ),
  status: z.enum(['active', 'inactive', 'invited', 'suspended'], {
    required_error: 'Please select a status.',
  }),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  user?: User
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { refreshUsers } = useUsers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set default values based on whether we're editing or creating
  const defaultValues: Partial<UserFormValues> = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      }
    : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        role: 'underwriter', // Default role
        status: 'active',
      }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true)

      if (user) {
        // Update existing user
        updateUser(user.id, values)
      } else {
        // Create new user
        createUser(values)
      }

      // Refresh the users list
      refreshUsers()

      // Call the success callback
      onSuccess()
    } catch (error) {
      // Display error to user instead of console.error
      toast.error(
        `Error saving user: ${error instanceof Error ? error.message : String(error)}`
      )
      // Re-throw the error for upstream error handling
      throw new Error(
        `Error saving user: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='johndoe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='john@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='123-456-7890' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rolesConfig.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='invited'>Invited</SelectItem>
                    <SelectItem value='suspended'>Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
