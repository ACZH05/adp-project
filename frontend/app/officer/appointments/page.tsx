import React from 'react';
import { AppointmentDashboardScreen } from '@/src/features/officer/presentation/AppointmentDashboardScreen';

export const metadata = {
  title: 'Appointment Management | Officer Portal',
  description: 'Manage visit schedules and approve appointments.',
};

export default function OfficerAppointmentsPage() {
  return <AppointmentDashboardScreen />;
}
