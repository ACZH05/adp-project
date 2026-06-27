import React from 'react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSlotSelect: (id: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ slots, selectedSlotId, onSlotSelect }) => {
  const morningSlots = slots.filter(slot => slot.time.includes('AM'));
  const afternoonSlots = slots.filter(slot => slot.time.includes('PM'));

  const renderSlots = (slotGroup: TimeSlot[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slotGroup.map(slot => {
        const isSelected = selectedSlotId === slot.id;
        return (
          <button
            key={slot.id}
            disabled={!slot.available}
            onClick={() => onSlotSelect(slot.id)}
            className={`
              relative p-3 rounded-default border text-sm font-semibold transition-colors flex flex-col items-center justify-center
              ${!slot.available ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed' : ''}
              ${slot.available && !isSelected ? 'bg-white border-border-muted text-text-main hover:border-primary hover:text-primary hover:bg-primary-fixed hover:shadow-sm' : ''}
              ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : ''}
            `}
          >
            {slot.time}
            {!slot.available && (
              <span className="text-[10px] mt-0.5 uppercase tracking-wider font-bold text-slate-500">Booked</span>
            )}
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-success text-white rounded-full flex items-center justify-center shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {morningSlots.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Morning</h4>
          {renderSlots(morningSlots)}
        </div>
      )}
      {afternoonSlots.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Afternoon</h4>
          {renderSlots(afternoonSlots)}
        </div>
      )}
    </div>
  );
};
