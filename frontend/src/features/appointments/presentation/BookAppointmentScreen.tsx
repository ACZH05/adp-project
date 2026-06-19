"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
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

  const selectedSlot = MOCK_SLOTS.find(s => s.id === selectedSlotId);

  return (
    <div className="w-full max-w-container-max-width mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4 flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold text-text-muted">Applicant Portal</span>
          <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">Schedule Appointment</h1>
        </div>
        <div>
          <Button variant="secondary" onClick={handleBack}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calendar & Time Slots */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Select Date */}
          <section>
            <h2 className="text-lg font-bold text-text-main mb-4">
              Select Date
            </h2>
            <div className="max-w-md">
              <CalendarPicker 
                selectedDate={selectedDate} 
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlotId(null);
                }} 
              />
            </div>
          </section>

          {/* Select Time */}
          <section>
            <h2 className="text-lg font-bold text-text-main mb-4">
              Select Time
            </h2>
            <Card className="p-6 bg-white border-border-muted">
              {selectedDate ? (
                <TimeSlotGrid 
                  slots={MOCK_SLOTS}
                  selectedSlotId={selectedSlotId}
                  onSlotSelect={setSelectedSlotId}
                />
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  Please select a date first to view available times.
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Right Column: Summary & Confirmation */}
        <div className="lg:col-span-4">
          <Card className="p-6 bg-surface-container-low border-border-muted sticky top-8">
            <h3 className="text-base font-bold text-primary border-b border-border-muted pb-3 mb-4">
              Appointment Summary
            </h3>
            
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-semibold text-text-main">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Time</p>
                <p className="text-sm font-semibold text-text-main">
                  {selectedSlot ? selectedSlot.time : 'Not selected'}
                </p>
              </div>
            </div>

            <Button 
              className="w-full justify-center" 
              disabled={!selectedDate || !selectedSlotId}
              onClick={handleConfirm}
            >
              Confirm Appointment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
