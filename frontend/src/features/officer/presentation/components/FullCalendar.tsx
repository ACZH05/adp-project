import React, { useState } from 'react';
import { OfficerAppointment } from '../../data/mockAppointments';

interface FullCalendarProps {
  appointments: OfficerAppointment[];
}

export const FullCalendar: React.FC<FullCalendarProps> = ({ appointments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // Mocking June 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startDay }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Helper to get appointments for a specific day
  const getDayAppointments = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(app => app.date === dateStr);
  };

  return (
    <div className="bg-white border border-border-muted rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-muted bg-surface-container-low shrink-0">
        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-surface-variant rounded text-text-muted transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2 className="font-bold text-lg text-primary">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={handleNextMonth} className="p-1.5 hover:bg-surface-variant rounded text-text-muted transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-border-muted bg-surface text-center shrink-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider border-r border-border-muted last:border-0">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-border-muted gap-px">
        {paddingDays.map(i => (
          <div key={`empty-${i}`} className="bg-surface-container-lowest p-2" />
        ))}
        {days.map(day => {
          const dayApps = getDayAppointments(day);
          const hasConflict = dayApps.some(a => a.status === 'Conflicted');

          return (
            <div key={day} className={`bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50 min-h-[100px] ${hasConflict ? 'bg-error-container/40 border border-error/20' : ''}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${hasConflict ? 'text-error' : 'text-text-main'}`}>{day}</span>
                <div className="flex items-center gap-1.5">
                  {hasConflict && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-error">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                  {dayApps.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded-full">
                      {dayApps.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-1 overflow-y-auto hide-scrollbar">
                {dayApps.map(app => {
                  let bgColor = 'bg-info/10 border-info/20 text-info';
                  if (app.status === 'Approved') bgColor = 'bg-success/10 border-success/20 text-success';
                  if (app.status === 'Conflicted') bgColor = 'bg-error/10 border-error/20 text-error';

                  return (
                    <div key={app.id} className={`text-[10px] font-semibold border rounded px-1.5 py-1 truncate ${bgColor}`} title={`${app.time} - ${app.applicantName}`}>
                      {app.time} {app.type}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* Fill remaining cells if needed to complete the grid visually */}
        {Array.from({ length: 35 - days.length - paddingDays.length }).map((_, i) => (
           <div key={`fill-${i}`} className="bg-surface-container-lowest p-2" />
        ))}
      </div>
    </div>
  );
};
