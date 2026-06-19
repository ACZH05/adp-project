import React from 'react';

export interface TimeSlot {
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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map(slot => {
        const isSelected = selectedSlotId === slot.id;
        return (
          <button
            key={slot.id}
            disabled={!slot.available}
            onClick={() => onSlotSelect(slot.id)}
            className={`
              p-3 rounded-full border text-sm font-semibold transition-colors flex items-center justify-center
              ${!slot.available ? 'bg-surface-variant border-border-muted text-text-muted opacity-50 cursor-not-allowed' : ''}
              ${slot.available && !isSelected ? 'bg-white border-border-muted text-text-main hover:border-primary hover:text-primary hover:bg-primary-fixed hover:shadow-sm' : ''}
              ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : ''}
            `}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
};
