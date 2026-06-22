"use client";

import React, { useEffect } from 'react';
import { useWizard } from '@/src/features/wizard/presentation/WizardContext';
import { Step1ApplicantInfo } from '@/src/features/wizard/presentation/components/Step1ApplicantInfo';
import { Step2BusinessInfo } from '@/src/features/wizard/presentation/components/Step2BusinessInfo';
import { Step3PremiseInfo } from '@/src/features/wizard/presentation/components/Step3PremiseInfo';
import { Step4EntertainmentDetails } from '@/src/features/wizard/presentation/components/Step4EntertainmentDetails';
import { Step5DocumentUpload } from '@/src/features/wizard/presentation/components/Step5DocumentUpload';
import { Step6Declaration } from '@/src/features/wizard/presentation/components/Step6Declaration';
import { useParams, useRouter } from 'next/navigation';

export default function WizardStepPage() {
  const {
    formData,
    errors,
    handleFieldChange,
    documents,
    handleUploadFile,
    handleDeleteFile,
  } = useWizard();

  const params = useParams();
  const router = useRouter();
  const step = params?.step ? Number(params.step) : 1;

  // If the step is out of range, redirect to step 1
  useEffect(() => {
    if (isNaN(step) || step < 1 || step > 6) {
      router.replace('/apply/1');
    }
  }, [step, router]);

  if (isNaN(step) || step < 1 || step > 6) {
    return null;
  }

  return (
    <>
      {step === 1 && (
        <Step1ApplicantInfo
          data={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {step === 2 && (
        <Step2BusinessInfo
          data={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {step === 3 && (
        <Step3PremiseInfo
          data={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {step === 4 && (
        <Step4EntertainmentDetails
          data={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {step === 5 && (
        <Step5DocumentUpload
          documents={documents}
          errors={errors}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
        />
      )}
      {step === 6 && (
        <Step6Declaration
          data={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
    </>
  );
}
