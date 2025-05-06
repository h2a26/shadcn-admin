import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useCallback, useRef } from 'react';
import { ParcelInsuranceProposal, ProposalStepId } from '@/features/proposal/types';
import { stepperSchemas } from '@/features/proposal/schemas/form-schemas';

export type ProposalFormData = ParcelInsuranceProposal;

export interface UseProposalFormReturn {
  form: UseFormReturn<ProposalFormData>;
  formDataRef: React.RefObject<Partial<ProposalFormData> | null>;
  getCurrentFormData: () => Partial<ProposalFormData>;
  hasFormData: () => boolean;
  validateStep: (stepId: ProposalStepId) => Promise<boolean>;
}

const proposalFormSchema = z.object({
  policyholderInfo: stepperSchemas.policyholderInfo,
  parcelDetails: stepperSchemas.parcelDetails,
  shippingCoverage: stepperSchemas.shippingCoverage,
  premiumCalculation: stepperSchemas.premiumCalculation,
  documentsConsent: stepperSchemas.documentsConsent,
});

export function useProposalForm(): UseProposalFormReturn {
  const formDataRef = useRef<Partial<ProposalFormData> | null>(null);
  
  const form = useForm<ProposalFormData>({
    mode: 'onChange',
    resolver: zodResolver(proposalFormSchema) as never,
    shouldUnregister: false,
    defaultValues: {
      policyholderInfo: {
        fullName: '',
        phoneNumber: '',
        email: '',
        nrcNumber: '',
        address: '',
      },
      parcelDetails: {
        description: '',
        category: '',
        declaredValue: 0,
        weightKg: undefined,
        lengthCm: undefined,
        widthCm: undefined,
        heightCm: undefined,
        fragileItem: false,
        highRiskItem: false,
      },
      shippingCoverage: {
        origin: '',
        destination: '',
        shippingDate: new Date(),
        deliveryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        coverageType: '',
        deductible: undefined,
        riders: [],
      },
      premiumCalculation: {
        proposalNo: '',
        basePremium: 0,
        riskLoad: 0,
        totalPremium: 0,
        discountCode: '',
      },
      documentsConsent: {
        identityDoc: undefined,
        ownershipProof: undefined,
        invoice: undefined,
        agreeTerms: false,
        confirmAccuracy: false,
      },
    },
  });

  const getCurrentFormData = useCallback((): Partial<ProposalFormData> => {
    const values = form.getValues();
    formDataRef.current = values;
    return values;
  }, [form]);

  const hasFormData = useCallback((): boolean => {
    const formData = getCurrentFormData();
    
    const hasPolicyholderInfo = formData.policyholderInfo && Object.values(formData.policyholderInfo).some(
      value => typeof value === 'string' && value.trim() !== ''
    );
    
    const hasParcelDetails = formData.parcelDetails && Object.entries(formData.parcelDetails).some(
      ([_, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return value > 0;
        if (typeof value === 'boolean') return value;
        return false;
      }
    );
    
    return Boolean(hasPolicyholderInfo || hasParcelDetails);
  }, [getCurrentFormData]);

  const validateStep = async (stepId: ProposalStepId): Promise<boolean> => {
    return form.trigger(stepId);
  };

  return {
    form,
    formDataRef,
    getCurrentFormData,
    hasFormData,
    validateStep,
  };
}
