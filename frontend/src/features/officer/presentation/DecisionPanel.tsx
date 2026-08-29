"use client";

import React, { useState } from 'react';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { ApplicationDetail } from '../data/mockApplicationDetails';
import { generateOutcomeReportPDF } from '../utils/reportGenerator';

interface DecisionPanelProps {
  application: ApplicationDetail;
  onDecision: (
    newStatus: ApplicationDetail['status'],
    actionName: string,
    notes: string,
    reason?: string
  ) => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ application, onDecision }) => {
  const [notes, setNotes] = useState(application.auditLogs[0]?.notes || '');
  const [modalType, setModalType] = useState<'correction' | 'rejection' | null>(null);
  const [reason, setReason] = useState('');

  // States for Outcome Report generation (UC025)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleApprove = () => {
    if (confirm("Are you sure you want to APPROVE this application? This will finalize the case.")) {
      onDecision('Processed', 'Application Approved', notes || 'Approved after audit review.');
    }
  };

  const handleOpenModal = (type: 'correction' | 'rejection') => {
    setReason('');
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    if (modalType === 'correction') {
      onDecision('Flagged', 'Correction Requested', notes || 'Correction requested by reviewing officer.', reason);
    } else {
      onDecision('Rejected', 'Application Rejected', notes || 'Application rejected by reviewing officer.', reason);
    }

    setModalType(null);
  };

  const handleGenerateReport = () => {
    const isFinalState = application.status === 'Processed' || application.status === 'Rejected';
    if (!isFinalState) {
      alert("Error: Outcome reports can only be generated for finalized cases (Approved or Rejected).");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    setTimeout(() => {

      try {
        generateOutcomeReportPDF(application);
        
        onDecision(
          application.status,
          'Outcome Report Generated',
          `Outcome report in PDF format successfully generated and downloaded (Ref ID: ${application.id}).`
        );
        
        setIsGenerating(false);
      } catch (err: any) {
        setGenerateError(err?.message || "An unexpected error occurred during PDF generation.");
        setIsGenerating(false);
      }
    }, 1500);
  };

  const isFinalState = application.status === 'Processed' || application.status === 'Rejected';
  const isProcessed = application.status === 'Processed';

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Officer Notes Card */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Internal Review Notes</h3>
        <textarea
          rows={5}
          disabled={isFinalState}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add observations, call logs, or verification notes..."
          className="w-full p-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-text-muted/60 font-medium"
        />
        {!isFinalState && (
          <span className="text-[10px] text-text-muted font-medium italic -mt-1">
            Notes will be saved and recorded in the audit history upon executing a decision.
          </span>
        )}
      </Card>

      {/* Decision Card */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Officer Decision</h3>

        {isFinalState ? (
          application.status === 'Processed' ? (
            <div className="p-4 bg-success/5 border border-success/20 rounded-default flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-success">Application Approved</h4>
                <p className="text-xs text-text-muted mt-0.5 font-semibold">Processed on {new Date().toISOString().slice(0, 10)}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-error/5 border border-error/20 rounded-default flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-error">Application Rejected</h4>
                <p className="text-xs text-text-muted mt-0.5 font-semibold">Rejected on {new Date().toISOString().slice(0, 10)}</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleApprove}
              variant="primary"
              className="w-full justify-center h-11 py-0 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Approve Application
            </Button>

            {/* Request Correction — Red-outline per spec */}
            <button
              onClick={() => handleOpenModal('correction')}
              className="w-full justify-center h-11 flex items-center rounded-default border border-error text-error bg-transparent hover:bg-error/5 text-sm font-semibold transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Request Correction
            </button>

            {/* Reject — Ghost per spec */}
            <button
              onClick={() => handleOpenModal('rejection')}
              className="w-full justify-center h-11 flex items-center rounded-default border-0 text-text-muted bg-transparent hover:text-error hover:bg-error/5 text-sm font-semibold transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Reject Case
            </button>
          </div>
        )}
      </Card>

      {/* Outcome Report Card */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Outcome Report</h3>
        
        {generateError && (
          <div className="p-3 bg-error/5 border border-error/20 rounded-default text-xs text-error flex flex-col gap-2 font-medium">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{generateError}</span>
            </div>
            <button
              onClick={handleGenerateReport}
              className="text-[10px] uppercase font-bold tracking-wider text-white bg-error px-2 py-1.5 rounded-default self-start hover:bg-error/90 transition-colors cursor-pointer"
            >
              Retry Generation
            </button>
          </div>
        )}

        {isGenerating ? (
          <div className="flex items-center justify-center py-4 gap-3">
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-bold text-text-muted">Generating secure PDF report...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGenerateReport}
              disabled={!isFinalState}
              variant={isFinalState ? "primary" : "secondary"}
              className={`w-full justify-center h-10 py-0 cursor-pointer ${
                !isFinalState ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Generate Outcome Report
            </Button>
            {!isFinalState && (
              <span className="text-[10px] text-text-muted font-medium italic text-center">
                Action disabled. Reports can only be generated for Approved or Rejected applications.
              </span>
            )}
            {isFinalState && (
              <span className="text-[10px] text-success font-medium italic text-center">
                Case finalized. Select option to generate a permanent machine-readable PDF outcome report.
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Audit History Timeline */}
      <Card padding={false} className="bg-white border border-border-muted shadow-sm flex flex-col gap-4 flex-1 min-h-[200px] py-6">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-6">Case History & Audit</h3>
        <div className="overflow-y-auto max-h-[300px] pl-[17px] pr-6">
          <div className="relative py-1 flex flex-col gap-5">
            {/* Timeline Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200 pointer-events-none" />
            {application.auditLogs.map((log) => (
              <div key={log.id} className="relative pl-6 flex flex-col gap-1 text-xs">
                {/* Timeline marker */}
                <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-primary shrink-0 flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-text-main">{log.action}</span>
                  <span className="text-[10px] text-text-muted font-semibold">{log.timestamp}</span>
                </div>
                <span className="text-[10px] text-text-muted font-medium">By: {log.user}</span>
                {log.notes && (
                  <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded text-[11px] text-text-muted leading-relaxed whitespace-pre-wrap font-medium">
                    {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Decision Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>

          {/* Modal content */}
          <div className="bg-white border border-border-muted rounded-lg shadow-xl max-w-md w-full z-10 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-surface-container">
              <h3 className="font-bold text-primary text-base">
                {modalType === 'correction' ? 'Request Correction' : 'Reject Application'}
              </h3>
              <button onClick={handleCloseModal} className="text-text-muted hover:text-text-main">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">
                  {modalType === 'correction' ? 'Mandatory Reason for Correction' : 'Mandatory Rejection Reason'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    modalType === 'correction'
                      ? 'e.g. The uploaded SSM business registration profile is expired. Please upload a profile showing active status.'
                      : 'e.g. The application does not satisfy zoning directives for commercial entertainment in residential areas.'
                  }
                  className="w-full p-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-xs font-semibold border border-border-muted text-text-muted hover:bg-slate-50 rounded-default"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim()}
                  className={`
                    px-4 py-2.5 text-xs font-semibold text-white rounded-default transition-colors
                    ${modalType === 'correction'
                      ? 'bg-primary hover:bg-primary-container disabled:bg-primary/40'
                      : 'bg-error hover:bg-error/90 disabled:bg-error/40'}
                  `}
                >
                  Submit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
