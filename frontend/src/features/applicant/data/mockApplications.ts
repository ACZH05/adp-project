import { Application } from '@/src/models/applicant';

export const mockApplicantApplications: Application[] = [
  {
    id: 'APP-2026-001',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-17',
    status: 'AI-Ready',
    aiConfidence: 94,
    documents: { total: 4, approved: 4, flagged: 0 },
  },
  {
    id: 'APP-2026-002',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-17',
    status: 'Flagged',
    aiConfidence: 38,
    documents: { total: 4, approved: 3, flagged: 1 },
  },
  {
    id: 'APP-2026-003',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-16',
    status: 'Pending',
    aiConfidence: 76,
    documents: { total: 3, approved: 2, flagged: 0 },
  },
  {
    id: 'APP-2026-004',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-16',
    status: 'Processed',
    aiConfidence: 88,
    documents: { total: 4, approved: 4, flagged: 0 },
  },
  {
    id: 'APP-2026-015',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-22',
    status: 'Pending',
    aiConfidence: 50,
    documents: { total: 3, approved: 1, flagged: 0 },
  },
  {
    id: 'APP-2026-016',
    licenseType: 'Entertainment License',
    submissionDate: '2026-06-22',
    status: 'Draft',
    aiConfidence: 0,
    documents: { total: 0, approved: 0, flagged: 0 },
  },
];
