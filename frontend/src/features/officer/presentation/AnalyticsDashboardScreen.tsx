"use client";

import React, { useState, useEffect, useMemo } from 'react';

import { SideNav } from './SideNav';
import { MetricCard } from './MetricCard';
import { ChartContainer } from './ChartContainer';
import { LiveTable } from './LiveTable';
import { mockAnalyticsData, AnalyticsSummary } from '../data/mockAnalytics';
import { mockApplications } from '../data/mockApplications';

export const AnalyticsDashboardScreen: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | '12months'>('30days');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Chart interactivity states
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Trigger simulated loading screen when date range changes
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const currentData = useMemo<AnalyticsSummary>(() => {
    return mockAnalyticsData[dateRange];
  }, [dateRange]);

  // CSV Exporter for Analytics Summary and details
  const handleExport = () => {
    showToast(`Generating report for Date Range: ${dateRange}...`, 'success');

    const headers = 'Metric,Value,Goal,Status\n';
    const rows = [
      `"Total Applications",${currentData.totalApps},"-","-"`,
      `"Approved Applications",${currentData.approvedApps},"-","-"`,
      `"Pending Applications",${currentData.pendingApps},"-","-"`,
      `"Rejected Applications",${currentData.rejectedApps},"-","-"`,
      `"Average AI Processing Speed",${currentData.avgProcessingTime}s,"<1.5s","Goal Met"`,
      ...currentData.goalProgress.map(g => `"${g.name}",${g.current}${g.unit},${g.target}${g.unit},"Target Achieved"`)
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ADP_Analytics_Summary_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Dimension Consts
  const chartWidth = 400;
  const chartHeight = 140;
  const xStart = 50;
  const yStart = 25;

  // Render Bar Chart Path calculations
  const { barElements, volumeMaxY } = useMemo(() => {
    const data = currentData.volumeData;
    const maxVal = Math.max(...data.map(d => d.total), 10);
    const maxValY = Math.ceil(maxVal * 1.15);
    const numBars = data.length;
    const spacing = numBars > 10 ? 4 : (numBars > 5 ? 12 : 24);
    const barWidth = (chartWidth - (numBars - 1) * spacing) / numBars;

    const items = data.map((d, i) => {
      const x = xStart + i * (barWidth + spacing);
      const hApproved = (d.approved / maxValY) * chartHeight;
      const hPending = (d.pending / maxValY) * chartHeight;
      const hRejected = (d.rejected / maxValY) * chartHeight;

      return {
        label: d.label,
        x,
        w: barWidth,
        hApproved,
        hPending,
        hRejected,
        approved: d.approved,
        pending: d.pending,
        rejected: d.rejected,
        total: d.total,
      };
    });

    return { barElements: items, volumeMaxY: maxValY };
  }, [currentData, chartWidth, chartHeight, xStart]);

  // Render Line Chart calculations
  const { linePoints, lineDots, timeMaxY } = useMemo(() => {
    const data = currentData.processingTimeData;
    const maxTime = Math.max(...data.map(d => d.avgTime), 2.0);
    const maxTimeY = Math.ceil(maxTime * 1.25 * 10) / 10;
    const numPoints = data.length;

    const dots = data.map((d, i) => {
      const x = numPoints > 1 ? xStart + (i / (numPoints - 1)) * chartWidth : xStart + chartWidth / 2;
      const y = yStart + chartHeight - (d.avgTime / maxTimeY) * chartHeight;
      return { x, y, val: d.avgTime, label: d.label };
    });

    const pathString = dots.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Create closed path for area gradient fill
    const areaString = dots.length > 0
      ? `${pathString} L ${dots[dots.length - 1].x} ${yStart + chartHeight} L ${dots[0].x} ${yStart + chartHeight} Z`
      : '';

    return { linePoints: pathString, lineArea: areaString, lineDots: dots, timeMaxY: maxTimeY };
  }, [currentData, chartWidth, chartHeight, xStart, yStart]);

  // Area Path separate definition to avoid dependency issues
  const lineAreaPath = useMemo(() => {
    if (lineDots.length === 0) return '';
    const pathString = lineDots.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${pathString} L ${lineDots[lineDots.length - 1].x} ${yStart + chartHeight} L ${lineDots[0].x} ${yStart + chartHeight} Z`;
  }, [lineDots, chartHeight, yStart]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <SideNav activePath="/officer/analytics" />

      {/* Spacer to prevent main content from sliding under the fixed sidebar on desktop */}
      <div className="hidden lg:block w-64 shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto gap-6 overflow-hidden">

        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
              <span>Officer Portal</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="text-text-main">Analytics Overview</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mt-1">
              Analytics Overview
            </h1>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Date Range Selector */}
            <div className="relative flex items-center shrink-0">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value as '7days' | '30days' | '90days' | '12months');
                  setIsLoading(true);
                }}
                className="h-10 pl-3 pr-9 border border-border-muted rounded-default text-xs font-bold bg-white text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="12months">Last 12 Months</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Export Action */}
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-default transition-colors cursor-pointer shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            <p className="text-sm text-text-muted font-semibold">Updating performance metrics...</p>
          </div>
        ) : (
          <>
            {/* Top-line KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              <MetricCard
                title="Total Applications"
                value={currentData.totalApps}
                subtitle="Cases submitted in period"
                variant="neutral"
                trend={{ value: "+14.2% vs prev", isPositive: true }}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                }
              />
              <MetricCard
                title="Approved Cases"
                value={currentData.approvedApps}
                subtitle="Audit finalized successfully"
                variant="success"
                trend={{ value: "+9.6% vs prev", isPositive: true }}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              />
              <MetricCard
                title="Pending Review"
                value={currentData.pendingApps}
                subtitle="Active in verification pipeline"
                variant="info"
                trend={{ value: "-4.3% backlog", isPositive: true }}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              <MetricCard
                title="Rejected / Flagged"
                value={currentData.rejectedApps}
                subtitle="Discrepancies found"
                variant="danger"
                trend={{ value: "+2.1% SLA alert", isPositive: false }}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                }
              />
            </section>

            {/* SLA Goal Progress Indicators (S4-FR-09) */}
            <section className="bg-white border border-border-muted rounded-lg p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-primary tracking-tight uppercase">SLA Target Progress</h2>
                  <span className="text-[10px] bg-success/10 text-success font-bold px-2 py-0.5 rounded-full">On Track</span>
                </div>
                <span className="text-xs text-text-muted font-medium">Compliance Target: 60% Reduction in Incomplete Apps</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.goalProgress.map((goal, idx) => {
                  const percentAchieved = goal.current;
                  const isCompleted = goal.current >= goal.target;
                  return (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-surface-container-low border border-slate-100 items-start">
                      {/* Circular Progress Gauge */}
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          {/* Track */}
                          <circle cx="32" cy="32" r="28" className="stroke-slate-200 fill-none" strokeWidth="6" />
                          {/* Fill */}
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className={`fill-none stroke-linecap-round transition-all duration-500 ${isCompleted ? 'stroke-success' : 'stroke-warning'}`}
                            strokeWidth="6"
                            strokeDasharray={175}
                            strokeDashoffset={175 - (175 * percentAchieved) / 100}
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-text-main font-mono">
                          {goal.current}{goal.unit}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-text-main leading-tight flex items-center gap-1.5">
                          {goal.name}
                          {isCompleted ? (
                            <span className="text-success text-xs">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          ) : null}
                        </h4>
                        <p className="text-xs text-text-muted font-medium leading-relaxed">
                          {goal.description}
                        </p>
                        <span className="text-[10px] text-text-muted/80 font-bold uppercase mt-1">
                          Goal Target: {goal.target}{goal.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Middle Grid: Volume & Performance charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Volume Chart Container */}
              <ChartContainer
                title="Monthly Application Volume"
                subtitle="Daily and monthly submittals grouped by status outcome"
                headerAction={
                  <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted select-none">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-success rounded-sm"></span> Approved
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-info rounded-sm"></span> Pending
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-error rounded-sm"></span> Rejected
                    </span>
                  </div>
                }
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Gridlines */}
                    {[0, 1, 2, 3].map((val) => {
                      const y = yStart + (val / 3) * chartHeight;
                      const gridVal = Math.round(volumeMaxY * (1 - val / 3));
                      return (
                        <g key={val}>
                          <line x1={xStart} y1={y} x2={xStart + chartWidth} y2={y} className="stroke-slate-100" strokeWidth="1" strokeDasharray="4 4" />
                          <text x={xStart - 10} y={y + 4} className="text-[10px] font-bold font-mono text-text-muted text-right" textAnchor="end">
                            {gridVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars rendering */}
                    {barElements.map((bar, i) => {
                      const isHovered = hoveredBarIndex === i;
                      // Stack offsets
                      const yApp = yStart + chartHeight - bar.hApproved;
                      const yPen = yApp - bar.hPending;
                      const yRej = yPen - bar.hRejected;

                      return (
                        <g
                          key={i}
                          onMouseEnter={() => setHoveredBarIndex(i)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                          className="cursor-pointer transition-opacity duration-150"
                          opacity={hoveredBarIndex === null || isHovered ? 1 : 0.65}
                        >
                          {/* Approved Bar */}
                          {bar.hApproved > 0 && (
                            <rect x={bar.x} y={yApp} width={bar.w} height={bar.hApproved} className="fill-success" />
                          )}
                          {/* Pending Bar */}
                          {bar.hPending > 0 && (
                            <rect x={bar.x} y={yPen} width={bar.w} height={bar.hPending} className="fill-info" />
                          )}
                          {/* Rejected Bar */}
                          {bar.hRejected > 0 && (
                            <rect x={bar.x} y={yRej} width={bar.w} height={bar.hRejected} className="fill-error" />
                          )}

                          {/* Base Interaction outline */}
                          <rect
                            x={bar.x - 2}
                            y={yStart}
                            width={bar.w + 4}
                            height={chartHeight}
                            className={`fill-transparent ${isHovered ? 'stroke-slate-200/50' : 'stroke-transparent'}`}
                            strokeWidth="1.5"
                          />

                          {/* Labels */}
                          <text
                            x={bar.x + bar.w / 2}
                            y={yStart + chartHeight + 16}
                            className={`text-[10px] font-bold text-center ${isHovered ? 'fill-primary font-extrabold' : 'fill-text-muted'}`}
                            textAnchor="middle"
                          >
                            {bar.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* X Axis line */}
                    <line x1={xStart} y1={yStart + chartHeight} x2={xStart + chartWidth} y2={yStart + chartHeight} className="stroke-slate-200" strokeWidth="1" />
                  </svg>

                  {/* Interactive Tooltip HUD */}
                  {hoveredBarIndex !== null && barElements[hoveredBarIndex] && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-semibold py-1.5 px-3 rounded shadow-lg border border-slate-700 flex gap-3 z-10 animate-fade-in font-mono">
                      <span>{barElements[hoveredBarIndex].label}</span>
                      <span className="text-success">App: {barElements[hoveredBarIndex].approved}</span>
                      <span className="text-info">Pend: {barElements[hoveredBarIndex].pending}</span>
                      <span className="text-error">Rej: {barElements[hoveredBarIndex].rejected}</span>
                      <span className="border-l border-slate-700 pl-2 text-slate-300">Total: {barElements[hoveredBarIndex].total}</span>
                    </div>
                  )}
                </div>
              </ChartContainer>

              {/* AI Processing Time Container */}
              <ChartContainer
                title="AI Processing Time"
                subtitle="Latency profile of document verification model in seconds"
                headerAction={
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-primary-container text-on-primary-container font-extrabold px-2 py-0.5 rounded tracking-wide">
                      BETA
                    </span>
                    <span className="text-xs font-extrabold text-info">
                      {currentData.avgProcessingTime}s Avg
                    </span>
                  </div>
                }
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0369A1" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    {[0, 1, 2, 3].map((val) => {
                      const y = yStart + (val / 3) * chartHeight;
                      const gridVal = (timeMaxY * (1 - val / 3)).toFixed(1);
                      return (
                        <g key={val}>
                          <line x1={xStart} y1={y} x2={xStart + chartWidth} y2={y} className="stroke-slate-100" strokeWidth="1" strokeDasharray="4 4" />
                          <text x={xStart - 10} y={y + 4} className="text-[10px] font-bold font-mono text-text-muted text-right" textAnchor="end">
                            {gridVal}s
                          </text>
                        </g>
                      );
                    })}

                    {/* Area under the line */}
                    {lineAreaPath && (
                      <path d={lineAreaPath} fill="url(#areaGrad)" />
                    )}

                    {/* The line itself */}
                    {linePoints && (
                      <path d={linePoints} fill="none" stroke="var(--info-blue)" strokeWidth="2.5" strokeLinecap="round" />
                    )}

                    {/* Dots and Labels */}
                    {lineDots.map((dot, i) => {
                      const isHovered = hoveredPointIndex === i;
                      return (
                        <g
                          key={i}
                          onMouseEnter={() => setHoveredPointIndex(i)}
                          onMouseLeave={() => setHoveredPointIndex(null)}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r={isHovered ? 6 : 4}
                            className={`fill-white stroke-info transition-all duration-150`}
                            strokeWidth={isHovered ? 3 : 2}
                          />

                          {/* Invisible larger hover circle to make touching easier */}
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r={15}
                            className="fill-transparent"
                          />

                          {/* X-axis labels (render less frequently if dataset is large, i.e. 12months) */}
                          {(lineDots.length <= 7 || i % 2 === 0 || i === lineDots.length - 1) && (
                            <text
                              x={dot.x}
                              y={yStart + chartHeight + 16}
                              className={`text-[10px] font-bold ${isHovered ? 'fill-primary font-extrabold' : 'fill-text-muted'}`}
                              textAnchor="middle"
                            >
                              {dot.label}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* X Axis line */}
                    <line x1={xStart} y1={yStart + chartHeight} x2={xStart + chartWidth} y2={yStart + chartHeight} className="stroke-slate-200" strokeWidth="1" />
                  </svg>

                  {/* Interactive Tooltip HUD */}
                  {hoveredPointIndex !== null && lineDots[hoveredPointIndex] && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-semibold py-1.5 px-3 rounded shadow-lg border border-slate-700 flex gap-2 z-10 animate-fade-in font-mono">
                      <span>{lineDots[hoveredPointIndex].label}:</span>
                      <span className="text-info font-bold">{lineDots[hoveredPointIndex].val.toFixed(2)}s</span>
                      <span className="text-slate-400">avg speed</span>
                    </div>
                  )}
                </div>
              </ChartContainer>
            </section>

            {/* Live Queue Readout Section */}
            <section className="w-full">
              <LiveTable applications={mockApplications} />
            </section>
          </>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white text-text-main text-sm font-semibold rounded-default shadow-lg border border-border-muted animate-slide-up">
          {toast.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-info text-white flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
