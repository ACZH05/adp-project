"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { SideNav } from './SideNav';
import { DetailsPanel } from './DetailsPanel';
import { AIAnalysisCard } from './AIAnalysisCard';
import { DecisionPanel } from './DecisionPanel';
import { DocumentViewerModal } from './DocumentViewerModal';
import { mockApplications } from '../data/mockApplications';
import { getApplicationDetails, ApplicationDetail, DocumentDetail, AuditLogEntry } from '../data/mockApplicationDetails';

interface ReviewApplicationScreenProps {
  id: string;
}

export const ReviewApplicationScreen: React.FC<ReviewApplicationScreenProps> = ({ id }) => {
  const [appDetail, setAppDetail] = useState<ApplicationDetail | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setIsLoading(true);
  }

  useEffect(() => {
    // Simulate API loading from mock database
    const timer = setTimeout(() => {
      // Find the general application record first
      const generalApp = mockApplications.find(a => a.id === id);
      if (generalApp) {
        const detail = getApplicationDetails(generalApp);
        setAppDetail(detail);
      } else {
        // Create a fake default case if an arbitrary ID is searched or accessed
        const dummyApp = {
          id,
          applicantName: "Unknown Applicant",
          licenseType: "Entertainment License",
          submissionDate: new Date().toISOString().slice(0, 10),
          status: "Pending" as const,
          aiConfidence: 50,
          isUrgent: false
        };
        const detail = getApplicationDetails(dummyApp);
        setAppDetail(detail);
      }
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleDecision = (
    newStatus: ApplicationDetail['status'],
    actionName: string,
    notes: string
  ) => {
    if (!appDetail) return;

    // Build new audit trail entry
    const newLog: AuditLogEntry = {
      id: `LOG-NEW-${Date.now()}`,
      action: actionName,
      user: "Officer Tan (Senior Reviewer)",
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      notes
    };

    // Update local state
    const updatedDetails: ApplicationDetail = {
      ...appDetail,
      status: newStatus,
      auditLogs: [newLog, ...appDetail.auditLogs]
    };

    // Reflect status updates in the global mock database for this session
    const idx = mockApplications.findIndex(a => a.id === appDetail.id);
    if (idx !== -1) {
      mockApplications[idx].status = newStatus;
    }

    setAppDetail(updatedDetails);
    
    if (newStatus === 'Processed') {
      showToast(`Case approved successfully! Notification sent to applicant.`, 'success');
    } else if (actionName.includes('Correction')) {
      showToast(`Correction request submitted to ${appDetail.applicantName}.`, 'info');
    } else {
      showToast(`Application rejected. Audit files locked.`, 'error');
    }
  };

  const handleOpenDoc = (doc: DocumentDetail) => {
    setSelectedDoc(doc);
  };

  const handleCloseDoc = () => {
    setSelectedDoc(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <SideNav activePath="/officer/queue" />

      {/* Spacer to prevent main content from sliding under the fixed sidebar on desktop */}
      <div className="hidden lg:block w-64 shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto gap-6 overflow-hidden">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <Link href="/officer/queue" className="hover:text-primary transition-colors">
              Officer Portal
            </Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/officer/queue" className="hover:text-primary transition-colors">
              Application Queue
            </Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-text-main">Review Case: {id}</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <Link
                href="/officer/queue"
                className="w-8 h-8 rounded-full border border-border-muted hover:border-primary/30 flex items-center justify-center text-text-muted hover:text-primary transition-colors bg-white shadow-sm shrink-0"
                aria-label="Return to queue"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
                Review Application
              </h1>
            </div>
            <span className="text-xs font-semibold text-text-muted">
              Processing Mode: <span className="font-bold text-info">Manual Audit</span>
            </span>
          </div>
        </div>

        {/* Dynamic State Rendering */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            <p className="text-sm text-text-muted font-semibold">Retrieving secure file details...</p>
          </div>
        ) : !appDetail ? (
          <div className="flex-1 bg-white border border-border-muted rounded-lg p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-primary">Case Not Found</h2>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              {"We couldn't retrieve detailed records for application "}<span className="font-mono">{id}</span>. {"It may have been deleted or expired."}
            </p>
            <Link
              href="/officer/queue"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-default transition-colors"
            >
              Back to Application Queue
            </Link>
          </div>
        ) : (
          /* Three-Panel Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 overflow-y-auto pr-1">
            {/* Left Panel: Details and Documents */}
            <div className="lg:col-span-4 h-full">
              <DetailsPanel
                application={appDetail}
                onViewDocument={handleOpenDoc}
              />
            </div>

            {/* Middle Panel: AI Analysis Findings */}
            <div className="lg:col-span-4 h-full">
              <AIAnalysisCard application={appDetail} />
            </div>

            {/* Right Panel: Notes and Decisions */}
            <div className="lg:col-span-4 h-full">
              <DecisionPanel
                application={appDetail}
                onDecision={handleDecision}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white text-text-main text-sm font-semibold rounded-default shadow-lg border border-border-muted animate-slide-up">
          {toast.type === 'success' && (
            <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-5 h-5 shrink-0 relative flex items-center justify-center">
              {/* Spinner track */}
              <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#CBD5E1" strokeWidth="2.5" />
                <path
                  d="M10 2 A8 8 0 0 1 18 10"
                  stroke="#0369A1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Document Viewer Modal Overlay */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={handleCloseDoc}
        />
      )}
    </div>
  );
};
