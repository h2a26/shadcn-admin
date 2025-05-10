import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import {
  ParcelDetails,
  PremiumCalculation,
  ShippingCoverage,
} from '@/features/proposal/data/schema.ts'
import { calculatePremium } from '@/features/proposal/utils'

export function PremiumCalculationForm() {
  const {
    control,
    watch,
    setValue
  } = useFormContext<{
    premiumCalculation: PremiumCalculation
    parcelDetails: ParcelDetails
    shippingCoverage: ShippingCoverage
  }>()

  const parcelDetails = watch('parcelDetails')
  const shippingCoverage = watch('shippingCoverage')
  const discountCode = watch('premiumCalculation.discountCode')

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
      <FormField
        control={control}
        name='premiumCalculation.proposalNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proposal Number</FormLabel>
            <FormControl>
              <Input {...field} readOnly className='bg-muted' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='premiumCalculation.basePremium'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Premium</FormLabel>
            <FormControl>
              <Input {...field} readOnly className='bg-muted' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='premiumCalculation.riskLoad'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk Load</FormLabel>
            <FormControl>
              <Input {...field} readOnly className='bg-muted' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='premiumCalculation.totalPremium'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Premium</FormLabel>
            <FormControl>
              <Input {...field} readOnly className='bg-muted font-bold' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='premiumCalculation.discountCode'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Code (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Enter discount code' />
            </FormControl>
            <FormMessage />
            <p className='text-muted-foreground text-xs'>
              Enter a valid discount code to receive a premium reduction
            </p>
          </FormItem>
        )}
      />

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
