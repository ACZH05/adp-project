import React from 'react';
import { Application } from '../data/mockApplications';

interface DataTableProps {
  applications: Application[];
  isLoading: boolean;
  onRowClick: (app: Application) => void;
  sortField: 'submissionDate' | 'aiConfidence' | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'submissionDate' | 'aiConfidence') => void;
}

import { renderStatusBadge, renderConfidenceScore, SkeletonRows } from './components/TableHelpers';

export const DataTable: React.FC<DataTableProps> = ({
  applications,
  isLoading,
  onRowClick,
  sortField,
  sortDirection,
  onSort,
}) => {
  // Renders sorting icon indicator
  const renderSortIcon = (field: 'submissionDate' | 'aiConfidence') => {
    if (sortField !== field) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted/40 ml-1">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary ml-1">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary ml-1">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white border border-border-muted rounded-lg shadow-sm overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-border-muted text-xs font-bold text-text-muted uppercase tracking-wider select-none">
              <th className="px-6 py-4">Ref ID</th>
              <th className="px-6 py-4">Applicant Name</th>

              <th className="px-6 py-4 cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => onSort('submissionDate')}>
                <div className="flex items-center">
                  Submission Date {renderSortIcon('submissionDate')}
                </div>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => onSort('aiConfidence')}>
                <div className="flex items-center">
                  AI Confidence {renderSortIcon('aiConfidence')}
                </div>
              </th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <SkeletonRows />
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted font-medium">
                  No applications found matching the search or filters.
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const showUrgentBar = app.isUrgent && app.status !== 'Processed';
                return (
                  <tr
                    key={app.id}
                    className={`
                      hover:bg-slate-50 cursor-pointer transition-colors group
                      ${showUrgentBar ? 'bg-error/2 hover:bg-error/5' : ''}
                    `}
                    onClick={() => onRowClick(app)}
                  >
                    {/* First cell with optional red left border if urgent */}
                    <td className={`
                      px-6 py-4 font-mono font-semibold text-text-main text-xs
                      ${showUrgentBar ? 'border-l-4 border-error pl-5' : ''}
                    `}>
                      {app.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-text-main">
                      {app.applicantName}
                    </td>

                    <td className="px-6 py-4 text-text-muted">
                      {app.submissionDate}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      {renderConfidenceScore(app.aiConfidence)}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onRowClick(app)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container px-3 py-1.5 rounded-default border border-border-muted hover:border-primary/30 transition-colors group-hover:bg-white bg-slate-50"
                      >
                        <span>Review</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
