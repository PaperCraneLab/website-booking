'use client';

import { cn, formatDuration } from '@/lib/utils';

interface Props {
  max: number;    // maximum hours (can be fractional, e.g. 2.5)
  value: number;  // selected hours (can be 0.5, 1, 1.5, etc.)
  onChange: (hours: number) => void;
}

export default function HourSelector({ max, value, onChange }: Props) {
  const steps: number[] = [];
  for (let h = 1.0; h <= max + 0.001; h += 0.5) {
    steps.push(Math.round(h * 2) / 2);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => onChange(h)}
          className={cn(
            'px-3 h-10 rounded-lg border text-sm font-semibold transition-all duration-150',
            value === h
              ? 'bg-pcl-blue text-white border-pcl-blue'
              : 'bg-white text-pcl-dark-gray border-gray-200 hover:border-pcl-blue hover:text-pcl-blue'
          )}
        >
          {formatDuration(h)}
        </button>
      ))}
    </div>
  );
}
