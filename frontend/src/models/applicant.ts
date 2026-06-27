export type ApplicationStatus = 'Pending' | 'AI-Ready' | 'Flagged' | 'Processed' | 'Rejected' | 'Draft';

export interface ApplicationVersion {
  id: string;
  version: number;
  submittedAt: string;
  changeSummary: string;
}

export interface VerificationIssue {
  id: string;
  field: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface VerificationReport {
  id: string;
  confidence: number;
  status: 'pending' | 'passed' | 'flagged' | 'failed';
  issues: VerificationIssue[];
  generatedAt: string;
}

export interface VerificationJob {
  id: string;
  applicationId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  report?: VerificationReport;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  licenseType: string;
  submissionDate: string;
  status: ApplicationStatus;
  aiConfidence: number;
  documents: {
    total: number;
    approved: number;
    flagged: number;
  };
  versions?: ApplicationVersion[];
  verificationJob?: VerificationJob;
}

export interface Appointment {
  id: string;
  applicationId: string;
  date: string;
  time: string;
  available: boolean;
  status?: 'available' | 'booked' | 'confirmed' | 'cancelled';
}

export interface TimelineItem {
  label: string;
  date: string;
  desc: string;
  active: boolean;
  done: boolean;
}
