import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CoverageType,
  RiderOption,
  ShippingCoverage,
} from '@/features/proposal/data/schema.ts'

export function ShippingCoverageForm() {
  const { control, watch } = useFormContext<{
    shippingCoverage: ShippingCoverage
  }>()

  const coverageTypes: CoverageType[] = [
    'Basic',
    'Standard',
    'Premium',
    'Custom',
  ]

  const riderOptions: RiderOption[] = [
    'Water Damage',
    'Theft Protection',
    'Extended Coverage',
    'Express Claims',
  ]

  const shippingDate = watch('shippingCoverage.shippingDate')

  return (
    <div className='space-y-4 text-start'>
      <FormField
        control={control}
        name='shippingCoverage.origin'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origin <span className="text-red-500">*</span></FormLabel>
            <FormControl>
            <Input placeholder='Enter origin location' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='shippingCoverage.destination'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination <span className="text-red-500">*</span></FormLabel>
            <FormControl>
            <Input placeholder='Enter destination location' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='shippingCoverage.shippingDate'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Shipping Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Select shipping date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='shippingCoverage.deliveryDate'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Delivery Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Select delivery date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() || (shippingDate && date < shippingDate)
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='shippingCoverage.coverageType'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coverage Type <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select coverage type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {coverageTypes.map((type) => (
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
        name='shippingCoverage.deductible'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deductible</FormLabel>
            <FormControl>
              <Input
                placeholder='Enter deductible amount'
                type='number'
                min='0'
                step='0.01'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='shippingCoverage.riders'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Riders (Optional)</FormLabel>
            <div className='space-y-2'>
              {riderOptions.map((rider) => (
                <div key={rider} className='flex items-center space-x-2'>
                  <FormControl>
                    <Checkbox
                      id={`rider-${rider}`}
                      checked={field.value?.includes(rider)}
                      onCheckedChange={(checked) => {
                        const updatedRiders = checked
                          ? [...(field.value || []), rider]
                          : (field.value || []).filter((r) => r !== rider)
                        field.onChange(updatedRiders)
                      }}
                    />
                  </FormControl>
                  <label
                    htmlFor={`rider-${rider}`}
                    className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {rider}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
