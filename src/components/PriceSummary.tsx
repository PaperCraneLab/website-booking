'use client';

import { PassType, Machine } from '@/types';
import { PASS_TYPES, getBasePrice, getMaterialFee } from '@/lib/machines';
import { formatDisplayTime, formatDuration } from '@/lib/utils';

interface Props {
  passType: PassType;
  hours: number;
  machine: Machine;
  startTime: string | null;
  endTime: string | null;
}

export default function PriceSummary({ passType, hours, machine, startTime, endTime }: Props) {
  const basePrice = getBasePrice(passType, hours, machine);
  const materialFee = getMaterialFee(machine, hours);
  const total = basePrice + materialFee;
  const pt = PASS_TYPES[passType];
  const is3D = machine.pricingModel === 'firstHourOnly';

  return (
    <div className="bg-pcl-blue/5 border border-pcl-blue/20 rounded-lg p-5 space-y-2">
      <h4 className="font-bold text-pcl-dark-gray text-sm">Price Summary</h4>
      <div className="space-y-1 text-sm">
        {is3D ? (
          <>
            <div className="flex justify-between text-gray-600">
              <span>Machine time (first hour)</span>
              <span>₹{basePrice}</span>
            </div>
            {materialFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Material fee ({formatDuration(hours)} × ₹{machine.materialFee}/hr)</span>
                <span>₹{materialFee}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between text-gray-600">
              <span>
                {pt.label}
                {passType === 'hourly' && ` (${formatDuration(hours)})`}
              </span>
              <span>₹{basePrice}</span>
            </div>
            {materialFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Material fee</span>
                <span>₹{materialFee}</span>
              </div>
            )}
          </>
        )}
        <div className="border-t border-pcl-blue/20 pt-2 flex justify-between font-semibold text-pcl-dark-gray">
          <span>Total</span>
          <span className="text-pcl-blue text-lg">₹{total}</span>
        </div>
      </div>
      {startTime && endTime && (
        <p className="text-xs text-gray-400 pt-1">
          Session: {formatDisplayTime(startTime)} – {formatDisplayTime(endTime)}
        </p>
      )}
    </div>
  );
}
