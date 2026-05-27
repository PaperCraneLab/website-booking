'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { isBefore, startOfDay } from 'date-fns';

interface Props {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function BookingCalendar({ selected, onSelect }: Props) {
  const today = startOfDay(new Date());

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={(date) => isBefore(date, today)}
        showOutsideDays={false}
        classNames={{
          root: 'font-sans',
          months: 'flex gap-4',
          month: 'space-y-3',
          caption: 'flex justify-center relative items-center mb-2',
          caption_label: 'font-bold text-pcl-dark-gray text-sm',
          nav: 'flex items-center gap-1',
          nav_button:
            'h-7 w-7 bg-transparent hover:bg-pcl-blue/10 rounded-md flex items-center justify-center text-pcl-dark-gray transition-colors',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse',
          head_row: 'flex',
          head_cell: 'text-gray-400 rounded-md w-9 font-normal text-xs text-center',
          row: 'flex w-full mt-1',
          cell: 'h-9 w-9 text-center text-sm p-0 relative',
          day: 'h-9 w-9 p-0 font-normal rounded-lg hover:bg-pcl-blue/10 transition-colors text-pcl-dark-gray',
          day_selected: '!bg-pcl-blue !text-white hover:!bg-pcl-blue font-semibold rounded-lg',
          day_today: '!text-pcl-blue font-semibold',
          day_outside: 'text-gray-300 opacity-50',
          day_disabled: 'text-gray-300 cursor-not-allowed hover:bg-transparent',
        }}
      />
    </div>
  );
}
