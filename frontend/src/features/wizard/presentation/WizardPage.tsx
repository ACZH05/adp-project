"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { TopNav } from '@/src/shared/components/TopNav';
import { WizardStepper } from './components/WizardStepper';
import { Step1ApplicantInfo } from './components/Step1ApplicantInfo';
import { Step2BusinessInfo } from './components/Step2BusinessInfo';
import { Step3PremiseInfo } from './components/Step3PremiseInfo';
import { Step4EntertainmentDetails } from './components/Step4EntertainmentDetails';
import { Step5DocumentUpload, UploadedFile } from './components/Step5DocumentUpload';
import { Step6Declaration } from './components/Step6Declaration';

// Interfaces for Wizard Data
interface WizardFormData {
  // Step 1: Applicant
  fullName: string;
  icPassport: string;
  dob: string;
  email: string;
  contactNumber: string;
  residentialAddress: string;

  // Step 2: Business
  businessName: string;
  position: string;
  businessPhone: string;
  regDate: string;
  expiryDate: string;
  regNumber: string;
  businessAddress: string;

  // Step 3: Premise
  premiseAddress: string;
  postcode: string;
  cityDistrict: string;
  premiseType: string;
  otherPremiseType: string;
  floorLevel: string;

  // Step 4: Entertainment
  primaryType: string;
  quantityCapacity: string;
  quantityUnit: string;
  requestedDuration: string;
  operatingHoursStart: string;
  operatingHoursEnd: string;

  // Step 6: Declaration
  signatoryName: string;
  signatoryIc: string;
  companyName: string;
  acceptedDeclaration: boolean;
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

export const WizardPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const [documents, setDocuments] = useState<Record<string, UploadedFile | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveDraftMessage, setSaveDraftMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Load draft on mount if available
  useEffect(() => {
    const saved = localStorage.getItem('adp_wizard_draft');
    if (saved) {
      try {
        const { data, step, completed, docs } = JSON.parse(saved);
        setTimeout(() => {
          setFormData(data);
          setCurrentStep(step);
          setCompletedSteps(completed);
          setDocuments(docs);
        }, 0);
      } catch (e) {
        console.error('Error loading draft', e);
      }
    }
  }, []);

  const steps = [
    { number: 1, title: 'Applicant Info', description: 'Personal details and credentials' },
    { number: 2, title: 'Business Info', description: 'Registered entity information' },
    { number: 3, title: 'Premise Info', description: 'Location and establishment details' },
    { number: 4, title: 'Entertainment Details', description: 'Operating category and hours' },
    { number: 5, title: 'Document Upload', description: 'Upload verified supporting files' },
    { number: 6, title: 'Declaration', description: 'Legal undertaking and sign-off' },
  ];

  // Helper to update field
  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Mock File Upload Animation
  const handleUploadFile = (key: string, name: string, size: string) => {
    // 1. Set uploading status
    setDocuments((prev) => ({
      ...prev,
      [key]: {
        name,
        size,
        status: 'uploading',
        progress: 0,
      },
    }));

    // Clear document error
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }

    // 2. Animate upload progress
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
        // Finalize status: mock SSM or Tenancy documents to sometimes have warning labels
        // simulating AI confidence scoring (e.g. Tenancy Agreement flags as warning)
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

  // Delete file
  const handleDeleteFile = (key: string) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  // Validate current step
  const validateStep = (stepNum: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.fullName.trim()) stepErrors.fullName = 'Full Name is required';
      
      const icClean = formData.icPassport.replace(/-/g, '');
      if (!formData.icPassport.trim()) {
        stepErrors.icPassport = 'IC / Passport number is required';
      } else if (icClean.length === 12 && !/^\d+$/.test(icClean)) {
        stepErrors.icPassport = 'IC should contain numbers only';
      } else if (formData.icPassport.trim().length < 6) {
        stepErrors.icPassport = 'Invalid passport format';
      }

