import React from 'react';
import { TextInput } from '@/src/shared/components/TextInput';
import { Button } from '@/src/shared/components/Button';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  scoreFilter: string;
  onScoreFilterChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onNewReview?: () => void;
  onExport?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  scoreFilter,
  onScoreFilterChange,
  onClearFilters,
  hasActiveFilters,
  onNewReview,
  onExport,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white border border-border-muted p-4 rounded-lg shadow-sm w-full">
      {/* Top row: Search & Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <TextInput
            id="search"
            placeholder="Search Ref ID or Name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {onExport && (
            <Button
              variant="secondary"
              onClick={onExport}
              title="Export Report"
              className="p-2.5 h-11 min-w-11"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </Button>
          )}
          {onNewReview && (
            <Button
              variant="primary"
              onClick={onNewReview}
              className="h-11 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Review</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</span>
            <div className="relative flex items-center w-full">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full h-9 pl-3 pr-8 bg-white border border-border-muted rounded-default text-xs font-semibold text-text-main appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">All Active</option>
                <option value="Pending">Pending</option>
                <option value="AI-Ready">AI-Ready</option>
                <option value="Flagged">Flagged</option>
                <option value="Processed">Processed</option>
              </select>
              <div className="absolute right-2.5 pointer-events-none text-text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>



          {/* AI Score filter */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">AI Score Range</span>
            <div className="relative flex items-center w-full">
              <select
                value={scoreFilter}
                onChange={(e) => onScoreFilterChange(e.target.value)}
                className="w-full h-9 pl-3 pr-8 bg-white border border-border-muted rounded-default text-xs font-semibold text-text-main appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">All Scores</option>
                <option value="high">High (&gt;80%)</option>
                <option value="medium">Medium (50% - 80%)</option>
                <option value="low">Low (&lt;50%)</option>
              </select>
              <div className="absolute right-2.5 pointer-events-none text-text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-info hover:text-primary transition-colors flex items-center gap-1.5 self-end py-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
