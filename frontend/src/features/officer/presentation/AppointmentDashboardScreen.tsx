"use client";

import React, { useState } from 'react';
import { SideNav } from './SideNav';
import { FullCalendar } from './components/FullCalendar';
import { AppointmentTable } from './components/AppointmentTable';
import { mockOfficerAppointments, OfficerAppointment } from '../data/mockAppointments';
import { useToast } from '@/src/shared/hooks/useToast';
import { ToastNotification } from '@/src/shared/components/ToastNotification';

export const AppointmentDashboardScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<OfficerAppointment[]>([]);
  const { toast, showToast } = useToast();

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:8082/admin/appointments', {
          headers: {
            'Authorization': 'Bearer mock-admin-token'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((app: any) => ({
            id: app.id,
            applicantName: app.applicantId,
            applicationId: app.applicationId,
            date: app.requestedDate.split('T')[0],
            time: app.requestedTime,
            type: 'Inspection',
            status: app.status === 'PENDING' ? 'Pending' : app.status === 'APPROVED' ? 'Approved' : app.status
          }));
          setAppointments(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch appointments', e);
      }
    };
    fetchAppointments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8082/admin/appointments/${id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-admin-token'
        },
        body: JSON.stringify({ decision: 'APPROVED', adminId: 'admin-1', reason: 'Approved via portal' })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'Approved' } : app
        ));
        showToast(`Appointment approved successfully. Applicant notified.`, 'success');
      } else {
        showToast(`Failed to approve appointment.`, 'error');
      }
    } catch (e) {
      showToast(`Error approving appointment.`, 'error');
    }
  };

  const handleReschedule = (id: string) => {
    // In a real app, this would open a modal to select a new date/time
    showToast(`Initiated reschedule flow for ${id}.`, 'info');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      <SideNav activePath="/officer/appointments" />
      <div className="hidden lg:block w-64 shrink-0" />

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
    </div>
  );
};