      if (!formData.dob) stepErrors.dob = 'Date of birth is required';
      if (!formData.contactNumber.trim()) stepErrors.contactNumber = 'Contact number is required';
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
      } else if (!formData.email.includes('@')) {
        stepErrors.email = 'Please enter a valid email address';
      }
      if (!formData.residentialAddress.trim()) stepErrors.residentialAddress = 'Residential address is required';
    }

    if (stepNum === 2) {
      if (!formData.businessName.trim()) stepErrors.businessName = 'Business Name is required';
      if (!formData.regNumber.trim()) stepErrors.regNumber = 'Registration Number is required';
      if (!formData.position.trim()) {
        stepErrors.position = 'Your Position is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.position.trim())) {
        stepErrors.position = 'Your Position / Role should contain letters only';
      }
      if (!formData.regDate) stepErrors.regDate = 'Registration Date is required';
      if (!formData.expiryDate) stepErrors.expiryDate = 'Expiry Date is required';
      if (!formData.businessPhone.trim()) {
        stepErrors.businessPhone = 'Business Phone is required';
      } else if (/[a-zA-Z]/.test(formData.businessPhone)) {
        stepErrors.businessPhone = 'Business Phone number should contain numbers only';
      }
      if (!formData.businessAddress.trim()) stepErrors.businessAddress = 'Business Registered Address is required';
    }

    if (stepNum === 3) {
      if (!formData.premiseAddress.trim()) stepErrors.premiseAddress = 'Premise address is required';
      if (!formData.postcode.trim()) {
        stepErrors.postcode = 'Postcode is required';
      } else if (formData.postcode.trim().length !== 5) {
        stepErrors.postcode = 'Postcode must be exactly 5 digits';
      }
      if (!formData.cityDistrict.trim()) stepErrors.cityDistrict = 'Postcode is invalid or not detected';
      if (!formData.premiseType) {
        stepErrors.premiseType = 'Premise Type is required';
      } else if (formData.premiseType === 'Other' && !formData.otherPremiseType.trim()) {
        stepErrors.otherPremiseType = 'Please specify your premise type';
      }
      if (!formData.floorLevel.trim()) stepErrors.floorLevel = 'Floor Level is required';
    }

    if (stepNum === 4) {
      if (!formData.primaryType) stepErrors.primaryType = 'Primary Category is required';
      if (!formData.quantityCapacity.trim()) stepErrors.quantityCapacity = 'Capacity is required';
      if (!formData.quantityUnit) stepErrors.quantityUnit = 'Capacity Unit is required';
      if (!formData.requestedDuration.trim()) {
        stepErrors.requestedDuration = 'Requested duration is required';
      } else {
        const val = parseInt(formData.requestedDuration);
        if (isNaN(val) || val < 1 || val > 12) {
          stepErrors.requestedDuration = 'Duration must be between 1 and 12 months';
        }
      }
      if (!formData.operatingHoursStart) stepErrors.operatingHoursStart = 'Start time is required';
      if (!formData.operatingHoursEnd) stepErrors.operatingHoursEnd = 'End time is required';
    }

    if (stepNum === 5) {
      const requiredDocs = ['passportPhoto', 'icCopy', 'businessReg', 'tenancyAgreement'];
      requiredDocs.forEach((docKey) => {
        const file = documents[docKey];
        if (!file) {
          stepErrors[docKey] = 'This document is required';
        } else if (file.status === 'uploading') {
          stepErrors[docKey] = 'Please wait for file scanning to complete';
        }
      });
    }

    if (stepNum === 6) {
      if (!formData.signatoryName.trim()) stepErrors.signatoryName = 'Signatory name is required';
      if (!formData.signatoryIc.trim()) stepErrors.signatoryIc = 'Signatory IC/Passport is required';
      if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
      if (!formData.acceptedDeclaration) stepErrors.acceptedDeclaration = 'You must accept the legal declaration';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Next Action
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Back Action
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Save Draft Action
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

  // Save Draft & Exit
  const handleSaveAndExit = () => {
    handleSaveDraft();
    router.push('/applicant/dashboard');
  };

  const [referenceId, setReferenceId] = useState<string>('');

  // Submit Action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(6)) {
      setReferenceId(`ENT-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitted(true);
      // Clean draft
      localStorage.removeItem('adp_wizard_draft');
    }
  };

  // Return home / dashboard
  const handleExit = () => {
    router.push('/applicant/dashboard');
  };

  // Sub-title context boxes based on step
  const getContextInfoBox = () => {
    switch (currentStep) {
      case 1:
        return 'Ensure your Full Name and Identity Card / Passport details match exactly with the submitted identification documents in Step 5.';
      case 2:
        return 'Please ensure your SSM Registration number is active and matches legal records. Expired business profiles will require manual override.';
      case 3:
        return 'Enter the physical location of the entertainment. The system auto-resolves District and Postcode mapping to check zoning requirements.';
      case 4:
        return 'Entertainment types have varying fee structures and operating permits. Standard permits allow operating hours up to 02:00 AM.';
      case 5:
        return 'Files are processed instantly. Our AI scanner detects text legibility, company seals, and signatures. Review flagged alerts before submission.';
      default:
        return 'Double-check all information before signing. Once submitted, your application will enqueue in the officer portal queue and cannot be edited.';
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-background">
        <TopNav />
        <div className="flex items-center justify-center flex-1 p-4">
          <Card className="w-full max-w-[540px] text-center shadow-lg border border-border-muted p-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Application Submitted Successfully</h1>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">
              Your entertainment license application has been registered under Reference ID:{' '}
              <code className="bg-surface-container px-2 py-0.5 rounded text-primary font-mono font-semibold text-xs">
                {referenceId}
              </code>
            </p>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              A <strong>VerificationJobPayload</strong> has been enqueued to the AI Processing Engine. You can track automated scans and officer approvals on your dashboard.
            </p>
            <div className="mt-8 flex justify-center">
              <Button onClick={handleExit} className="px-6 py-2.5">
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <TopNav />
      <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Top Wizard Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4 flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold text-text-muted">Entertainment Licensing</span>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">License Application Intake</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button variant="ghost" className="text-error border border-error/25 hover:bg-error/5" onClick={handleSaveAndExit}>
            Save & Exit
          </Button>
        </div>
      </div>

      {/* Save Draft Transient Toast Notification */}
      {saveDraftMessage && (
        <div className="bg-success/5 border border-success/20 text-success text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {saveDraftMessage}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Stepper column */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <WizardStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          {/* Contextual Info Box */}
          <div className="bg-primary/5 border border-primary-container/10 p-4 rounded-lg flex gap-3 text-xs leading-relaxed text-text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <p className="font-semibold text-primary uppercase tracking-wider mb-0.5">Information Tip</p>
              <p>{getContextInfoBox()}</p>
            </div>
          </div>
        </div>

        {/* Content Form column */}
        <form onSubmit={handleSubmit} className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <Card className="shadow-sm border border-border-muted p-6 md:p-8 bg-white min-h-[400px]">
            {/* Step renders */}
            {currentStep === 1 && (
              <Step1ApplicantInfo
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
            {currentStep === 2 && (
              <Step2BusinessInfo
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
            {currentStep === 3 && (
              <Step3PremiseInfo
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
            {currentStep === 4 && (
              <Step4EntertainmentDetails
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
            {currentStep === 5 && (
              <Step5DocumentUpload
                documents={documents}
                errors={errors}
                onUploadFile={handleUploadFile}
                onDeleteFile={handleDeleteFile}
              />
            )}
            {currentStep === 6 && (
              <Step6Declaration
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
          </Card>

          {/* Form Actions Footer */}
          <div className="flex justify-between items-center bg-white border border-border-muted px-6 py-4 rounded-lg shadow-sm">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Previous
                </Button>
              )}
            </div>

            <div>
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex gap-2"
                >
                  Next Step
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex gap-2 bg-success text-white hover:bg-success/90"
                >
                  Submit Application
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};
