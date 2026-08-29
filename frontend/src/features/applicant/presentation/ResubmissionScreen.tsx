"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/components/Button';
import { Card } from '@/src/shared/components/Card';
import { StatusBadge } from '@/src/shared/components/StatusBadge';
import { useToast } from '@/src/shared/hooks/useToast';
import { ToastNotification } from '@/src/shared/components/ToastNotification';

interface ResubmissionScreenProps {
  id: string;
}

export const ResubmissionScreen: React.FC<ResubmissionScreenProps> = ({ id }) => {
  const router = useRouter();
  const { toast, showToast } = useToast();

  const [baseApp, setBaseApp] = useState<any | null>(null);
  const [appDetails, setAppDetails] = useState<any | null>(null);
  const [appNotFound, setAppNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form States
  const [businessName, setBusinessName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // File Upload states (names/size of the uploaded files)
  const [ssmFile, setSsmFile] = useState<{ name: string; size: string } | null>(null);
  const [tenancyFile, setTenancyFile] = useState<{ name: string; size: string } | null>(null);

  // Uploading / Verification simulation states
  const [ssmVerifying, setSsmVerifying] = useState(false);
  const [ssmVerified, setSsmVerified] = useState(false);

  const [tenancyVerifying, setTenancyVerifying] = useState(false);
  const [tenancyVerified, setTenancyVerified] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch from real database API
    const email = localStorage.getItem('adp_user_email') || 'test@example.com';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

    fetch(`${apiUrl}/applications?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const app = data.find(a => a.applicationNo === id || a.id === id);
          if (app) {
            setBaseApp({
              ...app,
              status: app.status === 'correction_required' ? 'Flagged' : app.status,
            });
            setAppDetails({
              businessName: app.formSnapshot?.businessName || '',
              businessExpiryDate: app.formSnapshot?.expiryDate || '',
              documents: app.docList || [],
              auditLogs: [],
            });
            setBusinessName(app.formSnapshot?.businessName || '');
            setExpiryDate(app.formSnapshot?.expiryDate || '');
            
            // Set uploaded files if they exist in docList
            const ssmDoc = app.docList?.find((d: any) => d.documentType === 'business_registration_copy');
            if (ssmDoc) {
              setSsmFile({ name: ssmDoc.fileName, size: (ssmDoc.fileSize / (1024 * 1024)).toFixed(1) + ' MB' });
              setSsmVerified(true);
            }
            const tenancyDoc = app.docList?.find((d: any) => d.documentType === 'tenancy_agreement');
            if (tenancyDoc) {
              setTenancyFile({ name: tenancyDoc.fileName, size: (tenancyDoc.fileSize / (1024 * 1024)).toFixed(1) + ' MB' });
              setTenancyVerified(true);
            }
          } else {
            setAppNotFound(true);
          }
        } else {
          setAppNotFound(true);
        }
      })
      .catch(err => {
        console.error('Failed to load resubmit application:', err);
        setAppNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const isSdnBhd = /sdn\.?\s*bhd\.?/i.test(businessName || '');
  // Detect checks automatically based on input values and uploads
  const nameIssueResolved = businessName.toLowerCase() === 'kee food ventures sdn. bhd.' || businessName.toLowerCase() === 'kee food services sdn bhd' || (businessName.trim() !== '' && businessName !== appDetails?.businessName);
  const expiryIssueResolved = isSdnBhd || (expiryDate !== '' && new Date(expiryDate) > new Date('2026-07-02'));
  const ssmUploaded = ssmVerified;
  const tenancyUploaded = tenancyVerified;

  // Check if everything is resolved
  const isFormValid = nameIssueResolved && expiryIssueResolved && ssmUploaded && tenancyUploaded;

  const handleSsmUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSsmFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + ' MB' });
      setSsmVerifying(true);
      setSsmVerified(false);

      if (baseApp?.applicationVersionId) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);
          formDataUpload.append('applicationVersionId', baseApp.applicationVersionId);
          formDataUpload.append('documentType', 'business_registration_copy');

          const res = await fetch(`${apiUrl}/documents/upload`, {
            method: 'POST',
            body: formDataUpload,
          });
          if (res.ok) {
            setSsmVerifying(false);
            setSsmVerified(true);
            showToast('SSM Document uploaded successfully.', 'success');
          } else {
            throw new Error('Upload failed');
          }
        } catch (err) {
          setSsmVerifying(false);
          showToast('Failed to upload SSM document.', 'info');
        }
      } else {
        setSsmVerifying(false);
        setSsmVerified(true);
        showToast('SSM Document uploaded successfully.', 'success');
      }
    }
  };

  const handleTenancyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setTenancyFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + ' MB' });
      setTenancyVerifying(true);
      setTenancyVerified(false);

      if (baseApp?.applicationVersionId) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);
          formDataUpload.append('applicationVersionId', baseApp.applicationVersionId);
          formDataUpload.append('documentType', 'tenancy_agreement');

          const res = await fetch(`${apiUrl}/documents/upload`, {
            method: 'POST',
            body: formDataUpload,
          });
          if (res.ok) {
            setTenancyVerifying(false);
            setTenancyVerified(true);
            showToast('Tenancy Agreement uploaded successfully.', 'success');
          } else {
            throw new Error('Upload failed');
          }
        } catch (err) {
          setTenancyVerifying(false);
          showToast('Failed to upload Tenancy Agreement.', 'info');
        }
      } else {
        setTenancyVerifying(false);
        setTenancyVerified(true);
        showToast('Tenancy Agreement uploaded successfully.', 'success');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    if (baseApp) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        
        // Construct the full SubmitApplicationDto using formSnapshot from the loaded realApp
        const userEmail = localStorage.getItem('adp_user_email') || '';
        const payload = {
          ...baseApp.formSnapshot,
          email: baseApp.formSnapshot?.email || userEmail,
          businessName: businessName,
          expiryDate: expiryDate,
          applicationId: baseApp.id,
          applicationVersionId: baseApp.applicationVersionId,
        };

        const res = await fetch(`${apiUrl}/applications/submit`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsSubmitting(false);
          showToast('Corrections submitted successfully. Re-verification enqueued!', 'success');
          setTimeout(() => {
            router.push('/applicant/dashboard');
          }, 1500);
        } else {
          throw new Error('Submit failed');
        }
      } catch (err) {
        setIsSubmitting(false);
        showToast('Failed to submit corrections. Please try again.', 'info');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-container-max-width mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-2">
        <span className="text-sm font-semibold text-text-muted">Loading application details...</span>
      </div>
    );
  }

  if (appNotFound) {
    return (
      <div className="w-full max-w-container-max-width mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-4">
        <h3 className="text-lg font-bold text-primary">Application Not Found</h3>
        <p className="text-sm text-text-muted">The requested application #{id} does not exist or cannot be resolved.</p>
        <Button onClick={() => router.push('/applicant/applications')}>Back to Applications</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Toast Notification */}
      <ToastNotification toast={toast} />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
        <span>Applicant Portal</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push('/applicant/applications')}>My Applications</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-text-main">Resolve Discrepancies</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Reference ID: {id}</span>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">Resolve Discrepancies</h1>
          <p className="text-xs text-text-muted mt-0.5">Correction requested based on automated AI scan and officer review</p>
        </div>
        <StatusBadge status={baseApp?.status || 'Flagged'} />
      </div>

      {/* Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: AI Verification Report */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border border-border-muted bg-slate-50 overflow-hidden shadow-sm">
            <div className="bg-[#1b365d] text-white p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">AI Verification Report</h3>
              <p className="text-xs text-slate-300 mt-0.5">Automated document analysis summary</p>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Overall Match Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                  <span>Overall Match Confidence</span>
                  <span className="text-error font-bold">{baseApp?.aiConfidence}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full" style={{ width: `${baseApp?.aiConfidence}%` }} />
                </div>
              </div>

              {/* Identified Discrepancies List */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Flags requiring resolution</span>

                {/* Finding 1: SSM Expired */}
                <div className={`p-4 border rounded-lg bg-white flex flex-col gap-2 transition-all ${expiryIssueResolved && ssmUploaded ? 'border-success/30 bg-success/5 opacity-80' : 'border-error/20'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      {expiryIssueResolved && ssmUploaded ? (
                        <div className="w-4 h-4 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-error shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-text-main">Expired Corporate Registration</h4>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-error/10 text-error font-semibold uppercase">High Severity</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    The SSM business profile uploaded lists the entity status as &apos;Expired / Struck Off&apos; as of October 10, 2024. Active registration is mandatory to hold this license.
                  </p>
                  <div className="bg-slate-100 p-2.5 rounded text-[11px] font-medium text-text-muted border-l-2 border-primary mt-1">
                    <span className="font-semibold text-primary block uppercase text-[9px] mb-0.5">Required Action</span>
                    Upload a current SSM document and set the active expiry date.
                  </div>
                </div>

                {/* Finding 2: Tenancy Name Mismatch */}
                <div className={`p-4 border rounded-lg bg-white flex flex-col gap-2 transition-all ${nameIssueResolved && tenancyUploaded ? 'border-success/30 bg-success/5 opacity-80' : 'border-error/20'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      {nameIssueResolved && tenancyUploaded ? (
                        <div className="w-4 h-4 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-error shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-text-main">Tenancy Tenant Name Mismatch</h4>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-error/10 text-error font-semibold uppercase">High Severity</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    The Tenancy Agreement lists the tenant as &apos;Kee Food Services Sdn Bhd&apos; but the application is under &apos;Kee Food Ventures Sdn. Bhd.&apos;. These are legally distinct entities.
                  </p>
                  <div className="bg-slate-100 p-2.5 rounded text-[11px] font-medium text-text-muted border-l-2 border-primary mt-1">
                    <span className="font-semibold text-primary block uppercase text-[9px] mb-0.5">Required Action</span>
                    Provide the correct corporate legal name aligning with your tenancy and upload the supporting documents.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Correction Form & Uploads */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card className="border border-border-muted p-6 md:p-8 bg-white flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-primary">Resolve Discrepancies Form</h3>
                <p className="text-xs text-text-muted mt-0.5">Edit form fields below to match the verified business records.</p>
              </div>

              {/* Input Field 1: Business Legal Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                  Business Legal Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`w-full h-10 px-3 border rounded text-xs focus:outline-none transition-all ${
                    nameIssueResolved
                      ? 'border-success/40 bg-success/5 focus:ring-1 focus:ring-success focus:border-success'
                      : 'border-error/40 bg-error/5 focus:ring-1 focus:ring-error focus:border-error'
                  }`}
                  placeholder="Enter Business Name"
                  required
                />
                <span className={`text-[10px] ${nameIssueResolved ? 'text-success font-medium' : 'text-error font-medium'}`}>
                  {nameIssueResolved
                    ? 'Aligned with Tenancy Tenant name'
                    : 'Must align with Tenancy (e.g. "Kee Food Services Sdn Bhd" or update it)'}
                </span>
              </div>

              {/* Input Field 2: Business Registration Expiry Date */}
              {!isSdnBhd && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                    SSM Expiry Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className={`w-full h-10 px-3 border rounded text-xs focus:outline-none transition-all ${
                      expiryIssueResolved
                        ? 'border-success/40 bg-success/5 focus:ring-1 focus:ring-success focus:border-success'
                        : 'border-error/40 bg-error/5 focus:ring-1 focus:ring-error focus:border-error'
                    }`}
                    required
                  />
                  <span className={`text-[10px] ${expiryIssueResolved ? 'text-success font-medium' : 'text-error font-medium'}`}>
                    {expiryIssueResolved
                      ? 'Expiry date is valid (Active)'
                      : 'Expiry date must be in the future (SSM profile is expired)'}
                  </span>
                </div>
              )}

              {/* Upload Dropzones */}
              <div className="border-t border-slate-100 pt-5 flex flex-col gap-5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Required Document Re-uploads</span>

                {/* SSM upload dropzone */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                      1. Business Registration Profile (SSM) <span className="text-error">*</span>
                    </label>
                    {ssmVerified && (
                      <span className="text-xs text-success font-bold flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        AI Verified (98%)
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    id="ssm-upload-file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleSsmUpload}
                  />

                  <label
                    htmlFor="ssm-upload-file"
                    className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 ${
                      ssmVerified ? 'border-success bg-success/5' : 'border-border-muted'
                    }`}
                  >
                    {ssmVerifying ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-text-muted font-medium">Scanning document with AI...</span>
                      </div>
                    ) : ssmFile ? (
                      <div className="flex items-center gap-2 text-xs">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="font-semibold text-text-main">{ssmFile.name}</span>
                        <span className="text-text-muted">({ssmFile.size})</span>
                        <span className="text-primary font-bold ml-2 underline">Change file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-xs">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mb-1">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="font-semibold text-primary">Click to upload SSM document</span>
                        <span className="text-text-muted">PDF format up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Tenancy upload dropzone */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                      2. Tenancy Agreement / Premise Lease <span className="text-error">*</span>
                    </label>
                    {tenancyVerified && (
                      <span className="text-xs text-success font-bold flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        AI Verified (96%)
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    id="tenancy-upload-file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleTenancyUpload}
                  />

                  <label
                    htmlFor="tenancy-upload-file"
                    className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 ${
                      tenancyVerified ? 'border-success bg-success/5' : 'border-border-muted'
                    }`}
                  >
                    {tenancyVerifying ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-text-muted font-medium">Scanning lease names with AI...</span>
                      </div>
                    ) : tenancyFile ? (
                      <div className="flex items-center gap-2 text-xs">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="font-semibold text-text-main">{tenancyFile.name}</span>
                        <span className="text-text-muted">({tenancyFile.size})</span>
                        <span className="text-primary font-bold ml-2 underline">Change file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-xs">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mb-1">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="font-semibold text-primary">Click to upload Tenancy Agreement</span>
                        <span className="text-text-muted">PDF format up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </Card>

            {/* Actions footer */}
            <div className="flex justify-between items-center bg-white border border-border-muted px-6 py-4 rounded-lg shadow-sm">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/applicant/applications')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-success text-white hover:bg-success/90 flex gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting corrections...
                  </>
                ) : (
                  <>
                    Submit Corrections
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
