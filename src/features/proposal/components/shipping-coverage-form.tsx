import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { ShippingCoverage, CoverageType, RiderOption } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ShippingCoverageForm() {
  const {
    control,
    watch,
  } = useFormContext<{ shippingCoverage: ShippingCoverage }>();

  const coverageTypes: CoverageType[] = [
    'Basic',
    'Standard',
    'Premium',
    'Custom',
  ];

  const riderOptions: RiderOption[] = [
    'Water Damage',
    'Theft Protection',
    'Extended Coverage',
    'Express Claims',
  ];

  const shippingDate = watch('shippingCoverage.shippingDate');

  return (
    <div className='space-y-4 text-start'>
      <FormField
        control={control}
        name='shippingCoverage.origin'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origin</FormLabel>
            <FormControl>
              <Input
                placeholder='Enter origin location'
                {...field}
              />
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
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <Input
                placeholder='Enter destination location'
                {...field}
              />
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
                    date < new Date() || 
                    (shippingDate && date < shippingDate)
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
            <FormLabel>Coverage Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
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
            <FormLabel>Deductible (Optional)</FormLabel>
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
                          : (field.value || []).filter((r) => r !== rider);
                        field.onChange(updatedRiders);
                      }}
                    />
                  </FormControl>
                  <label
                    htmlFor={`rider-${rider}`}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
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
  );
}
