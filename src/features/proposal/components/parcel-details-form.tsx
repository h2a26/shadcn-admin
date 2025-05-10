import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ParcelCategory, ParcelDetails } from '@/features/proposal/data/schema'

export function ParcelDetailsForm() {
  const {
    control,
  } = useFormContext<{ parcelDetails: ParcelDetails }>()

  const parcelCategories: ParcelCategory[] = [
    'Electronics',
    'Documents',
    'Clothing',
    'Fragile',
    'Perishable',
    'Other',
  ]

  return (
    <div className='space-y-4 text-start'>
      <FormField
        control={control}
        name='parcelDetails.description'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Textarea placeholder='Describe the parcel contents' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='parcelDetails.category'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category <span className='text-red-500'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                        {parcelCategories.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='parcelDetails.declaredValue'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Declared Value <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Enter declared value' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <FormField
          control={control}
          name='parcelDetails.weightKg'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input placeholder='Weight' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='parcelDetails.lengthCm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (cm)</FormLabel>
              <FormControl>
                <Input placeholder='Length' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <FormField
          control={control}
          name='parcelDetails.widthCm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width (cm)</FormLabel>
              <FormControl>
                <Input placeholder='Width' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='parcelDetails.heightCm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input placeholder='Height' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='parcelDetails.fragileItem'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
            <FormControl>
              <Checkbox
                id='parcelDetails.fragileItem'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel htmlFor='parcelDetails.fragileItem'>
                Fragile Item
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='parcelDetails.highRiskItem'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
            <FormControl>
              <Checkbox
                id='parcelDetails.highRiskItem'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel htmlFor='parcelDetails.highRiskItem'>
                High Risk Item
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  )
}
