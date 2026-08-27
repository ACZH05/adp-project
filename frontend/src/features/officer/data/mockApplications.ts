export interface Application {
  id: string;
  displayId?: string;
  applicantName: string;
  applicantIcNo?: string;
  businessName?: string;
  licenseType: string;
  submissionDate: string;
  status: 'Passed' | 'Issues Found' | 'Low Confidence' | 'Failed' | 'Pending' | 'AI-Ready' | 'Flagged' | 'Processed' | 'Approved' | 'Rejected';
  dbStatus?: string;
  aiConfidence: number;
  isUrgent: boolean;
}

export interface QueueStats {
  pendingReview: number;
  highConfidence: number;
  lowConfidence: number;
  urgentCases: number;
  processedToday: number;
  processedTodayTarget: number;
}

export const mockApplications: Application[] = [];

export const getQueueStats = (apps: Application[]): QueueStats => {
  const isFinal = (s: string) => s === 'Processed' || s === 'Approved' || s === 'Rejected';
  const pendingReview = apps.filter(app => !isFinal(app.status)).length;
  const highConfidence = apps.filter(app => !isFinal(app.status) && app.aiConfidence >= 80).length;
  const lowConfidence = apps.filter(app => !isFinal(app.status) && app.aiConfidence < 50).length;
  const urgentCases = apps.filter(app => app.isUrgent && !isFinal(app.status)).length;
  const processedToday = apps.filter(app => app.status === "Processed" || app.status === "Approved").length;
  
  return {
    pendingReview,
    highConfidence,
    lowConfidence,
    urgentCases,
    processedToday,
    processedTodayTarget: 10,
  };
};
