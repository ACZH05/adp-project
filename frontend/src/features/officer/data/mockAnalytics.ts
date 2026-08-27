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

export const mockAnalyticsData: Record<string, AnalyticsSummary> = {};
