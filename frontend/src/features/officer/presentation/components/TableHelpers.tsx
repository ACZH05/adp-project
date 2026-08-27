import React from 'react';
import { Application } from '../../data/mockApplications';

import { StatusBadge } from '@/src/shared/components/StatusBadge';

// Helper to render colored status badges
export const renderStatusBadge = (status: Application['status']) => {
  return <StatusBadge status={status} />;
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
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20"></div></td>
      </tr>
    ))}
  </>
);
