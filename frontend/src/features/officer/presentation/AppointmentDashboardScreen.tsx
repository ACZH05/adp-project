"use client";

import React, { useState, useEffect } from 'react';
import { FullCalendar } from './components/FullCalendar';
import { AppointmentTable } from './components/AppointmentTable';
import { OfficerAppointment } from '../data/mockAppointments';
import { useToast } from '@/src/shared/hooks/useToast';
import { ToastNotification } from '@/src/shared/components/ToastNotification';
import { appointmentApi } from '../../appointments/data/appointmentApi';

export const AppointmentDashboardScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<OfficerAppointment[]>([]);
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentApi.getPendingRequests();
      const formatted: OfficerAppointment[] = data.map((appt: any) => ({
        id: appt.id,
        applicantName: `${appt.applicant.firstName} ${appt.applicant.lastName}`,
        applicationId: appt.application.applicationNo || appt.application.id,
        date: new Date(appt.preferredStartAt).toISOString().split('T')[0],
        time: new Date(appt.preferredStartAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'License Collection',
        status: appt.status.charAt(0).toUpperCase() + appt.status.slice(1),
      }));
      setAppointments(formatted);
    } catch (err: any) {
      showToast(err.message, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await appointmentApi.decideAppointment(id, 'approve');
      showToast(`Appointment ${id} approved successfully. Applicant notified.`, 'success');
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  const handleReschedule = async (id: string) => {
    // We treat "Reschedule" as Reject in this MVP unless specific reschedule endpoint exists.
    try {
      await appointmentApi.decideAppointment(id, 'reject', 'Please choose another time slot.');
      showToast(`Appointment ${id} rejected. Applicant asked to reschedule.`, 'info');
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto gap-6 overflow-hidden">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <span>Officer Portal</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-text-main">Appointment Management</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Appointment Management
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full items-stretch">
          {/* List View - Comes first per spec */}
          <div className="xl:col-span-4 flex flex-col bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <AppointmentTable 
              appointments={appointments.filter(app => app.status === 'Pending' || app.status === 'Conflicted')} 
              onApprove={handleApprove}
              onReschedule={handleReschedule}
            />
          </div>

          {/* Calendar View */}
          <div className="xl:col-span-8 flex flex-col min-h-[500px] bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <FullCalendar appointments={appointments} />
          </div>
        </section>
      </main>
      <ToastNotification toast={toast} />
    </>
  );
};
