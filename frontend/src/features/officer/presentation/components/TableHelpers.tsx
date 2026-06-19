import React from 'react';
import { Application } from '../../data/mockApplications';

// Helper to render colored status badges
export const renderStatusBadge = (status: Application['status']) => {
  if (status === 'Processed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-text-muted">
        Processed
      </span>
    );
  }
  if (status === 'AI-Ready') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success">
        AI-Ready
      </span>
    );
  }
  if (status === 'Flagged') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error">
        Flagged
      </span>
    );
  }

  // Default: Pending status
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info">
      Pending
    </span>
  );
};

// Helper to render AI Score bar
export const renderConfidenceScore = (score: number) => {
  let barColor = 'bg-success';
  let textColor = 'text-success';
  if (score < 50) {
    barColor = 'bg-error';
    textColor = 'text-error';
  } else if (score < 80) {
    barColor = 'bg-warning';
    textColor = 'text-warning';
  }

  return (
    <div className="flex items-center gap-2 max-w-[120px]">
      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className={`text-xs font-mono font-bold ${textColor}`}>
        {score}%
      </span>
    </div>
  );
};

// Skeleton Loader Rows
export const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={`skeleton-${index}`} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20"></div></td>
      </tr>
    ))}
  </>
);
