'use client';

import { PassType } from '@/types';
import { PASS_TYPES } from '@/lib/machines';
import { cn } from '@/lib/utils';

interface Props {
  value: PassType;
  onChange: (type: PassType) => void;
}

const TYPES: { key: PassType; emoji: string }[] = [
  { key: 'hourly', emoji: '⏱️' },
  { key: 'tenHour', emoji: '🎟️' },
];

export default function PassTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {TYPES.map(({ key, emoji }) => {
        const pt = PASS_TYPES[key];
        const selected = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'text-left p-4 rounded-lg border-2 transition-all duration-150',
              selected
                ? 'border-pcl-blue bg-pcl-blue/5'
                : 'border-gray-200 bg-white hover:border-pcl-blue/50'
            )}
          >
            <div className="text-2xl mb-2">{emoji}</div>
            <div className="font-bold text-pcl-dark-gray text-sm">{pt.label}</div>
            <div className="text-pcl-blue font-semibold text-sm mt-0.5">{pt.description}</div>
            <div className="text-gray-400 text-xs mt-1">{pt.shortDesc}</div>
          </button>
        );
      })}
    </div>
  );
}
