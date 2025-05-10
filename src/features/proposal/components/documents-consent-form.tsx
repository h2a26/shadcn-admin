import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DocumentsConsent } from '@/features/proposal/data/schema'

export function DocumentsConsentForm() {
  const { control } = useFormContext<{ documentsConsent: DocumentsConsent }>()

  return (
    <div className='space-y-6 text-start'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Required Documents</h3>
        <p className='text-muted-foreground text-sm'>
          Please upload the following required documents to complete your
          proposal.
        </p>

        <div className='space-y-4'>
          <FormField
            control={control}
            name='documentsConsent.identityDoc'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identity Document</FormLabel>
                <FormControl>
                  <div className='flex items-center space-x-2'>
                    <Input
                      type='file'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className='text-muted-foreground text-xs'>
                  Upload a valid government-issued ID (passport, driver's
                  license, etc.)
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='documentsConsent.ownershipProof'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Proof</FormLabel>
                <FormControl>
                  <div className='flex items-center space-x-2'>
                    <Input
                      type='file'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className='text-muted-foreground text-xs'>
                  Upload proof of ownership for the parcel contents (receipt,
                  certificate, etc.)
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='documentsConsent.invoice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice</FormLabel>
                <FormControl>
                  <div className='flex items-center space-x-2'>
                    <Input
                      type='file'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className='text-muted-foreground text-xs'>
                  Upload an invoice or receipt if available
                </p>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Terms and Conditions</h3>
        <div className='space-y-4'>
          {/* Agree to Terms */}
          <FormField
            control={control}
            name='documentsConsent.agreeTerms'
            render={({ field }) => (
              <FormItem className='flex items-start space-y-0 space-x-2'>
                <FormControl>
                  <Checkbox
                    id='agreeTerms'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-1'
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel htmlFor='agreeTerms'>
                    I agree to the terms and conditions
                  </FormLabel>
                  <p className='text-muted-foreground text-xs'>
                    By checking this box, you agree to the insurance policy
                    terms, coverage limits, exclusions, and claims process as
                    outlined in our terms and conditions.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Confirm Accuracy */}
          <FormField
            control={control}
            name='documentsConsent.confirmAccuracy'
            render={({ field }) => (
              <FormItem className='flex items-start space-y-0 space-x-2'>
                <FormControl>
                  <Checkbox
                    id='confirmAccuracy'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-1'
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel htmlFor='confirmAccuracy'>
                    I confirm the accuracy of the information provided
                  </FormLabel>
                  <p className='text-muted-foreground text-xs'>
                    I confirm that all information provided in this proposal is
                    accurate and complete. I understand that providing false
                    information may result in claim denial or policy
                    cancellation.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
