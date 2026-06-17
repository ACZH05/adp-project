"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { SideNav } from './SideNav';
import { KPICard } from './KPICard';
import { FilterBar } from './FilterBar';
import { DataTable } from './DataTable';
import { mockApplications, getQueueStats, Application } from '../data/mockApplications';

export const ApplicationQueueScreen: React.FC = () => {
  // State
  const [appsList, setAppsList] = useState<Application[]>(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  // Sorting State
  const [sortField, setSortField] = useState<'submissionDate' | 'aiConfidence' | null>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Add New Case Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApplicant, setNewApplicant] = useState('');
  const [newType, setNewType] = useState('Entertainment License');
  const [newScore, setNewScore] = useState(85);
  const [newStatus, setNewStatus] = useState<'Pending' | 'AI-Ready' | 'Flagged'>('AI-Ready');
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  // Wrapper handlers that set loading state on user interaction
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsLoading(true);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setIsLoading(true);
  };

  const handleTypeFilterChange = (val: string) => {
    setTypeFilter(val);
    setIsLoading(true);
  };

  const handleScoreFilterChange = (val: string) => {
    setScoreFilter(val);
    setIsLoading(true);
  };

  // Trigger simulated loading effect when filters change to show skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, typeFilter, scoreFilter, sortField, sortDirection]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // KPI Queue Stats
  const globalStats = useMemo(() => getQueueStats(appsList), [appsList]);

  // Handle Sort Toggle
  const handleSort = (field: 'submissionDate' | 'aiConfidence') => {
    setIsLoading(true);
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & Sorted Applications
  const processedApplications = useMemo(() => {
    let result = [...appsList];

    // 1. Filter by Search Query (ID or Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        app => app.id.toLowerCase().includes(q) || app.applicantName.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    // 3. Filter by License Type
    if (typeFilter !== 'all') {
      result = result.filter(app => app.licenseType === typeFilter);
    }

    // 4. Filter by AI Score Range
    if (scoreFilter !== 'all') {
      result = result.filter(app => {
        if (scoreFilter === 'high') return app.aiConfidence >= 80;
        if (scoreFilter === 'medium') return app.aiConfidence >= 50 && app.aiConfidence < 80;
        if (scoreFilter === 'low') return app.aiConfidence < 50;
        return true;
      });
    }

    // 5. Sort Results
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (sortField === 'submissionDate') {
          // Date string comparison
          return sortDirection === 'asc'
            ? new Date(valA as string).getTime() - new Date(valB as string).getTime()
            : new Date(valB as string).getTime() - new Date(valA as string).getTime();
        } else {
          // Number comparison
          return sortDirection === 'asc'
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }
      });
    }

    return result;
  }, [appsList, searchQuery, statusFilter, typeFilter, scoreFilter, sortField, sortDirection]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all' || scoreFilter !== 'all';

  const clearFilters = () => {
    setIsLoading(true);
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setScoreFilter('all');
    showToast('Filters cleared', 'info');
  };

  const handleRowClick = (app: Application) => {
    showToast(`Loading Application Review: ${app.id} (${app.applicantName})`, 'info');
    // Navigation would happen here under a full implementation
  };

  const handleExport = () => {
    showToast(`Exporting queue data for ${processedApplications.length} cases...`, 'success');

    // Simulate generation and download of CSV
    const headers = 'Ref ID,Applicant Name,License Type,Submission Date,Status,AI Confidence\n';
    const rows = processedApplications.map(app =>
      `"${app.id}","${app.applicantName}","${app.licenseType}","${app.submissionDate}","${app.status}",${app.aiConfidence}%`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ADP_Application_Queue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.trim()) return;

    const newId = `APP-2026-${String(appsList.length + 1).padStart(3, '0')}`;
    const newCase: Application = {
      id: newId,
      applicantName: newApplicant,
      licenseType: newType,
      submissionDate: new Date().toISOString().slice(0, 10),
      status: newStatus,
      aiConfidence: newScore,
      isUrgent: newIsUrgent
    };

    setAppsList([newCase, ...appsList]);
    setIsModalOpen(false);

    // Reset inputs
    setNewApplicant('');
    setNewType('Entertainment License');
    setNewScore(85);
    setNewStatus('AI-Ready');
    setNewIsUrgent(false);

    showToast(`Successfully registered new case: ${newId}`, 'success');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <SideNav activePath="/officer/queue" />

      {/* Spacer to prevent main content from sliding under the fixed sidebar on desktop */}
      <div className="hidden lg:block w-64 shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto gap-6 overflow-hidden">

        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <span>Officer Portal</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-text-main">Application Queue</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Application Queue
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-primary-container/10 border border-primary-container/20 text-primary px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Live Queue Connected
            </div>
          </div>
        </div>

        {/* KPI Summaries Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          <KPICard
            title="Pending Review"
            value={globalStats.pendingReview}
            subtitle="Backlog awaiting audit"
            variant="neutral"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
          <KPICard
            title="High Confidence"
            value={globalStats.highConfidence}
            subtitle="AI Ready (score > 80%)"
            variant="success"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
          <KPICard
            title="Urgent Cases"
            value={globalStats.urgentCases}
            subtitle="Flagged / SLA warning"
            variant="danger"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
          <KPICard
            title="Processed Today"
            value={`${globalStats.processedToday} / ${globalStats.processedTodayTarget}`}
            subtitle="Target performance"
            variant="info"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            }
          />
        </section>

        {/* Filter Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          scoreFilter={scoreFilter}
          onScoreFilterChange={handleScoreFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onNewReview={() => setIsModalOpen(true)}
          onExport={handleExport}
        />

        {/* Data Table */}
        <section className="flex-1 w-full">
          <DataTable
            applications={processedApplications}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-inverse-surface text-inverse-on-surface text-sm font-semibold rounded-default shadow-lg border border-white/10 animate-slide-up">
          {toast.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-info text-white flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Manual Case Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>

          {/* Modal Container */}
          <div className="bg-white border border-border-muted rounded-lg shadow-xl max-w-md w-full z-10 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-surface-container">
              <h3 className="font-bold text-primary text-base">Register New Case</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Lim"
                  value={newApplicant}
                  onChange={(e) => setNewApplicant(e.target.value)}
                  className="w-full h-11 px-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">License Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full h-11 px-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Entertainment License">Entertainment License</option>
                  <option value="Food Establishment License">Food Establishment License</option>
                  <option value="Liquor License">Liquor License</option>
                  <option value="Business Registration">Business Registration</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'Pending' | 'AI-Ready' | 'Flagged')}
                    className="w-full h-11 px-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="AI-Ready">AI-Ready</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">AI Confidence Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full h-11 px-3 border border-border-muted rounded-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={newIsUrgent}
                  onChange={(e) => setNewIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-primary border-border-muted rounded focus:ring-primary"
                />
                <label htmlFor="urgent" className="text-xs font-bold text-text-main cursor-pointer">
                  Mark as Urgent (SLA Priority Alert)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold border border-border-muted text-text-muted hover:bg-slate-50 rounded-default"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold bg-primary hover:bg-primary-container text-white rounded-default"
                >
                  Register Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
