'use client';

import Link from 'next/link';
import { Machine, BookingType } from '@/types';

interface Props {
  machine: Machine;
  bookingType?: BookingType;
}

export default function MachineCard({ machine, bookingType = 'pass' }: Props) {
  const isTraining = bookingType === 'toolTraining';
  const href = `/book/${machine.id}?type=${bookingType}`;
  const accentColor = isTraining ? '#F9C431' : machine.accentColor;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border-t-4" style={{ borderColor: accentColor }}>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-3xl mb-3">{isTraining ? '🎓' : machine.icon}</div>
        <h3 className="font-bold text-xl text-pcl-dark-gray mb-2 leading-tight">{machine.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{machine.description}</p>

        {!isTraining && machine.materialFee > 0 && (
          <div className="mt-3 inline-flex items-center bg-pcl-yellow/20 text-pcl-dark-gray rounded-full px-3 py-1 text-xs font-semibold self-start">
            +₹{machine.materialFee} material fee
          </div>
        )}

        <Link
          href={href}
          className="btn-primary mt-5 text-center text-sm !py-2.5"
          style={{ backgroundColor: accentColor, color: isTraining ? '#3F4546' : '#fff' }}
        >
          {isTraining ? 'Book Training' : 'Book a Pass'}
        </Link>
      </div>
    </div>
  );
}
