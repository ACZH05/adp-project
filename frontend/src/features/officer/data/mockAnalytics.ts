export interface VolumeDataPoint {
  label: string;
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

export interface ProcessingTimeDataPoint {
  label: string;
  avgTime: number; // in seconds
}

export interface GoalProgress {
  name: string;
  target: number; // e.g. 60
  current: number; // e.g. 64.2
  unit: string; // e.g. '%'
  description: string;
}

export interface AnalyticsSummary {
  totalApps: number;
  approvedApps: number;
  pendingApps: number;
  rejectedApps: number;
  avgProcessingTime: number; // overall avg
  goalProgress: GoalProgress[];
  volumeData: VolumeDataPoint[];
  processingTimeData: ProcessingTimeDataPoint[];
}

export const mockAnalyticsData: Record<string, AnalyticsSummary> = {
  '7days': {
    totalApps: 34,
    approvedApps: 18,
    pendingApps: 12,
    rejectedApps: 4,
    avgProcessingTime: 1.15,
    goalProgress: [
      {
        name: "Reduction in Incomplete Apps",
        target: 60,
        current: 65.5,
        unit: "%",
        description: "Target: 60% reduction in incomplete submittals through pre-validation"
      },
      {
        name: "AI Verification Accuracy",
        target: 95,
        current: 98.1,
        unit: "%",
        description: "Target: >95% model match accuracy compared to manual audit"
      }
    ],
    volumeData: [
      { label: 'Mon', approved: 3, pending: 2, rejected: 0, total: 5 },
      { label: 'Tue', approved: 4, pending: 1, rejected: 1, total: 6 },
      { label: 'Wed', approved: 2, pending: 3, rejected: 1, total: 6 },
      { label: 'Thu', approved: 3, pending: 2, rejected: 0, total: 5 },
      { label: 'Fri', approved: 4, pending: 2, rejected: 1, total: 7 },
      { label: 'Sat', approved: 1, pending: 1, rejected: 0, total: 2 },
      { label: 'Sun', approved: 1, pending: 1, rejected: 1, total: 3 },
    ],
    processingTimeData: [
      { label: 'Mon', avgTime: 1.25 },
      { label: 'Tue', avgTime: 1.18 },
      { label: 'Wed', avgTime: 1.22 },
      { label: 'Thu', avgTime: 1.10 },
      { label: 'Fri', avgTime: 1.08 },
      { label: 'Sat', avgTime: 1.12 },
      { label: 'Sun', avgTime: 1.14 },
    ]
  },
  '30days': {
    totalApps: 156,
    approvedApps: 88,
    pendingApps: 46,
    rejectedApps: 22,
    avgProcessingTime: 1.20,
    goalProgress: [
      {
        name: "Reduction in Incomplete Apps",
        target: 60,
        current: 64.2,
        unit: "%",
        description: "Target: 60% reduction in incomplete submittals through pre-validation"
      },
      {
        name: "AI Verification Accuracy",
        target: 95,
        current: 97.8,
        unit: "%",
        description: "Target: >95% model match accuracy compared to manual audit"
      }
    ],
    volumeData: [
      { label: 'Week 1', approved: 20, pending: 12, rejected: 4, total: 36 },
      { label: 'Week 2', approved: 22, pending: 10, rejected: 6, total: 38 },
      { label: 'Week 3', approved: 24, pending: 14, rejected: 7, total: 45 },
      { label: 'Week 4', approved: 22, pending: 10, rejected: 5, total: 37 },
    ],
    processingTimeData: [
      { label: 'Week 1', avgTime: 1.28 },
      { label: 'Week 2', avgTime: 1.22 },
      { label: 'Week 3', avgTime: 1.18 },
      { label: 'Week 4', avgTime: 1.12 },
    ]
  },
  '90days': {
    totalApps: 492,
    approvedApps: 274,
    pendingApps: 148,
    rejectedApps: 70,
    avgProcessingTime: 1.24,
    goalProgress: [
      {
        name: "Reduction in Incomplete Apps",
        target: 60,
        current: 62.8,
        unit: "%",
        description: "Target: 60% reduction in incomplete submittals through pre-validation"
      },
      {
        name: "AI Verification Accuracy",
        target: 95,
        current: 97.4,
        unit: "%",
        description: "Target: >95% model match accuracy compared to manual audit"
      }
    ],
    volumeData: [
      { label: 'Apr 2026', approved: 82, pending: 46, rejected: 22, total: 150 },
      { label: 'May 2026', approved: 94, pending: 52, rejected: 26, total: 172 },
      { label: 'Jun 2026', approved: 98, pending: 50, rejected: 22, total: 170 },
    ],
    processingTimeData: [
      { label: 'Apr 2026', avgTime: 1.32 },
      { label: 'May 2026', avgTime: 1.24 },
      { label: 'Jun 2026', avgTime: 1.16 },
    ]
  },
  '12months': {
    totalApps: 1845,
    approvedApps: 1050,
    pendingApps: 540,
    rejectedApps: 255,
    avgProcessingTime: 1.31,
    goalProgress: [
      {
        name: "Reduction in Incomplete Apps",
        target: 60,
        current: 61.4,
        unit: "%",
        description: "Target: 60% reduction in incomplete submittals through pre-validation"
      },
      {
        name: "AI Verification Accuracy",
        target: 95,
        current: 97.1,
        unit: "%",
        description: "Target: >95% model match accuracy compared to manual audit"
      }
    ],
    volumeData: [
      { label: 'Jul 2025', approved: 72, pending: 38, rejected: 20, total: 130 },
      { label: 'Aug 2025', approved: 80, pending: 42, rejected: 18, total: 140 },
      { label: 'Sep 2025', approved: 85, pending: 45, rejected: 22, total: 152 },
      { label: 'Oct 2025', approved: 90, pending: 48, rejected: 24, total: 162 },
      { label: 'Nov 2025', approved: 78, pending: 40, rejected: 19, total: 137 },
      { label: 'Dec 2025', approved: 92, pending: 50, rejected: 25, total: 167 },
      { label: 'Jan 2026', approved: 88, pending: 46, rejected: 22, total: 156 },
      { label: 'Feb 2026', approved: 94, pending: 52, rejected: 24, total: 170 },
      { label: 'Mar 2026', approved: 102, pending: 56, rejected: 28, total: 186 },
      { label: 'Apr 2026', approved: 95, pending: 52, rejected: 24, total: 171 },
      { label: 'May 2026', approved: 105, pending: 58, rejected: 27, total: 190 },
      { label: 'Jun 2026', approved: 109, pending: 60, rejected: 26, total: 195 },
    ],
    processingTimeData: [
      { label: 'Jul 2025', avgTime: 1.48 },
      { label: 'Aug 2025', avgTime: 1.45 },
      { label: 'Sep 2025', avgTime: 1.42 },
      { label: 'Oct 2025', avgTime: 1.38 },
      { label: 'Nov 2025', avgTime: 1.35 },
      { label: 'Dec 2025', avgTime: 1.32 },
      { label: 'Jan 2026', avgTime: 1.30 },
      { label: 'Feb 2026', avgTime: 1.28 },
      { label: 'Mar 2026', avgTime: 1.24 },
      { label: 'Apr 2026', avgTime: 1.22 },
      { label: 'May 2026', avgTime: 1.18 },
      { label: 'Jun 2026', avgTime: 1.15 },
    ]
  }
};
