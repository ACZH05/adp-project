import React from 'react';
import { useRouter } from 'next/navigation';
import { Application } from '../data/mockApplications';

interface LiveTableProps {
  applications: Application[];
  isLoading?: boolean;
}

export const LiveTable: React.FC<LiveTableProps> = ({
  applications,
  isLoading = false,
}) => {
  const router = useRouter();

  // Helper to render colored status badges
  const renderStatusBadge = (status: Application['status']) => {
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
  const renderConfidenceScore = (score: number) => {
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

  const handleRowClick = (id: string) => {
    router.push(`/officer/queue/${id}`);
  };

  // Generate simulated real-time times based on mock applications
  const getSimulatedLiveTime = (index: number) => {
    const times = ["Just now", "2 mins ago", "12 mins ago", "35 mins ago", "1 hour ago", "2 hours ago"];
    return times[index] || "2 hours ago";
  };

  return (
    <div className="bg-white border border-border-muted rounded-lg shadow-sm overflow-hidden w-full">
      {/* Table Header Area */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-primary tracking-tight uppercase">
            Live Queue Readout
          </h3>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
        </div>
        <div className="text-[10px] font-bold text-success uppercase tracking-wider bg-success/5 border border-success/15 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span>Real-time Updates Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-border-muted text-xs font-bold text-text-muted uppercase tracking-wider select-none">
              <th className="px-6 py-4">Ref ID</th>
              <th className="px-6 py-4">Applicant Name</th>
              <th className="px-6 py-4">License Type</th>
              <th className="px-6 py-4">Arrival</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">AI Match</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20"></div></td>
                </tr>
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-text-muted font-medium">
                  No applications in queue.
                </td>
              </tr>
            ) : (
              applications.slice(0, 5).map((app, index) => {
                const isUrgent = app.isUrgent && app.status !== 'Processed';
                return (
                  <tr
                    key={app.id}
                    className={`
                      hover:bg-slate-50 cursor-pointer transition-colors group
                      ${isUrgent ? 'bg-error/2 hover:bg-error/5' : ''}
                    `}
                    onClick={() => handleRowClick(app.id)}
                  >
                    <td className={`
                      px-6 py-4 font-mono font-semibold text-text-main text-xs
                      ${isUrgent ? 'border-l-4 border-error pl-5' : ''}
                    `}>
                      {app.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-text-main">
                      {app.applicantName}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {app.licenseType}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">
                      {getSimulatedLiveTime(index)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      {renderConfidenceScore(app.aiConfidence)}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleRowClick(app.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container px-3 py-1.5 rounded-default border border-border-muted hover:border-primary/30 transition-colors group-hover:bg-white bg-slate-50"
                      >
                        <span>Audit</span>
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
