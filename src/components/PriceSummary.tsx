'use client';

import { PassType } from '@/types';
import { PASS_TYPES, calculatePrice } from '@/lib/machines';

interface Props {
  passType: PassType;
  hours: number;
  materialFee: number;
  startTime: string | null;
  endTime: string | null;
}

export default function PriceSummary({ passType, hours, materialFee, startTime, endTime }: Props) {
  const basePrice = calculatePrice(passType, hours);
  const total = basePrice + materialFee;
  const pt = PASS_TYPES[passType];

  return (
    <div className="bg-pcl-blue/5 border border-pcl-blue/20 rounded-lg p-5 space-y-2">
      <h4 className="font-bold text-pcl-dark-gray text-sm">Price Summary</h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{pt.label}</span>
          <span>₹{basePrice}</span>
        </div>
        {materialFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Material fee</span>
            <span>₹{materialFee}</span>
          </div>
        )}
        <div className="border-t border-pcl-blue/20 pt-2 flex justify-between font-semibold text-pcl-dark-gray">
          <span>Total</span>
          <span className="text-pcl-blue text-lg">₹{total}</span>
        </div>
      </div>
      {startTime && endTime && (
        <p className="text-xs text-gray-400 pt-1">Session: {startTime} – {endTime}</p>
      )}
    </div>
  );
}
