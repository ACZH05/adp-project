"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { TopNav } from '@/src/shared/components/TopNav';
import { CalendarPicker } from './components/CalendarPicker';
import { TimeSlotGrid, TimeSlot } from './components/TimeSlotGrid';

const MOCK_SLOTS: TimeSlot[] = [
  { id: '1', time: '09:00 AM', available: false },
  { id: '2', time: '09:30 AM', available: true },
  { id: '3', time: '10:00 AM', available: true },
  { id: '4', time: '10:30 AM', available: true },
  { id: '5', time: '11:00 AM', available: false },
  { id: '6', time: '11:30 AM', available: true },
  { id: '7', time: '02:00 PM', available: true },
  { id: '8', time: '02:30 PM', available: true },
  { id: '9', time: '03:00 PM', available: false },
];

export const BookAppointmentScreen: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 23));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const handleConfirm = () => {
    // Navigate back to dashboard with success (mock behavior)
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <TopNav />
      <main className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* Page Header */}
        <div className="flex flex-col border-b border-border-muted pb-6 mb-2">
          <button onClick={handleBack} className="text-xs font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1.5 mb-4 w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Application #APP-2024-8992
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2">Book Inspection Appointment</h1>
          <p className="text-sm text-text-muted max-w-3xl">
            Your application for the Commercial Food Prep Facility license has been approved. Please select a date and time below for the required on-site health and safety inspection.
          </p>
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
            
            {/* Inspector Notes */}
            <Card className="p-6 bg-white border-border-muted shadow-none">
              <div className="flex flex-col gap-2">
                <label htmlFor="inspector-notes" className="text-sm font-bold text-text-main">
                  Notes for Inspector (Optional)
                </label>
                <textarea 
                  id="inspector-notes"
                  rows={4}
                  className="w-full p-3 border border-border-muted rounded-default text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                  placeholder="e.g., Use the rear entrance in the alleyway. Ring the bell labeled 'Kitchen'."
                />
              </div>
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
                  slots={MOCK_SLOTS}
                  selectedSlotId={selectedSlotId}
                  onSlotSelect={setSelectedSlotId}
                />
              ) : (
                <div className="text-center py-12 text-text-muted text-sm border-2 border-dashed border-slate-200 rounded-lg">
                  Please select a date from the calendar.
                </div>
              )}
            </Card>

            {/* Info Banner & Action Wrapper */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="bg-info/10 border border-info/20 rounded-default p-4 flex gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-info shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p className="text-sm text-info font-medium leading-snug">
                  Inspections typically take 45-60 minutes. Please ensure an authorized representative is present.
                </p>
              </div>
              
              <Button 
                className="w-full justify-center h-12 text-base shadow-sm" 
                variant="deep-navy"
                disabled={!selectedDate || !selectedSlotId}
                onClick={handleConfirm}
              >
                Confirm Appointment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
