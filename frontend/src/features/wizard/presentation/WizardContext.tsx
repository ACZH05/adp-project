"use client";

import React, { createContext, useContext, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { APPLICANT_ROUTES } from '@/src/features/applicant/data/applicantConstants';
import { WizardFormData, validateWizardStep } from '../utils/wizardValidation';
import { UploadedFile } from './components/Step5DocumentUpload';

interface WizardContextType {
  currentStep: number;
  completedSteps: number[];
  formData: WizardFormData;
  documents: Record<string, UploadedFile | undefined>;
  errors: Record<string, string>;
  saveDraftMessage: string | null;
  isSubmitted: boolean;
  referenceId: string;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleFieldChange: (field: string, value: string | boolean) => void;
  handleUploadFile: (key: string, file: File) => void;
  handleDeleteFile: (key: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSaveDraft: () => void;
  handleSaveAndExit: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleExit: () => void;
}

const initialFormData: WizardFormData = {
  applicationId: '',
  applicationVersionId: '',
  fullName: '',
  icPassport: '',
  dob: '',
  email: '',
  contactNumber: '',
  residentialAddress: '',
  businessName: '',
  position: '',
  businessPhone: '',
  regDate: '',
  expiryDate: '',
  regNumber: '',
  businessAddress: '',
  premiseAddress: '',
  postcode: '',
  cityDistrict: '',
  premiseType: '',
  otherPremiseType: '',
  floorLevel: '',
  primaryType: '',
  quantityCapacity: '',
  quantityUnit: '',
  requestedDuration: '',
  operatingHoursStart: '',
  operatingHoursEnd: '',
  signatoryName: '',
  signatoryIc: '',
  companyName: '',
  acceptedDeclaration: false,
};

interface WizardDraft {
  data: WizardFormData;
  completed: number[];
  docs: Record<string, UploadedFile | undefined>;
}

const loadWizardDraft = (): WizardDraft | null => {
  if (typeof window === 'undefined') return null;

  const saved = localStorage.getItem('adp_wizard_draft');
  if (!saved) return null;

  try {
    const { data, completed, docs } = JSON.parse(saved) as WizardDraft;
    return { data, completed, docs };
  } catch (e) {
    console.error('Error loading draft', e);
    return null;
  }
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  
  // Parse current step from params, default to 1
  const stepParam = params?.step ? Number(params.step) : 1;
  const currentStep = isNaN(stepParam) ? 1 : stepParam;
  const [draft] = useState(loadWizardDraft);

  const [completedSteps, setCompletedSteps] = useState<number[]>(draft?.completed ?? []);
  const [formData, setFormData] = useState<WizardFormData>(draft?.data ?? initialFormData);
  const [documents, setDocuments] = useState<Record<string, UploadedFile | undefined>>(draft?.docs ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveDraftMessage, setSaveDraftMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleUploadFile = async (key: string, file: File) => {
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setDocuments((prev) => ({
      ...prev,
      [key]: {
        name: file.name,
        size: sizeStr,
        status: 'uploading',
        progress: 10,
      },
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      let currentVersionId = formData.applicationVersionId;
      let currentAppId = formData.applicationId;

      // If we don't have an applicationVersionId yet, save draft to generate one!
      if (!currentVersionId) {
        const response = await fetch(`${apiUrl}/applications/draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create application draft version for upload');
        }
        const result = await response.json();
        currentAppId = result.applicationId;
        currentVersionId = result.applicationVersionId;

        setFormData((prev) => ({
          ...prev,
          applicationId: currentAppId,
          applicationVersionId: currentVersionId,
        }));
      }

      // Map frontend keys to backend DocumentType
      let docType = '';
      if (key === 'passportPhoto') docType = 'applicant_passport_photo';
      else if (key === 'icCopy') docType = 'identity_card_copy';
      else if (key === 'businessReg') docType = 'business_registration_copy';
      else if (key === 'tenancyAgreement') docType = 'tenancy_agreement';

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('applicationVersionId', currentVersionId!);
      formDataUpload.append('documentType', docType);

      setDocuments((prev) => ({
        ...prev,
        [key]: { ...prev[key]!, progress: 50 },
      }));

      const uploadResponse = await fetch(`${apiUrl}/documents/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed on server');
      }

      const uploadResult = await uploadResponse.json();

      setDocuments((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: sizeStr,
          status: 'verified',
          progress: 100,
          dbId: uploadResult.id,
        },
      }));
    } catch (err) {
      console.error('File upload error:', err);
      setDocuments((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: sizeStr,
          status: 'flagged',
          progress: 0,
        },
      }));
      setErrors((prev) => ({
        ...prev,
        [key]: 'Failed to upload document to server.',
      }));
    }
  };

  const handleDeleteFile = async (key: string) => {
    const doc = documents[key];
    setDocuments((prev) => ({
      ...prev,
      [key]: undefined,
    }));
    if (doc?.dbId) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        await fetch(`${apiUrl}/documents/${doc.dbId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete document from server:', err);
      }
    }
  };

  const validateStep = (stepNum: number): boolean => {
    return validateWizardStep(stepNum, formData, documents, setErrors);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      const nextStep = currentStep + 1;
      router.push(`/applicant/apply/${nextStep}`);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      router.push(`/applicant/apply/${prevStep}`);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      const response = await fetch(`${apiUrl}/applications/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          applicationId: formData.applicationId || undefined,
          applicationVersionId: formData.applicationVersionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft to database');
      }

      const result = await response.json();
      
      const updatedFormData = {
        ...formData,
        applicationId: result.applicationId,
        applicationVersionId: result.applicationVersionId,
      };

      setFormData(updatedFormData);

      const draftPayload = {
        data: updatedFormData,
        step: currentStep,
        completed: completedSteps,
        docs: documents,
      };
      localStorage.setItem('adp_wizard_draft', JSON.stringify(draftPayload));
      setSaveDraftMessage('Application draft saved successfully.');
      setTimeout(() => {
        setSaveDraftMessage(null);
      }, 4000);
    } catch (e) {
      console.error('Error saving draft:', e);
      setSaveDraftMessage('Failed to save draft. Local backup stored.');
      localStorage.setItem('adp_wizard_draft', JSON.stringify({
        data: formData,
        step: currentStep,
        completed: completedSteps,
        docs: documents,
      }));
      setTimeout(() => {
        setSaveDraftMessage(null);
      }, 4000);
    }
  };

  const handleSaveAndExit = async () => {
    await handleSaveDraft();
    router.push(APPLICANT_ROUTES.dashboard);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(6)) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        const response = await fetch(`${apiUrl}/applications/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            applicationId: formData.applicationId || undefined,
            applicationVersionId: formData.applicationVersionId || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit application to database');
        }

        const result = await response.json();
        setReferenceId(result.applicationNo);
        setIsSubmitted(true);
        localStorage.removeItem('adp_wizard_draft');
      } catch (error) {
        console.error('Error submitting application:', error);
        setErrors({ submit: 'Failed to submit application. Please check your connection and try again.' });
      }
    }
  };

  const handleExit = () => {
    router.push(APPLICANT_ROUTES.dashboard);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        completedSteps,
        formData,
        documents,
        errors,
        saveDraftMessage,
        isSubmitted,
        referenceId,
        setErrors,
        handleFieldChange,
        handleUploadFile,
        handleDeleteFile,
        handleNext,
        handleBack,
        handleSaveDraft,
        handleSaveAndExit,
        handleSubmit,
        handleExit,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
