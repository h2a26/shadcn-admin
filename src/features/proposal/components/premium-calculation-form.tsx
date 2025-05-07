import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { calculatePremium } from '@/features/proposal';
import { ParcelDetails, PremiumCalculation, ShippingCoverage } from '@/features/proposal/data/schema.ts'

export function PremiumCalculationForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{
    premiumCalculation: PremiumCalculation;
    parcelDetails: ParcelDetails;
    shippingCoverage: ShippingCoverage;
  }>();

  const parcelDetails = watch('parcelDetails');
  const shippingCoverage = watch('shippingCoverage');
  const discountCode = watch('premiumCalculation.discountCode');

  // Calculate premium whenever relevant fields change
  useEffect(() => {
    if (
      parcelDetails?.declaredValue &&
      shippingCoverage?.coverageType
    ) {
      const { basePremium, riskLoad, totalPremium } = calculatePremium(
        parcelDetails,
        shippingCoverage,
        discountCode
      );

      setValue('premiumCalculation.basePremium', basePremium);
      setValue('premiumCalculation.riskLoad', riskLoad);
      setValue('premiumCalculation.totalPremium', totalPremium);
    }
  }, [
    parcelDetails,
    shippingCoverage,
    discountCode,
    setValue
  ]);

  return (
    <div className='space-y-4 text-start'>
      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.proposalNo').name}
          className='block text-sm font-medium text-primary'
        >
          Proposal Number
        </label>
        <Input
          id={register('premiumCalculation.proposalNo').name}
          {...register('premiumCalculation.proposalNo')}
          className='block w-full rounded-md border p-2 bg-muted'
          readOnly
        />
        {errors.premiumCalculation?.proposalNo && (
          <span className='text-sm text-destructive'>
            {errors.premiumCalculation.proposalNo.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.basePremium').name}
          className='block text-sm font-medium text-primary'
        >
          Base Premium
        </label>
        <Input
          id={register('premiumCalculation.basePremium').name}
          {...register('premiumCalculation.basePremium')}
          className='block w-full rounded-md border p-2 bg-muted'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.riskLoad').name}
          className='block text-sm font-medium text-primary'
        >
          Risk Load
        </label>
        <Input
          id={register('premiumCalculation.riskLoad').name}
          {...register('premiumCalculation.riskLoad')}
          className='block w-full rounded-md border p-2 bg-muted'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.totalPremium').name}
          className='block text-sm font-medium text-primary font-bold'
        >
          Total Premium
        </label>
        <Input
          id={register('premiumCalculation.totalPremium').name}
          {...register('premiumCalculation.totalPremium')}
          className='block w-full rounded-md border p-2 bg-muted font-bold'
          readOnly
        />
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('premiumCalculation.discountCode').name}
          className='block text-sm font-medium text-primary'
        >
          Discount Code (Optional)
        </label>
        <Input
          id={register('premiumCalculation.discountCode').name}
          {...register('premiumCalculation.discountCode')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter discount code'
        />
        <p className='text-xs text-muted-foreground'>
          Enter a valid discount code to receive a premium reduction
        </p>
      </div>

      <div className='mt-6 p-4 bg-muted rounded-md'>
        <h3 className='text-sm font-medium mb-2'>Premium Calculation Details</h3>
        <p className='text-xs text-muted-foreground'>
          The premium is calculated based on the declared value, coverage type, and risk factors.
          Additional riders and parcel characteristics may affect the final premium.
        </p>
      </div>
    </div>
  );
}
