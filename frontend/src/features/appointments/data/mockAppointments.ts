import { Appointment } from '@/src/models/applicant';

export const mockAppointmentSlots: Appointment[] = [
  { id: '1', applicationId: 'APP-2026-002', date: '2026-06-23', time: '09:00 AM', available: false, status: 'booked' },
  { id: '2', applicationId: 'APP-2026-002', date: '2026-06-23', time: '09:30 AM', available: true, status: 'available' },
  { id: '3', applicationId: 'APP-2026-002', date: '2026-06-23', time: '10:00 AM', available: true, status: 'available' },
  { id: '4', applicationId: 'APP-2026-002', date: '2026-06-23', time: '10:30 AM', available: true, status: 'available' },
  { id: '5', applicationId: 'APP-2026-002', date: '2026-06-23', time: '11:00 AM', available: false, status: 'booked' },
  { id: '6', applicationId: 'APP-2026-002', date: '2026-06-23', time: '11:30 AM', available: true, status: 'available' },
  { id: '7', applicationId: 'APP-2026-002', date: '2026-06-23', time: '02:00 PM', available: true, status: 'available' },
  { id: '8', applicationId: 'APP-2026-002', date: '2026-06-23', time: '02:30 PM', available: true, status: 'available' },
  { id: '9', applicationId: 'APP-2026-002', date: '2026-06-23', time: '03:00 PM', available: false, status: 'booked' },
];
