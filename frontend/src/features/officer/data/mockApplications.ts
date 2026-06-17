export interface Application {
  id: string;
  applicantName: string;
  licenseType: string;
  submissionDate: string;
  status: 'Pending' | 'AI-Ready' | 'Flagged' | 'Processed';
  aiConfidence: number;
  isUrgent: boolean;
}

export interface QueueStats {
  pendingReview: number;
  highConfidence: number;
  urgentCases: number;
  processedToday: number;
  processedTodayTarget: number;
}

export const mockApplications: Application[] = [
  {
    id: "APP-2026-001",
    applicantName: "Sarah Lim",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-17",
    status: "AI-Ready",
    aiConfidence: 94,
    isUrgent: false,
  },
  {
    id: "APP-2026-002",
    applicantName: "Tan Kah Kee",
    licenseType: "Food Establishment License",
    submissionDate: "2026-06-17",
    status: "Flagged",
    aiConfidence: 38,
    isUrgent: true,
  },
  {
    id: "APP-2026-003",
    applicantName: "Michael Chen",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-16",
    status: "Pending",
    aiConfidence: 76,
    isUrgent: false,
  },
  {
    id: "APP-2026-004",
    applicantName: "Fatimah Abdullah",
    licenseType: "Business Registration",
    submissionDate: "2026-06-16",
    status: "Processed",
    aiConfidence: 88,
    isUrgent: false,
  },
  {
    id: "APP-2026-005",
    applicantName: "Johnathan Smith",
    licenseType: "Food Establishment License",
    submissionDate: "2026-06-15",
    status: "Flagged",
    aiConfidence: 42,
    isUrgent: true,
  },
  {
    id: "APP-2026-006",
    applicantName: "Priya Gopal",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-15",
    status: "AI-Ready",
    aiConfidence: 89,
    isUrgent: false,
  },
  {
    id: "APP-2026-007",
    applicantName: "David Wong",
    licenseType: "Liquor License",
    submissionDate: "2026-06-14",
    status: "Processed",
    aiConfidence: 95,
    isUrgent: false,
  },
  {
    id: "APP-2026-008",
    applicantName: "Lee Min Ho",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-14",
    status: "Pending",
    aiConfidence: 65,
    isUrgent: false,
  },
  {
    id: "APP-2026-009",
    applicantName: "Rachel Green",
    licenseType: "Business Registration",
    submissionDate: "2026-06-13",
    status: "Processed",
    aiConfidence: 91,
    isUrgent: false,
  },
  {
    id: "APP-2026-010",
    applicantName: "Ahmad Bin Ibrahim",
    licenseType: "Food Establishment License",
    submissionDate: "2026-06-13",
    status: "Flagged",
    aiConfidence: 25,
    isUrgent: true,
  },
  {
    id: "APP-2026-011",
    applicantName: "Jessica Jung",
    licenseType: "Liquor License",
    submissionDate: "2026-06-12",
    status: "AI-Ready",
    aiConfidence: 82,
    isUrgent: false,
  },
  {
    id: "APP-2026-012",
    applicantName: "Kumar Raj",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-12",
    status: "Pending",
    aiConfidence: 58,
    isUrgent: false,
  },
];

export const getQueueStats = (apps: Application[]): QueueStats => {
  const pendingReview = apps.filter(app => app.status !== "Processed").length;
  const highConfidence = apps.filter(app => app.status === "AI-Ready" && app.aiConfidence >= 80).length;
  const urgentCases = apps.filter(app => app.isUrgent && app.status !== "Processed").length;
  const processedToday = apps.filter(app => app.status === "Processed").length; // simulated for mock purposes
  
  return {
    pendingReview,
    highConfidence,
    urgentCases,
    processedToday,
    processedTodayTarget: 10,
  };
};
