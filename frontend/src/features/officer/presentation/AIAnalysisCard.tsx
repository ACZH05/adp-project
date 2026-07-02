import React from 'react';
import { Card } from '@/src/shared/components/Card';
import { ApplicationDetail, AIAnalysisFinding } from '../data/mockApplicationDetails';

interface AIAnalysisCardProps {
  application: ApplicationDetail;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ application }) => {
  const { aiConfidence, aiFindings } = application;

  // Determine overall status colors
  const getConfidenceColors = (score: number) => {
    if (score >= 80) return { text: 'text-success', bg: 'bg-success/10', border: 'border-success/20', fill: 'stroke-success' };
    if (score >= 50) return { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', fill: 'stroke-warning' };
    return { text: 'text-error', bg: 'bg-error/10', border: 'border-error/20', fill: 'stroke-error' };
  };

  const colors = getConfidenceColors(aiConfidence);

  const getSeverityBadge = (severity: AIAnalysisFinding['severity']) => {
    switch (severity) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Critical Severity
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20">
            <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
            Medium Warning
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-text-muted border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted"></span>
            Low Priority
          </span>
        );
    }
  };

  const getCategoryIcon = (category: AIAnalysisFinding['category']) => {
    switch (category) {
      case 'Discrepancy':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1" />
            <rect x="8" y="2" width="15" height="11" rx="2" ry="2" />
          </svg>
        );
      case 'Zoning':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case 'Document Quality':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
    }
  };

  return (
    <Card className="flex flex-col h-full bg-white border border-border-muted shadow-sm overflow-hidden" padding={false}>
      {/* Panel Header */}
      <div className="p-6 bg-surface-container border-b border-border-muted">
        <h2 className="text-lg font-bold text-primary">Automated Review Analysis</h2>
        <p className="text-xs text-text-muted mt-1 font-semibold">AI Verification Engine Insights</p>
      </div>

      {/* AI Score Overview */}
      <div className="p-6 border-b border-slate-100 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Circular Progress Ring */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            {/* Background circle */}
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Highlight Circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                className={colors.fill}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * aiConfidence) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-xl font-mono font-bold leading-none ${colors.text}`}>
                {aiConfidence}%
              </span>
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-1">
                Confidence
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-sm font-semibold text-text-main">
              Overall Verification Rating: <span className={`font-bold ${colors.text}`}>{aiConfidence >= 80 ? 'High' : aiConfidence >= 50 ? 'Medium' : 'Low'}</span>
            </h3>
            <p className="text-xs text-text-muted mt-1 font-medium leading-relaxed">
              Based on {aiFindings.length} automated check discrepancies found. Documents cross-referenced against SSM and National Registration databases.
            </p>
            <div className="flex justify-center md:justify-start gap-2 mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${colors.text} ${colors.bg} ${colors.border}`}>
                {application.status}
              </span>
              {application.isUrgent && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-error/10 text-error border border-error/20 uppercase tracking-wider">
                  SLA Priority
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Findings List */}
<div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
          Verification Discrepancies ({aiFindings.length})
        </h3>

        {aiFindings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-text-main">All Checks Cleared</h4>
            <p className="text-xs text-text-muted max-w-[240px] mt-1 font-medium leading-relaxed">
              No discrepancies or warnings were raised by the AI verification agent.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {aiFindings.map((finding) => (
              <div
                key={finding.id}
                className="flex flex-col border border-border-muted hover:border-slate-300 rounded-lg p-5 bg-white transition-all gap-4"
              >
                {/* Finding Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                      ${finding.severity === 'High' ? 'bg-error/10 text-error' : finding.severity === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-slate-100 text-text-muted'}
                    `}>
                      {getCategoryIcon(finding.category)}
                    </div>
                  <div>
                      <h4 className="text-sm font-bold text-text-main leading-tight">
                        {finding.severity === 'High' ? 'Critical Discrepancy Detected' : finding.title}
                      </h4>
                      {finding.severity === 'High' && (
                        <span className="text-[10px] text-error font-bold uppercase tracking-wider mt-0.5 block">
                          {finding.title}
                        </span>
                      )}
                      {finding.severity !== 'High' && (
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5 block">{finding.category}</span>
                      )}
                    </div>
                  </div>
                  {getSeverityBadge(finding.severity)}
                </div>

                {/* Finding Description */}
                <div className="text-xs text-text-muted leading-relaxed font-medium">
                  {finding.description}
                </div>

                {/* Affected Field Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0">Field:</span>
                  <span className="text-[11px] font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 truncate">
                    {finding.field}
                  </span>
                </div>

                {/* Suggested Action Box */}
                <div className="p-3 bg-slate-50 border-l-2 border-primary rounded-r text-xs leading-relaxed text-text-main font-semibold">
                  <span className="text-primary font-bold uppercase text-[9px] tracking-wider block mb-1">Recommended Action</span>
                  {finding.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
