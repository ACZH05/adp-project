import { TimelineItem } from '@/src/models/applicant';

export const mockApplicantTimeline: TimelineItem[] = [
  {
    label: 'Application Submitted',
    date: 'June 16, 2026',
    desc: 'Enqueued in AI Processing Engine',
    active: true,
    done: true,
  },
  {
    label: 'AI Pre-Verification',
    date: 'June 16, 2026',
    desc: 'Document checks complete (45% confidence)',
    active: true,
    done: true,
  },
  {
    label: 'Officer Case Assignment',
    date: 'Pending',
    desc: 'Waiting for municipal officer review',
    active: true,
    done: false,
  },
  {
    label: 'Municipal Premises Audit',
    date: 'Scheduled',
    desc: 'Pending office inspection approval',
    active: false,
    done: false,
  },
];
