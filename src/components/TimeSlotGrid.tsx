'use client';

import { TimeSlot } from '@/types';
import { formatDisplayTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  slots: TimeSlot[];
  selectedStart: string | null;
  selectedEnd: string | null;
  onSelectStart: (time: string) => void;
  loading?: boolean;
}

export default function TimeSlotGrid({ slots, selectedStart, selectedEnd, onSelectStart, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-11 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected =
          selectedStart !== null &&
          selectedEnd !== null &&
          slot.time >= selectedStart &&
          slot.time < selectedEnd;
        const isStart = slot.time === selectedStart;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => slot.available && onSelectStart(slot.time)}
            className={cn(
              'relative h-11 rounded-lg text-sm font-semibold transition-all duration-150 border',
              slot.available
                ? isSelected || isStart
                  ? 'bg-pcl-blue text-white border-pcl-blue shadow-sm'
                  : 'bg-white text-pcl-dark-gray border-gray-200 hover:border-pcl-blue hover:text-pcl-blue'
                : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
            )}
          >
            {formatDisplayTime(slot.time)}
            {!slot.available && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pcl-pink" />
            )}
          </button>
        );
      })}
    </div>
  );
}
