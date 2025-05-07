import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { calculatePremium } from '@/features/proposal/utils'
import {
  ParcelDetails,
  PremiumCalculation,
  ShippingCoverage,
} from '@/features/proposal/data/schema.ts'

export function PremiumCalculationForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{
    premiumCalculation: PremiumCalculation
    parcelDetails: ParcelDetails
    shippingCoverage: ShippingCoverage
  }>()

  const parcelDetails = watch('parcelDetails')
  const shippingCoverage = watch('shippingCoverage')
  const discountCode = watch('premiumCalculation.discountCode')

  // Calculate premium whenever relevant fields change
  useEffect(() => {
    if (parcelDetails?.declaredValue && shippingCoverage?.coverageType) {
      const { basePremium, riskLoad, totalPremium } = calculatePremium(
        parcelDetails,
        shippingCoverage,
        discountCode
      )

      setValue('premiumCalculation.basePremium', basePremium)
      setValue('premiumCalculation.riskLoad', riskLoad)
      setValue('premiumCalculation.totalPremium', totalPremium)
    }
  }, [parcelDetails, shippingCoverage, discountCode, setValue])

  return (
    <div className='space-y-4 text-start'>
      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.proposalNo').name}
          className='text-primary block text-sm font-medium'
        >
          Proposal Number
        </label>
        <Input
          id={register('premiumCalculation.proposalNo').name}
          {...register('premiumCalculation.proposalNo')}
          className='bg-muted block w-full rounded-md border p-2'
          readOnly
        />
        {errors.premiumCalculation?.proposalNo && (
          <span className='text-destructive text-sm'>
            {errors.premiumCalculation.proposalNo.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.basePremium').name}
          className='text-primary block text-sm font-medium'
        >
          Base Premium
        </label>
        <Input
          id={register('premiumCalculation.basePremium').name}
          {...register('premiumCalculation.basePremium')}
          className='bg-muted block w-full rounded-md border p-2'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.riskLoad').name}
          className='text-primary block text-sm font-medium'
        >
          Risk Load
        </label>
        <Input
          id={register('premiumCalculation.riskLoad').name}
          {...register('premiumCalculation.riskLoad')}
          className='bg-muted block w-full rounded-md border p-2'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.totalPremium').name}
          className='text-primary block text-sm font-bold font-medium'
        >
          Total Premium
        </label>
        <Input
          id={register('premiumCalculation.totalPremium').name}
          {...register('premiumCalculation.totalPremium')}
          className='bg-muted block w-full rounded-md border p-2 font-bold'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.discountCode').name}
          className='text-primary block text-sm font-medium'
        >
          Discount Code (Optional)
        </label>
        <Input
          id={register('premiumCalculation.discountCode').name}
          {...register('premiumCalculation.discountCode')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter discount code'
        />
        <p className='text-muted-foreground text-xs'>
          Enter a valid discount code to receive a premium reduction
        </p>
      </div>

      <div className='bg-muted mt-6 rounded-md p-4'>
        <h3 className='mb-2 text-sm font-medium'>
          Premium Calculation Details
        </h3>
        <p className='text-muted-foreground text-xs'>
          The premium is calculated based on the declared value, coverage type,
          and risk factors. Additional riders and parcel characteristics may
          affect the final premium.
        </p>
      </div>
    </div>
  )
}
