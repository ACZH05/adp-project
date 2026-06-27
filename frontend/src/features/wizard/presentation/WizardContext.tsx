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
  handleUploadFile: (key: string, name: string, size: string) => void;
  handleDeleteFile: (key: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSaveDraft: () => void;
  handleSaveAndExit: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleExit: () => void;
}

const initialFormData: WizardFormData = {
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

  const handleUploadFile = (key: string, name: string, size: string) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: {
        name,
        size,
        status: 'uploading',
        progress: 0,
      },
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setDocuments((prev) => {
        const file = prev[key];
        if (!file) return prev;
        return {
          ...prev,
          [key]: {
            ...file,
            progress: currentProgress,
          },
        };
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        const finalStatus = 'verified';
        setDocuments((prev) => {
          const file = prev[key];
          if (!file) return prev;
          return {
            ...prev,
            [key]: {
              ...file,
              status: finalStatus,
              progress: 100,
            },
          };
        });
      }
    }, 100);
  };

  const handleDeleteFile = (key: string) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: undefined,
    }));
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

  const handleSaveDraft = () => {
    const draftPayload = {
      data: formData,
      step: currentStep,
      completed: completedSteps,
      docs: documents,
    };
    localStorage.setItem('adp_wizard_draft', JSON.stringify(draftPayload));
    setSaveDraftMessage('Application draft saved successfully.');
    setTimeout(() => {
      setSaveDraftMessage(null);
    }, 4000);
  };

  const handleSaveAndExit = () => {
    handleSaveDraft();
    router.push(APPLICANT_ROUTES.dashboard);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(6)) {
      setReferenceId(`ENT-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitted(true);
      localStorage.removeItem('adp_wizard_draft');
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
