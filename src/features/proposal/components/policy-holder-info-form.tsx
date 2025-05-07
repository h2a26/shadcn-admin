import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PolicyholderInfo } from '@/features/proposal/data/schema'

export function PolicyholderInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ policyholderInfo: PolicyholderInfo }>()

  return (
    <div className='space-y-4 text-start'>
      <div className='space-y-2'>
        <label
          htmlFor={register('policyholderInfo.fullName').name}
          className='text-primary block text-sm font-medium'
        >
          Full Name
        </label>
        <Input
          id={register('policyholderInfo.fullName').name}
          {...register('policyholderInfo.fullName')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter full name'
        />
        {errors.policyholderInfo?.fullName && (
          <span className='text-destructive text-sm'>
            {errors.policyholderInfo.fullName.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('policyholderInfo.phoneNumber').name}
          className='text-primary block text-sm font-medium'
        >
          Phone Number
        </label>
        <Input
          id={register('policyholderInfo.phoneNumber').name}
          {...register('policyholderInfo.phoneNumber')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter phone number'
        />
        {errors.policyholderInfo?.phoneNumber && (
          <span className='text-destructive text-sm'>
            {errors.policyholderInfo.phoneNumber.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('policyholderInfo.email').name}
          className='text-primary block text-sm font-medium'
        >
          Email (Optional)
        </label>
        <Input
          id={register('policyholderInfo.email').name}
          {...register('policyholderInfo.email')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter email address'
          type='email'
        />
        {errors.policyholderInfo?.email && (
          <span className='text-destructive text-sm'>
            {errors.policyholderInfo.email.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('policyholderInfo.nrcNumber').name}
          className='text-primary block text-sm font-medium'
        >
          NRC Number
        </label>
        <Input
          id={register('policyholderInfo.nrcNumber').name}
          {...register('policyholderInfo.nrcNumber')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter NRC number'
        />
        {errors.policyholderInfo?.nrcNumber && (
          <span className='text-destructive text-sm'>
            {errors.policyholderInfo.nrcNumber.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('policyholderInfo.address').name}
          className='text-primary block text-sm font-medium'
        >
          Address (Optional)
        </label>
        <Textarea
          id={register('policyholderInfo.address').name}
          {...register('policyholderInfo.address')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter address'
          rows={3}
        />
        {errors.policyholderInfo?.address && (
          <span className='text-destructive text-sm'>
            {errors.policyholderInfo.address.message}
          </span>
        )}
      </div>
    </div>
  )
}
