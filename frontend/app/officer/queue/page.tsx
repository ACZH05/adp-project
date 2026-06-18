import React from 'react';
import { ApplicationQueueScreen } from '@/src/features/officer/presentation/ApplicationQueueScreen';

export const metadata = {
  title: 'Application Queue | Officer Portal',
  description: 'Manage and review pending license applications with automated AI analysis.',
};

export default function OfficerQueuePage() {
  return <ApplicationQueueScreen />;
}
