import React, { useState } from 'react';

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onDateSelect }) => {
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

  const isSelected = (day: number) => {
    return selectedDate?.getDate() === day && 
           selectedDate?.getMonth() === currentMonth.getMonth() && 
           selectedDate?.getFullYear() === currentMonth.getFullYear();
  };

  return (
    <div className="border border-border-muted rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-muted bg-surface-container-low">
        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-surface-variant rounded text-text-muted transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="font-bold text-primary">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button onClick={handleNextMonth} className="p-1.5 hover:bg-surface-variant rounded text-text-muted transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-border-muted bg-surface text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 p-2 gap-1 text-sm">
        {paddingDays.map(i => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {days.map(day => {
          const selected = isSelected(day);
          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={`
                aspect-square flex items-center justify-center rounded transition-colors
                ${selected 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'text-text-main hover:bg-primary-fixed hover:text-on-primary-fixed hover:font-bold'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
