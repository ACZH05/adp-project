"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/components/Button';
import { Card } from '@/src/shared/components/Card';
import { StatusBadge } from '@/src/shared/components/StatusBadge';
import { APPLICANT_ROUTES, APPLICATION_STATUS_FILTERS } from '../data/applicantConstants';
import { getMockApplications } from '../data/applicantMockService';

export const ApplicationsScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleStartWizard = () => {
    router.push(APPLICANT_ROUTES.applyStart);
  };

  const processedApplications = useMemo(() => {
    let result = [...getMockApplications()];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        app => app.id.toLowerCase().includes(q) || app.licenseType.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
      }
      if (sortBy === 'confidence-desc') {
        return b.aiConfidence - a.aiConfidence;
      }
      if (sortBy === 'confidence-asc') {
        return a.aiConfidence - b.aiConfidence;
      }
      if (sortBy === 'ref-asc') {
        return a.id.localeCompare(b.id);
      }
      if (sortBy === 'ref-desc') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  const getConfidenceStyles = (score: number) => {
    if (score >= 80) return { barColor: 'bg-success', textColor: 'text-success' };
    if (score >= 50) return { barColor: 'bg-warning', textColor: 'text-warning' };
    return { barColor: 'bg-error', textColor: 'text-error' };
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
        <span>Applicant Portal</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-text-main">My Applications</span>
      </div>

      <div className="flex items-center justify-between border-b border-border-muted pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">My Applications</h1>
          <span className="text-xs font-semibold text-text-muted">Manage and track your license application submissions</span>
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

      <Card className="border border-border-muted p-4 bg-white">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex items-center w-full md:max-w-md">
            <div className="absolute left-3 text-text-muted pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Ref ID or license type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-text-muted hover:text-text-main"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-text-muted uppercase shrink-0">Status</label>
              <div className="relative flex items-center w-full sm:w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 border border-border-muted rounded-default text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                >
                  {APPLICATION_STATUS_FILTERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-text-muted uppercase shrink-0">Sort By</label>
              <div className="relative flex items-center w-full sm:w-44">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 border border-border-muted rounded-default text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="newest">Newest Submitted</option>
                  <option value="oldest">Oldest Submitted</option>
                  <option value="confidence-desc">Highest Confidence</option>
                  <option value="confidence-asc">Lowest Confidence</option>
                  <option value="ref-asc">Ref ID (A-Z)</option>
                  <option value="ref-desc">Ref ID (Z-A)</option>
                </select>
                <div className="absolute right-3 pointer-events-none text-text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 text-xs font-semibold px-3 border border-border-muted hover:bg-slate-50 shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {processedApplications.length > 0 ? (
          processedApplications.map((app) => {
            const confStyle = getConfidenceStyles(app.aiConfidence);
            return (
              <Card
                key={app.id}
                className="border border-border-muted p-5 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex flex-col gap-1.5 lg:flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                        {app.id}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <h3 className="text-base font-bold text-text-main mt-1">
                      {app.licenseType}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                      <span>
                        {app.status === 'Draft' ? 'Last saved on ' : 'Submitted on '}
                        {new Date(app.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {app.status === 'Draft' ? 'No documents uploaded' : `Documents: ${app.documents.approved} / ${app.documents.total} Verified`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full lg:w-64 shrink-0">
                    <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                      <span>AI Verification Match</span>
                      <span className={`font-bold ${app.status === 'Draft' ? 'text-text-muted' : confStyle.textColor}`}>
                        {app.status === 'Draft' ? 'N/A' : `${app.aiConfidence}%`}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      {app.status === 'Draft' ? (
                        <div className="h-full bg-slate-200" style={{ width: '0%' }} />
                      ) : (
                        <div className={`h-full ${confStyle.barColor}`} style={{ width: `${app.aiConfidence}%` }} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end shrink-0 w-full lg:w-36">
                    {app.status === 'Draft' ? (
                      <Button
                        onClick={() => router.push(APPLICANT_ROUTES.applyStart)}
                        className="w-full lg:w-auto text-xs py-2 px-4 bg-primary text-white hover:bg-primary-container"
                      >
                        Resume Application
                      </Button>
                    ) : app.status === 'Flagged' ? (
                      <Button
                        onClick={() => router.push(`/applicant/applications/${app.id}/resubmit`)}
                        className="w-full lg:w-auto text-xs py-2 px-4 bg-error text-white hover:bg-error/90 border-none"
                      >
                        Resolve Issues
                      </Button>
                    ) : (
                      <Button
                        onClick={() => router.push(APPLICANT_ROUTES.dashboard)}
                        className="w-full lg:w-auto text-xs py-2 px-4"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
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
              <h3 className="text-base font-bold text-text-main">No Applications Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
                We could not find any applications matching your current filter criteria. Try clearing search keywords or selecting a different status.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              {hasActiveFilters && (
                <Button variant="secondary" onClick={clearFilters} className="text-xs">
                  Reset Filters
                </Button>
              )}
              <Button onClick={handleStartWizard} className="text-xs">
                Start Application
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
