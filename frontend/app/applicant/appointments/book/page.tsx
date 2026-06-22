import React from 'react';
import { BookAppointmentScreen } from '@/src/features/appointments/presentation/BookAppointmentScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment | Civic Precision',
  description: 'Schedule a physical visit for your application.',
};

export default function BookAppointmentPage() {
  return <BookAppointmentScreen />;
}
