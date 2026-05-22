'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { getMachine } from '@/lib/machines';
import { formatDisplayTime } from '@/lib/utils';

function ConfirmationContent() {
  const params = useSearchParams();
  const id = params.get('id');
  const machineId = params.get('machine') ?? '';
  const date = params.get('date') ?? '';
  const start = params.get('start') ?? '';
  const end = params.get('end') ?? '';
  const name = params.get('name') ?? '';
  const total = params.get('total') ?? '';
  const bookingType = params.get('type') ?? 'pass';
  const isTraining = bookingType === 'toolTraining';

  const machine = getMachine(machineId);
  const [y, m, d] = date.split('-').map(Number);
  const displayDate = new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <div className="w-16 h-16 bg-pcl-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-pcl-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-pcl-dark-gray mb-2">
            You're all set, {name.split(' ')[0]}!
          </h1>
          <p className="georgia-text text-gray-500 mb-1">
            {isTraining ? 'Tool training booked.' : 'PCL Pass confirmed.'}
          </p>
          <p className="text-gray-400 text-sm mb-8">A confirmation has been sent to your email.</p>

          <div className="bg-gray-50 rounded-lg p-5 text-left space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Machine</span>
              <span className="font-semibold text-pcl-dark-gray">{machine?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold text-pcl-dark-gray">{isTraining ? 'Tool Training' : 'PCL Pass'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-pcl-dark-gray">{displayDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="font-semibold text-pcl-dark-gray">
                {formatDisplayTime(start)} – {formatDisplayTime(end)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="font-bold text-pcl-blue text-lg">₹{total}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-8">Booking ID: {id}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/book" className="btn-primary flex-1 text-center">
              Make another booking
            </Link>
            <Link href="/" className="btn-secondary flex-1 text-center">
              Back to home
            </Link>
          </div>
        </div>

        <div className="bg-pcl-yellow/20 border border-pcl-yellow rounded-lg p-4 text-sm text-pcl-dark-gray">
          <strong>Need to cancel or reschedule?</strong>{' '}
          Email us at{' '}
          <a href="mailto:hello@papercranelab.com" className="text-pcl-blue hover:underline">
            hello@papercranelab.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
