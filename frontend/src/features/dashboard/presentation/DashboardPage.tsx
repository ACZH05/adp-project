"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/shared/components/Card";
import { Button } from "@/src/shared/components/Button";
import { APPLICANT_ROUTES } from "@/src/features/applicant/data/applicantConstants";

export const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [latestApplication, setLatestApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('adp_user_email') || 'test@example.com';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

    fetch(`${apiUrl}/applications?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllApplications(data);
          setLatestApplication(data[0]); // Newest application
        }
      })
      .catch(err => {
        console.error('Failed to load dashboard application:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartWizard = () => {
    router.push(APPLICANT_ROUTES.applyStart);
  };

  const getTimelineEvents = (app: any) => {
    if (!app) return [];
    const isSubmitted =
      app.status === 'submitted' ||
      app.status === 'verification_queued' ||
      app.status === 'verifying' ||
      app.status === 'verified' ||
      app.status === 'flagged';
    const isApproved = app.status === 'verified';

    const dateStr = new Date(app.submissionDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return [
      {
        label: "Application Draft Created",
        date: dateStr,
        desc: "Draft created and saved in the portal database.",
        done: true,
        active: !isSubmitted,
      },
      {
        label: "Verification Submitted",
        date: isSubmitted ? dateStr : "Pending",
        desc: "Submitted for municipal approval and AI verification queue.",
        done: isSubmitted,
        active: isSubmitted && !isApproved,
      },
      {
        label: "AI Document Audit & Match",
        date: isSubmitted ? dateStr : "Pending",
        desc: isSubmitted
          ? "AI engine scans uploaded PDFs and matches forms."
          : "Audit will run immediately upon application submission.",
        done: isSubmitted && app.status !== 'submitted' && app.status !== 'verification_queued' && app.status !== 'verifying',
        active: isSubmitted && (app.status === 'submitted' || app.status === 'verification_queued' || app.status === 'verifying'),
      },
      {
        label: "Final License Review",
        date: isApproved ? dateStr : "Pending",
        desc: "Municipal officer final approval and license printing.",
        done: isApproved,
        active: isApproved,
      },
    ];
  };

  if (loading) {
    return (
      <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <Card className="border border-border-muted p-12 bg-white text-center flex flex-col items-center justify-center gap-2">
          <span className="text-sm font-semibold text-text-muted">Loading dashboard...</span>
        </Card>
      </div>
    );
  }

  if (!latestApplication) {
    return (
      <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-muted pb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">
              Application Dashboard
            </h1>
          </div>
        </div>
        <Card className="border border-border-muted p-12 bg-white text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-text-muted">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 17h6" />
              <path d="M9 13h6" />
              <path d="M9 9h6" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-text-main">No Active Application</h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Start a new license application to view your AI verification progress and timeline here.
            </p>
          </div>
          <Button onClick={handleStartWizard} className="text-xs mt-2">
            Apply for New License
          </Button>
        </Card>
      </div>
    );
  }

  const timelineEvents = getTimelineEvents(latestApplication);

  return (
    <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">
            Application Dashboard
          </h1>
          <span className="text-xs font-semibold text-text-muted">
            {latestApplication.licenseType} - Ref #{latestApplication.applicationNo || latestApplication.id.substring(0, 8)}
          </span>
        </div>
        <div>
          <Button onClick={handleStartWizard} className="flex gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Apply for New License
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Dashboard Content) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Draft Banner */}
          {latestApplication.status === 'draft' && (
            <div className="bg-primary/5 border border-primary/10 p-5 rounded-lg flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div className="w-full">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                  Application Draft Saved
                </h3>
                <p className="text-sm text-text-muted mt-1">
                  You have a saved draft application. Resume the form to upload documents and submit for verification.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={() => {
                      const draftPayload = {
                        applicationId: latestApplication.id,
                        applicationVersionId: latestApplication.applicationVersionId,
                        ...latestApplication.formSnapshot,
                      };
                      localStorage.setItem('adp_wizard_draft', JSON.stringify(draftPayload));
                      router.push(APPLICANT_ROUTES.applyStart);
                    }}
                    className="text-xs px-4 py-2"
                  >
                    Resume Application
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Approved Applications Collection Banners */}
          {allApplications.filter(app => app.status === 'approved' || app.status === 'verified' || app.status === 'verification_complete').map((app) => (
            <div key={app.id} className="bg-success/10 border border-success/30 p-5 rounded-lg flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-success uppercase tracking-wide">
                    Application Approved! Physical License Collection Required
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-success/20 text-success">
                    Ready for Collection
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-medium">
                  Your license application (<strong className="text-text-main">{app.licenseType || app.entertainmentType || 'Entertainment License'}</strong> — Ref: <span className="font-mono font-bold text-primary">{app.applicationNo || app.id}</span>) has been officially approved. 
                  <strong className="text-text-main"> Please visit the District Licensing Office counter to collect your physical license certificate.</strong>
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <Button
                    onClick={() => router.push('/applicant/appointments')}
                    className="bg-success text-white hover:bg-success/90 text-xs py-2 px-4 flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Schedule Office Collection Visit
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* AI Banner for submitted applications */}
          {(latestApplication.status === 'submitted' ||
            latestApplication.status === 'verification_queued' ||
            latestApplication.status === 'verifying') && (
            <div className="bg-amber/5 border border-warning/10 p-5 rounded-lg flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-warning uppercase tracking-wide">
                    AI Verification in Progress
                  </h3>
                   <span className="text-xs font-bold text-warning animate-pulse">
                    Scanning...
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-1">
                  AI scanner is currently analyzing your business license documents and cross-matching fields.
                </p>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-warning h-full animate-pulse" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card className="border border-border-muted p-5 bg-white">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Required Documents
              </span>
              <h2 className="text-2xl font-bold text-primary mt-1">
                {latestApplication.documents.approved} / {latestApplication.documents.total} Uploaded
              </h2>
              <p className="text-xs text-text-muted mt-1.5 leading-normal">
                {latestApplication.status === 'draft'
                  ? 'Please resume your draft to upload the four required licensing documents.'
                  : 'AI auditor is matching uploaded documentation snapshots with SSM registration data.'}
              </p>
            </Card>

            <Card className="border border-border-muted p-5 bg-white">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Payments & Fees
              </span>
              <h2 className="text-2xl font-bold text-primary mt-1">
                RM 250.00
              </h2>
              <p className={`text-xs px-2 py-0.5 rounded font-semibold inline-block mt-2 ${latestApplication.status === 'draft' ? 'text-text-muted bg-surface-container' : 'text-success bg-success/10'}`}>
                {latestApplication.status === 'draft' ? 'Payment Pending' : 'Payment Confirmed'}
              </p>
            </Card>
          </div>

          {/* Action Card */}
          <Card className="border border-border-muted p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-text-main">
                Upcoming Premises Inspection
              </h3>
              <p className="text-xs text-text-muted mt-1 max-w-md">
                Premises audits are automatically scheduled upon document
                approval. Review municipal checklist guidelines to prepare.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled
                className="opacity-50 cursor-not-allowed text-xs"
              >
                Reschedule
              </Button>
              <Button variant="secondary" className="text-xs">
                Prepare
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar Activity Timeline) */}
        <Card className="md:col-span-4 border border-border-muted p-6 bg-white flex flex-col gap-5">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
            Activity Timeline
          </h3>

          <div className="flex flex-col relative pl-4 mt-2">
            <div className="absolute left-1.75 top-4 bottom-4 w-px bg-border-muted" />

            <div className="flex flex-col gap-6">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative flex gap-3 items-start">
                  <div
                    className={`
                    w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center z-10 -ml-3.25
                    ${evt.done ? "border-success text-success" : evt.active ? "border-primary" : "border-border-muted"}
                  `}
                  >
                    {evt.done && (
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold ${evt.done ? "text-success" : evt.active ? "text-text-main" : "text-text-muted"}`}
                    >
                      {evt.label}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      {evt.date}
                    </span>
                    <p className="text-[11px] text-text-muted mt-1 leading-normal">
                      {evt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
