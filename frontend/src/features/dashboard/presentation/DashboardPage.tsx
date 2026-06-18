"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';

export const DashboardPage: React.FC = () => {
  const router = useRouter();

  const handleStartWizard = () => {
    router.push('/wizard');
  };

  const timelineEvents = [
    { label: 'Application Submitted', date: 'June 16, 2026', desc: 'Enqueued in AI Processing Engine', active: true, done: true },
    { label: 'AI Pre-Verification', date: 'June 16, 2026', desc: 'Document checks complete (45% confidence)', active: true, done: true },
    { label: 'Officer Case Assignment', date: 'Pending', desc: 'Waiting for municipal officer review', active: true, done: false },
    { label: 'Municipal Premises Audit', date: 'Scheduled', desc: 'Pending office inspection approval', active: false, done: false },
  ];

  return (
    <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4 flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold text-text-muted">Applicant Portal</span>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">Application Dashboard</h1>
        </div>
        <div>
          <Button onClick={handleStartWizard} className="flex gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
          {/* AI Banner */}
          <div className="bg-amber/5 border border-warning/10 p-5 rounded-lg flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm font-bold text-warning uppercase tracking-wide">AI Verification in Progress</h3>
                <span className="text-xs font-bold text-text-muted">45% Complete</span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                AI scanner has resolved your business info but flagged one low-confidence document. Officer review will commence shortly.
              </p>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-warning h-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card className="border border-border-muted p-5 bg-white">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Required Documents</span>
              <h2 className="text-2xl font-bold text-primary mt-1">3 / 4 Approved</h2>
              <p className="text-xs text-text-muted mt-1.5 leading-normal">
                Tenancy agreement has been flagged for manual confirmation due to low signature resolution.
              </p>
            </Card>

            <Card className="border border-border-muted p-5 bg-white">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Payments & Fees</span>
              <h2 className="text-2xl font-bold text-primary mt-1">RM 250.00</h2>
              <p className="text-xs text-success bg-success/10 px-2 py-0.5 rounded font-semibold inline-block mt-2">
                Payment Confirmed
              </p>
            </Card>
          </div>

          {/* Action Card */}
          <Card className="border border-border-muted p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-text-main">Upcoming Premises Inspection</h3>
              <p className="text-xs text-text-muted mt-1 max-w-md">
                Premises audits are automatically scheduled upon document approval. Review municipal checklist guidelines to prepare.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed text-xs">
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
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Activity Timeline</h3>

          <div className="flex flex-col relative pl-4 mt-2">
            <div className="absolute left-[7px] top-4 bottom-4 w-[1px] bg-border-muted" />

            <div className="flex flex-col gap-6">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative flex gap-3 items-start">
                  <div className={`
                    w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center z-10 -ml-[13px]
                    ${evt.done ? 'border-success text-success' : evt.active ? 'border-primary' : 'border-border-muted'}
                  `}>
                    {evt.done && (
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${evt.done ? 'text-success' : evt.active ? 'text-text-main' : 'text-text-muted'}`}>
                      {evt.label}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5">{evt.date}</span>
                    <p className="text-[11px] text-text-muted mt-1 leading-normal">{evt.desc}</p>
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
