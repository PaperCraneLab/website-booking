'use client';

import { cn } from '@/lib/utils';

interface Props {
  max: number;
  value: number;
  onChange: (hours: number) => void;
}

export default function HourSelector({ max, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => onChange(h)}
          className={cn(
            'w-12 h-10 rounded-lg border text-sm font-semibold transition-all duration-150',
            value === h
              ? 'bg-pcl-blue text-white border-pcl-blue'
              : 'bg-white text-pcl-dark-gray border-gray-200 hover:border-pcl-blue hover:text-pcl-blue'
          )}
        >
          {h}h
        </button>
      ))}
    </div>
  );
}
