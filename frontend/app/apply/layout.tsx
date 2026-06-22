"use client";

import React from 'react';
import { WizardProvider, useWizard } from '@/src/features/wizard/presentation/WizardContext';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { TopNav } from '@/src/shared/components/TopNav';
import { WizardStepper } from '@/src/features/wizard/presentation/components/WizardStepper';

function WizardLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    currentStep,
    completedSteps,
    saveDraftMessage,
    isSubmitted,
    referenceId,
    handleSaveDraft,
    handleSaveAndExit,
    handleBack,
    handleNext,
    handleSubmit,
    handleExit,
  } = useWizard();

  const steps = [
    { number: 1, title: 'Applicant Info', description: 'Personal details and credentials' },
    { number: 2, title: 'Business Info', description: 'Registered entity information' },
    { number: 3, title: 'Premise Info', description: 'Location and establishment details' },
    { number: 4, title: 'Entertainment Details', description: 'Operating category and hours' },
    { number: 5, title: 'Document Upload', description: 'Upload verified supporting files' },
    { number: 6, title: 'Declaration', description: 'Legal undertaking and sign-off' },
  ];

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
              {children}
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
}

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <WizardLayoutContent>{children}</WizardLayoutContent>
    </WizardProvider>
  );
}
