import React from 'react';

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-info/10';
  let textColor = 'text-info';

  const s = status.toLowerCase();

  if (s === 'approved' || s === 'ai-ready' || s === 'verified') {
    bgColor = 'bg-success/10';
    textColor = 'text-success';
  } else if (s === 'flagged') {
    bgColor = 'bg-error/10';
    textColor = 'text-error';
  } else if (s === 'conflicted' || s === 'warning' || s === 'warning-amber') {
    bgColor = 'bg-warning/10';
    textColor = 'text-warning';
  } else if (s === 'processed' || s === 'completed') {
    bgColor = 'bg-surface-container';
    textColor = 'text-text-muted';
  } else if (s === 'pending') {
    bgColor = 'bg-info/10';
    textColor = 'text-info';
  } else if (s === 'draft') {
    bgColor = 'bg-surface-container';
    textColor = 'text-text-muted';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};
