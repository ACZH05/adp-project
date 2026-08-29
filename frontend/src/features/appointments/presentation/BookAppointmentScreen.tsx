"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { APPLICANT_ROUTES } from '@/src/features/applicant/data/applicantConstants';
import { CalendarPicker } from './components/CalendarPicker';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { appointmentApi } from '../data/appointmentApi';

export const BookAppointmentScreen: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch eligible applications
    appointmentApi.getEligibleApplications()
      .then(apps => {
        setApplications(apps);
        if (apps.length > 0) {
          setSelectedApplicationId(apps[0].id);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // Fetch slots
      const dateStr = selectedDate.toISOString().split('T')[0];
      appointmentApi.getAvailableSlots(dateStr)
        .then(slots => {
          // Map to TimeSlotGrid expected format
          const formatted = slots.map((s: any, idx: number) => ({
            id: String(idx),
            startAt: s.startAt,
            endAt: s.endAt,
            time: new Date(s.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            available: true,
          }));
          setAvailableSlots(formatted);
        })
        .catch(console.error);
    }
  }, [selectedDate]);

  const handleConfirm = async () => {
    if (!selectedApplicationId || !selectedSlotId) return;
    
    setSubmitting(true);
    const slot = availableSlots.find(s => s.id === selectedSlotId);
    try {
      await appointmentApi.requestAppointment(selectedApplicationId, slot.startAt, slot.endAt);
      router.push(APPLICANT_ROUTES.dashboard);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (applications.length === 0) {
    return (
      <main className="w-full max-w-container-max-width mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
        <Card className="p-6">
          <p>You have no approved applications eligible for appointment scheduling.</p>
          <Button onClick={handleBack} className="mt-4">Go Back</Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* Page Header */}
        <div className="flex flex-col border-b border-border-muted pb-6 mb-2">
          <button onClick={handleBack} className="text-xs font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1.5 mb-4 w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2">Book License Collection Appointment</h1>
          
          <select 
            className="mt-4 p-2 border rounded-md max-w-md"
            value={selectedApplicationId || ''}
            onChange={(e) => setSelectedApplicationId(e.target.value)}
          >
            {applications.map(app => (
              <option key={app.id} value={app.id}>Application #{app.applicationNo}</option>
            ))}
          </select>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Calendar Card */}
            <Card className="p-6 bg-white border-border-muted shadow-none">
              <CalendarPicker 
                selectedDate={selectedDate} 
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlotId(null);
                }} 
              />
            </Card>
          </div>

          {/* Right Column (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
            {/* Available Times Card */}
            <Card className="p-6 bg-white border-border-muted shadow-none">
              <h3 className="text-base font-bold text-primary border-b border-border-muted pb-3 mb-6">
                {selectedDate ? `Available Times for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}` : 'Select a date'}
              </h3>
              
              {selectedDate ? (
                <TimeSlotGrid 
                  slots={availableSlots}
                  selectedSlotId={selectedSlotId}
                  onSlotSelect={setSelectedSlotId}
                />
              ) : (
                <div className="text-center py-12 text-text-muted text-sm border-2 border-dashed border-slate-200 rounded-lg">
                  Please select a date from the calendar.
                </div>
              )}
            </Card>

            <div className="flex flex-col gap-4 mt-2">
              <Button 
                className="w-full justify-center h-12 text-base shadow-sm" 
                variant="deep-navy"
                disabled={!selectedDate || !selectedSlotId || submitting}
                onClick={handleConfirm}
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            </div>
          </div>
        </div>
      </main>
  );
};
