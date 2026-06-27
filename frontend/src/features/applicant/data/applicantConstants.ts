import { ApplicationStatus } from '@/src/models/applicant';

export const APPLICANT_ROUTES = {
  dashboard: '/applicant/dashboard',
  applications: '/applicant/applications',
  applyStart: '/applicant/apply/1',
  appointments: '/applicant/appointments',
} as const;

const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  Pending: 'Pending',
  'AI-Ready': 'AI-Ready',
  Flagged: 'Flagged',
  Processed: 'Processed',
  Rejected: 'Rejected',
  Draft: 'Draft',
};

export const APPLICATION_STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: APPLICATION_STATUS_LABELS.Pending },
  { value: 'ai-ready', label: APPLICATION_STATUS_LABELS['AI-Ready'] },
  { value: 'flagged', label: APPLICATION_STATUS_LABELS.Flagged },
  { value: 'processed', label: APPLICATION_STATUS_LABELS.Processed },
  { value: 'rejected', label: APPLICATION_STATUS_LABELS.Rejected },
  { value: 'draft', label: APPLICATION_STATUS_LABELS.Draft },
] as const;
