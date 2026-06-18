import React from 'react';
import { AnalyticsDashboardScreen } from '@/src/features/officer/presentation/AnalyticsDashboardScreen';

export const metadata = {
  title: 'Analytics Overview | Officer Portal',
  description: 'Real-time monitoring of system-wide performance, document verification throughput, and AI model metrics.',
};

export default function OfficerAnalyticsPage() {
  return <AnalyticsDashboardScreen />;
}
