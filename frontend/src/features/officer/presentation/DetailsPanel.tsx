"use client";

import React, { useState, useRef } from 'react';
import { Card } from '@/src/shared/components/Card';
import { ApplicationDetail, DocumentDetail } from '../data/mockApplicationDetails';

interface DetailsPanelProps {
  application: ApplicationDetail;
  onViewDocument: (doc: DocumentDetail) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ application, onViewDocument }) => {
  const [activeTab, setActiveTab] = useState<'applicant' | 'business' | 'entertainment' | 'documents'>('applicant');
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll multiplier
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTabClick = (tabId: 'applicant' | 'business' | 'entertainment' | 'documents') => {
    if (isDragging) return;
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'applicant', label: 'Applicant Info' },
    { id: 'business', label: 'Business & Premise' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'documents', label: 'Documents' },
  ] as const;

  const renderStatusBadge = (status: DocumentDetail['status']) => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Verified
        </span>
      );
    }
    if (status === 'Flagged') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Flagged
        </span>
      );
    }
    if (status === 'Low Confidence') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Low Conf
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info">
        Pending
      </span>
    );
  };

  const renderInfoRow = (label: string, value: string | number | undefined, monospace = false) => {
    return (
      <div className="flex flex-col gap-1.5 py-3 border-b border-slate-100 last:border-0">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</span>
        <span className={`text-sm text-text-main font-medium ${monospace ? 'font-mono text-xs font-semibold text-primary' : ''}`}>
          {value || 'N/A'}
        </span>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full bg-white border border-border-muted shadow-sm overflow-hidden" padding={false}>
      {/* Panel Header */}
      <div className="p-6 bg-surface-container border-b border-border-muted">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Application Details</h2>
          <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-default">
            {application.id}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1 font-semibold">{application.licenseType}</p>
      </div>

      {/* Tabs Menu */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex border-b border-border-muted bg-surface-container-low px-4 overflow-x-auto scrollbar-none select-none cursor-grab active:cursor-grabbing"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all outline-none
              ${activeTab === tab.id
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-text-muted hover:text-text-main'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'applicant' && (
          <div className="flex flex-col">
            {renderInfoRow('Applicant Full Name', application.applicantName)}
            {renderInfoRow('IC / Passport Number', application.icNumber, true)}
            {renderInfoRow('Date of Birth', application.dob)}
            {renderInfoRow('Email Address', application.email)}
            {renderInfoRow('Contact Number', application.phone)}
            {renderInfoRow('Residential Address', application.address)}
          </div>
        )}

        {activeTab === 'business' && (
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 mt-1 border-b pb-1">Corporate Details</h3>
            {renderInfoRow('Business Legal Name', application.businessName)}
            {renderInfoRow('SSM Registration Number', application.businessRegNumber, true)}
            {renderInfoRow('Applicant Position', application.businessPosition)}
            {renderInfoRow('Business Contact', application.businessPhone)}
            {renderInfoRow('Registration Date', application.businessRegDate)}
            {renderInfoRow('Registration Expiry', application.businessExpiryDate)}
            {renderInfoRow('Registered Address', application.businessAddress)}

            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mt-6 mb-2 border-b pb-1">Premise Details</h3>
            {renderInfoRow('Premise Address', application.premiseAddress)}
            {renderInfoRow('Postcode', application.premisePostcode, true)}
            {renderInfoRow('City / District', application.premiseCity)}
            {renderInfoRow('Premise Type', application.premiseType)}
            {renderInfoRow('Floor / Level', application.premiseFloorLevel)}
          </div>
        )}

        {activeTab === 'entertainment' && (
          <div className="flex flex-col">
            {renderInfoRow('Entertainment Category', application.entertainmentCategory)}
            {renderInfoRow('Licensed Capacity', `${application.entertainmentCapacity} ${application.entertainmentCapacityUnit}`)}
            {renderInfoRow('Requested Duration', `${application.entertainmentDurationMonths} Months`)}
            {renderInfoRow('Operating Hours', application.entertainmentOperatingHours)}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-text-muted font-medium mb-1">
              Verify each submitted file below against DB values. Click Review to inspect closely.
            </p>
            {application.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col p-4 border border-slate-100 rounded-default bg-slate-50 hover:bg-slate-100/50 hover:border-slate-200 transition-all gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-main leading-snug">{doc.name}</h4>
                      <span className="text-[10px] text-text-muted font-semibold tracking-wide block mt-0.5">{doc.category}</span>
                    </div>
                  </div>
                  {renderStatusBadge(doc.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted border-t border-slate-200/50 pt-2.5 mt-0.5">
                  <span className="font-mono text-[11px] truncate max-w-[150px]">{doc.fileName} ({doc.fileSize})</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="font-bold text-primary hover:underline hover:text-primary-container text-xs cursor-pointer"
                    >
                      View
                    </button>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="font-bold text-text-muted hover:underline hover:text-text-main text-xs"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
