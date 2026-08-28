"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/components/Button';
import { Card } from '@/src/shared/components/Card';
import { StatusBadge } from '@/src/shared/components/StatusBadge';
import { APPLICANT_ROUTES, APPLICATION_STATUS_FILTERS } from '../data/applicantConstants';

export const ApplicationsScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('adp_user_email') || 'test@example.com';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

    fetch(`${apiUrl}/applications?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(app => {
            let displayStatus = 'Draft';
            if (
              app.status === 'submitted' ||
              app.status === 'verification_queued' ||
              app.status === 'verifying'
            ) {
              displayStatus = 'Pending';
            } else if (app.status === 'verified' || app.status === 'verification_complete') {
              displayStatus = 'Approved';
            } else if (app.status === 'rejected') {
              displayStatus = 'Rejected';
            } else if (app.status === 'flagged' || app.status === 'correction_required') {
              displayStatus = 'Flagged';
            }

            return {
              id: app.applicationNo || app.id,
              dbId: app.id,
              licenseType: app.licenseType,
              submissionDate: app.submissionDate,
              aiConfidence: app.aiConfidence,
              status: displayStatus,
              documents: app.documents,
              formSnapshot: app.formSnapshot,
              applicationVersionId: app.applicationVersionId,
              aiFindings: app.aiFindings || [],
              docList: app.docList || [],
            };
          });
          setApplications(mapped);
        }
      })
      .catch(err => {
        console.error('Failed to load applications:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartWizard = () => {
    router.push(APPLICANT_ROUTES.applyStart);
  };

  const processedApplications = useMemo(() => {
    let result = [...applications];

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
  }, [applications, searchQuery, statusFilter, sortBy]);

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
        {loading ? (
          <Card className="border border-border-muted p-12 bg-white text-center flex flex-col items-center justify-center gap-2">
            <span className="text-sm font-semibold text-text-muted">Loading applications...</span>
          </Card>
        ) : processedApplications.length > 0 ? (
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
                      <span className={`font-bold ${app.status === 'Draft' ? 'text-text-muted' : app.aiConfidence === null ? 'text-warning animate-pulse' : confStyle.textColor}`}>
                        {app.status === 'Draft' ? 'N/A' : app.aiConfidence === null ? 'Pending' : `${app.aiConfidence}%`}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      {app.status === 'Draft' ? (
                        <div className="h-full bg-slate-200" style={{ width: '0%' }} />
                      ) : app.aiConfidence === null ? (
                        <div className="h-full bg-warning/30 animate-pulse" style={{ width: '30%' }} />
                      ) : (
                        <div className={`h-full ${confStyle.barColor}`} style={{ width: `${app.aiConfidence}%` }} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end shrink-0 w-full lg:w-36">
                    {app.status === 'Draft' ? (
                      <Button
                        onClick={() => {
                          const docsMap: Record<string, any> = {};
                          if (Array.isArray(app.docList)) {
                            app.docList.forEach((doc: any) => {
                              let key = 'passportPhoto';
                              if (doc.documentType === 'identity_card_copy') key = 'icCopy';
                              else if (doc.documentType === 'tenancy_agreement') key = 'tenancyAgreement';
                              else if (doc.documentType === 'business_registration_copy') key = 'businessReg';

                              docsMap[key] = {
                                name: doc.fileName || 'document.pdf',
                                size: doc.fileSize || '1.0 MB',
                                status: 'verified',
                                progress: 100,
                                dbId: doc.id,
                              };
                            });
                          }

                          const draftPayload = {
                            data: {
                              applicationId: app.dbId,
                              applicationVersionId: app.applicationVersionId,
                              ...app.formSnapshot,
                            },
                            completed: [1, 2, 3, 4, 5],
                            docs: docsMap,
                          };
                          localStorage.setItem('adp_wizard_draft', JSON.stringify(draftPayload));
                          router.push(APPLICANT_ROUTES.applyStart);
                        }}
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
                        onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}
                        className="w-full lg:w-auto text-xs py-2 px-4"
                      >
                        {expandedAppId === app.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Approved License Pickup Notification */}
                {(app.status === 'Approved' || app.status === 'approved' || app.status === 'Processed') && (
                  <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-default flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-success text-sm">Application Approved! Collect License at Office</h4>
                        <p className="text-text-muted mt-0.5 font-medium">
                          Your license application has been approved by the reviewing officer. Please schedule a visit or visit the District Licensing Counter to collect your physical license certificate.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/applicant/appointments')}
                      className="bg-success text-white hover:bg-success/90 shrink-0 text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Schedule Collection Visit
                    </Button>
                  </div>
                )}

                {/* Collapsible Details Area inside listing card */}
                {expandedAppId === app.id && (
                  <div className="border-t border-border-muted pt-5 mt-5 flex flex-col gap-6 animate-fadeIn">
                    {/* Category 1: Applicant Info */}
                    <div>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        Applicant Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Full Name</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.fullName || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">IC/Passport No.</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.icPassport || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Date of Birth</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.dob || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Email Address</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Contact Number</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.contactNumber || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-2 md:col-span-3">
                          <span className="text-[10px] uppercase font-bold text-text-muted">Residential Address</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5 whitespace-pre-line">{app.formSnapshot.residentialAddress || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: Business Info */}
                    <div className="border-t border-border-muted pt-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        Business Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Company Name</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.companyName || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Business Name</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.businessName || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">SSM Registration No.</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.regNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Position / Designation</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.position || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Registration Date</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.regDate || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Expiry Date</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.expiryDate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Category 3: Premises & Licensing Info */}
                    <div className="border-t border-border-muted pt-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        Premises & License Parameters
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">License Type</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.licenseType}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Premises Type</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.premiseType || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Floor Level</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.floorLevel || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Capacity Quantity</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.quantityCapacity} {app.formSnapshot.quantityUnit || ''}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Operating Hours</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">
                            {app.formSnapshot.operatingHoursStart} - {app.formSnapshot.operatingHoursEnd}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted">Requested License Duration</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5">{app.formSnapshot.requestedDuration} Months</p>
                        </div>
                        <div className="sm:col-span-2 md:col-span-3">
                          <span className="text-[10px] uppercase font-bold text-text-muted">Premises Address</span>
                          <p className="text-xs font-semibold text-text-main mt-0.5 whitespace-pre-line">{app.formSnapshot.premiseAddress || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Submitted Documents Section */}
                    <div className="border-t border-border-muted pt-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        Submitted Documents
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {app.docList && app.docList.length > 0 ? (
                          app.docList.map((doc: any) => {
                            let docLabel = 'Document';
                            if (doc.documentType === 'applicant_passport_photo') docLabel = 'Passport-Sized Photo';
                            else if (doc.documentType === 'identity_card_copy') docLabel = 'Identity Card / Passport Copy';
                            else if (doc.documentType === 'business_registration_copy') docLabel = 'Business Registration Certificate (SSM)';
                            else if (doc.documentType === 'tenancy_agreement') docLabel = 'Tenancy Agreement / Premise Usage Proof';

                            return (
                              <div key={doc.id} className="p-3 border border-border-muted rounded-lg bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
                                <div className="min-w-0 flex-1">
                                  <span className="text-[9px] uppercase font-bold text-text-muted">{docLabel}</span>
                                  <p className="text-xs font-semibold text-text-main truncate mt-0.5" title={doc.fileName}>{doc.fileName}</p>
                                  {doc.aiStatus === 'flagged' && doc.aiMessage && (
                                    <p className="text-[10px] text-error font-medium mt-1.5 leading-relaxed">
                                      ⚠️ {doc.aiMessage}
                                    </p>
                                  )}
                                </div>
                                {doc.aiStatus === 'verifying' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-warning/10 text-warning uppercase shrink-0">
                                    Verifying...
                                  </span>
                                ) : doc.aiStatus === 'flagged' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-error/10 text-error uppercase shrink-0">
                                    AI Flagged
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase shrink-0">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    AI Verified
                                  </span>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-text-muted italic">No documents uploaded for this application.</p>
                        )}
                      </div>
                    </div>

                    {/* Category 4: AI Verification Insights */}
                    {app.aiFindings && app.aiFindings.length > 0 && (
                      <div className="border-t border-border-muted pt-4">
                        <h4 className="text-xs font-bold text-error uppercase tracking-wider mb-3">
                          AI Verification Discrepancies ({app.aiFindings.length})
                        </h4>
                        <div className="flex flex-col gap-3">
                          {app.aiFindings.map((finding: any, idx: number) => (
                            <div key={finding.id || idx} className="p-4 border border-error/20 bg-error/5 rounded-lg flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <h5 className="text-xs font-bold text-text-main flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                  {finding.title || 'Discrepancy'}
                                </h5>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-error/10 text-error font-semibold uppercase">{finding.severity} Severity</span>
                              </div>
                              <p className="text-xs text-text-muted leading-relaxed">
                                {finding.description}
                              </p>
                              <div className="bg-white p-2.5 rounded text-[11px] font-medium text-text-muted border-l-2 border-primary mt-1">
                                <span className="font-semibold text-primary block uppercase text-[9px] mb-0.5">Required Action</span>
                                {finding.suggestedAction}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
