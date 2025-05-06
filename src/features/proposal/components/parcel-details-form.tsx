import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useFormContext } from 'react-hook-form';
import { ParcelDetails, ParcelCategory } from '@/features/proposal/types';

export function ParcelDetailsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<{ parcelDetails: ParcelDetails }>();

  const parcelCategories: ParcelCategory[] = [
    'Electronics',
    'Documents',
    'Clothing',
    'Fragile',
    'Perishable',
    'Other',
  ];

  return (
    <div className='space-y-4 text-start'>
      <div className='space-y-2'>
        <label
          htmlFor={register('parcelDetails.description').name}
          className='block text-sm font-medium text-primary'
        >
          Description
        </label>
        <Textarea
          id={register('parcelDetails.description').name}
          {...register('parcelDetails.description')}
          className='block w-full rounded-md border p-2'
          placeholder='Describe the parcel contents'
          rows={3}
        />
        {errors.parcelDetails?.description && (
          <span className='text-sm text-destructive'>
            {errors.parcelDetails.description.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='parcelDetails.category'
          className='block text-sm font-medium text-primary'
        >
          Category
        </label>
        <Controller
          name='parcelDetails.category'
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger id='parcelDetails.category' className='w-full'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {parcelCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.parcelDetails?.category && (
          <span className='text-sm text-destructive'>
            {errors.parcelDetails.category.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('parcelDetails.declaredValue').name}
          className='block text-sm font-medium text-primary'
        >
          Declared Value
        </label>
        <Input
          id={register('parcelDetails.declaredValue').name}
          {...register('parcelDetails.declaredValue')}
          className='block w-full rounded-md border p-2'
          placeholder='Enter declared value'
          type='number'
          min='1'
          step='0.01'
        />
        {errors.parcelDetails?.declaredValue && (
          <span className='text-sm text-destructive'>
            {errors.parcelDetails.declaredValue.message}
          </span>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <label
            htmlFor={register('parcelDetails.weightKg').name}
            className='block text-sm font-medium text-primary'
          >
            Weight (kg)
          </label>
          <Input
            id={register('parcelDetails.weightKg').name}
            {...register('parcelDetails.weightKg')}
            className='block w-full rounded-md border p-2'
            placeholder='Weight'
            type='number'
            step='0.01'
          />
          {errors.parcelDetails?.weightKg && (
            <span className='text-sm text-destructive'>
              {errors.parcelDetails.weightKg.message}
            </span>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={register('parcelDetails.lengthCm').name}
            className='block text-sm font-medium text-primary'
          >
            Length (cm)
          </label>
          <Input
            id={register('parcelDetails.lengthCm').name}
            {...register('parcelDetails.lengthCm')}
            className='block w-full rounded-md border p-2'
            placeholder='Length'
            type='number'
            step='0.1'
          />
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={register('parcelDetails.widthCm').name}
            className='block text-sm font-medium text-primary'
          >
            Width (cm)
          </label>
          <Input
            id={register('parcelDetails.widthCm').name}
            {...register('parcelDetails.widthCm')}
            className='block w-full rounded-md border p-2'
            placeholder='Width'
            type='number'
            step='0.1'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label
          htmlFor={register('parcelDetails.heightCm').name}
          className='block text-sm font-medium text-primary'
        >
          Height (cm)
        </label>
        <Input
          id={register('parcelDetails.heightCm').name}
          {...register('parcelDetails.heightCm')}
          className='block w-full rounded-md border p-2'
          placeholder='Height'
          type='number'
          step='0.1'
        />
      </div>

      <div className='flex items-center space-x-2 pt-2'>
        <Controller
          name='parcelDetails.fragileItem'
          control={control}
          render={({ field }) => (
            <Checkbox
              id='parcelDetails.fragileItem'
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor='parcelDetails.fragileItem'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Fragile Item
        </label>
      </div>

      <div className='flex items-center space-x-2'>
        <Controller
          name='parcelDetails.highRiskItem'
          control={control}
          render={({ field }) => (
            <Checkbox
              id='parcelDetails.highRiskItem'
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor='parcelDetails.highRiskItem'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          High Risk Item
        </label>
      </div>
    </div>
  );
}
