import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PolicyholderInfo } from '@/features/proposal/data/schema'

export function PolicyholderInfoForm() {
  const { control } = useFormContext<{ policyholderInfo: PolicyholderInfo }>()

  return (
    <div className='space-y-4 text-start'>
      <FormField
        control={control}
        name='policyholderInfo.fullName'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Full Name <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Enter full name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='policyholderInfo.phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Phone Number <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Enter phone number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='policyholderInfo.email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder='Enter email addres' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='policyholderInfo.nrcNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              NRC Number <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Enter NRC number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='policyholderInfo.address'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder='Enter address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
