"use client";

import React, { useState } from 'react';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { ApplicationDetail } from '../data/mockApplicationDetails';

interface DecisionPanelProps {
  application: ApplicationDetail;
  onDecision: (
    newStatus: ApplicationDetail['status'],
    actionName: string,
    notes: string
  ) => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ application, onDecision }) => {
  const [notes, setNotes] = useState(application.auditLogs[0]?.notes || '');
  const [modalType, setModalType] = useState<'correction' | 'rejection' | null>(null);
  const [reason, setReason] = useState('');

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
      onDecision('Flagged', 'Correction Requested', `Reason: ${reason}\n\nNotes: ${notes}`);
    } else {
      onDecision('Flagged', 'Application Rejected', `Reason: ${reason}\n\nNotes: ${notes}`);
    }
    
    setModalType(null);
  };

  const isProcessed = application.status === 'Processed';

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Officer Notes Card */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Internal Review Notes</h3>
        <textarea
          rows={5}
          disabled={isProcessed}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add observations, call logs, or verification notes..."
          className="w-full p-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-text-muted/60 font-medium"
        />
        {!isProcessed && (
          <span className="text-[10px] text-text-muted font-medium italic -mt-1">
            Notes will be saved and recorded in the audit history upon executing a decision.
          </span>
        )}
      </Card>

      {/* Decision Card */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Officer Decision</h3>

        {isProcessed ? (
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

            <Button
              onClick={() => handleOpenModal('correction')}
              variant="secondary"
              className="w-full justify-center border border-border-muted text-primary bg-slate-50 hover:bg-slate-100 h-11 py-0 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Request Correction
            </Button>

            <Button
              onClick={() => handleOpenModal('rejection')}
              variant="danger"
              className="w-full justify-center border border-error text-error hover:bg-error/5 h-11 py-0 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Reject Case
            </Button>
          </div>
        )}
      </Card>

      {/* Audit History Timeline */}
      <Card className="bg-white border border-border-muted shadow-sm flex flex-col gap-4 flex-1 min-h-[200px]">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Case History & Audit</h3>
        <div className="relative border-l border-slate-200 pl-4 ml-2 flex flex-col gap-5 overflow-y-auto max-h-[300px]">
          {application.auditLogs.map((log) => (
            <div key={log.id} className="relative flex flex-col gap-1 text-xs">
              {/* Timeline marker */}
              <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-primary shrink-0 flex items-center justify-center">
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
                      ? 'e.g. The uploaded ACRA business registration profile is expired. Please upload a profile showing UEN active status.'
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
                      ? 'bg-warning hover:bg-warning/90 disabled:bg-warning/40'
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
