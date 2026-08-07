'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { getMachine, TOOL_TRAINING_PRICE } from '@/lib/machines';
import { PassType, BookingType, TimeSlot } from '@/types';
import { addHours, formatDisplayTime, parseMinutes } from '@/lib/utils';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import PassTypeSelector from '@/components/PassTypeSelector';
import PriceSummary from '@/components/PriceSummary';
import HourSelector from '@/components/HourSelector';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BookPage() {
  const { machine: machineId } = useParams<{ machine: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const machine = getMachine(machineId);

  const [needsTraining, setNeedsTraining] = useState(
    searchParams.get('type') === 'toolTraining'
  );
  const bookingType: BookingType = needsTraining ? 'toolTraining' : 'pass';
  const isTraining = needsTraining;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [passType, setPassType] = useState<PassType>('hourly');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [hours, setHours] = useState(1);
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [dayClosed, setDayClosed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const maxHours = selectedStart
    ? (parseMinutes(closeTime) - parseMinutes(selectedStart)) / 60
    : (parseMinutes(closeTime) - parseMinutes(openTime)) / 60;

  const endTime = selectedStart ? addHours(selectedStart, hours) : null;

  const fetchSlots = useCallback(async () => {
    if (!dateStr) return;
    setSlotsLoading(true);
    setSelectedStart(null);
    setDayClosed(false);
    try {
      const res = await fetch(
        `/api/availability?date=${dateStr}&machine=${machineId}&type=${bookingType}`
      );
      const data = await res.json();
      setSlots(data.slots ?? []);
      setOpenTime(data.openTime ?? '10:00');
      setCloseTime(data.closeTime ?? '18:00');
      setDayClosed(data.closed ?? false);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [dateStr, machineId, bookingType]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  useEffect(() => {
    setSelectedStart(null);
    setHours(1);
  }, [passType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedStart || !endTime) return;
    setError(null);
    setSubmitting(true);
    try {
      const sessionHours = (parseMinutes(endTime) - parseMinutes(selectedStart)) / 60;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine: machineId,
          date: dateStr,
          startTime: selectedStart,
          endTime,
          passType: isTraining ? 'hourly' : passType,
          hours: isTraining ? sessionHours : hours,
          name,
          email,
          phone,
          bookingType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      router.push(
        `/confirmation?id=${data.booking.id}&machine=${machineId}&date=${dateStr}&start=${selectedStart}&end=${endTime}&name=${encodeURIComponent(name)}&total=${data.booking.total}&type=${bookingType}`
      );
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!machine) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 mb-4">Machine not found.</p>
        <Link href="/book" className="text-pcl-blue hover:underline">← Back to bookings</Link>
      </div>
    );
  }

  const canSubmit =
    selectedDate && selectedStart && endTime &&
    name.trim() && email.trim() && phone.trim() && !submitting;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <Link href="/book" className="text-sm text-gray-400 hover:text-pcl-blue transition-colors mb-3 inline-block">
            ← Back to all bookings
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: `${machine.accentColor}20` }}
            >
              {isTraining ? '🎓' : machine.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pcl-dark-gray">{machine.name}</h1>
              <p className="georgia-text text-gray-500">{machine.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="container py-10 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-bold text-lg text-pcl-dark-gray mb-4">1. Booking type</h2>

            {/* Tool training toggle */}
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-pcl-yellow/60 bg-pcl-yellow/10 mb-5">
              <input
                type="checkbox"
                checked={needsTraining}
                onChange={(e) => { setNeedsTraining(e.target.checked); setSelectedStart(null); setHours(1); }}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-pcl-blue"
              />
              <div>
                <p className="font-bold text-pcl-dark-gray text-sm">I need Tool Training for this machine</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tool training is closed from Aug 10th to Aug 31st. You can still go ahead and use the standard PCL Pass to use the machines!
                </p>
              </div>
            </label>

            {isTraining ? (
              <>
                <p className="text-sm font-semibold text-pcl-dark-gray mb-3">How long do you need?</p>
                <HourSelector max={Math.min(8, maxHours || 8)} value={hours} onChange={setHours} />
              </>
            ) : (
              <PassTypeSelector value={passType} onChange={(t) => setPassType(t)} />
            )}
          </section>

          {/* Step 2 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-bold text-lg text-pcl-dark-gray mb-4">2. Select a date</h2>
            <BookingCalendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              machine={machineId}
              bookingType={bookingType}
            />
          </section>

          {/* Step 3 */}
          {selectedDate && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg text-pcl-dark-gray mb-1">3. Select start time</h2>
              <p className="text-gray-400 text-sm mb-4">
                {format(selectedDate, 'EEEE, d MMMM yyyy')}
                {!dayClosed && openTime && closeTime && (
                  <> · {formatDisplayTime(openTime)} – {formatDisplayTime(closeTime)}</>
                )}
              </p>

              {dayClosed ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-2xl mb-2">🔒</p>
                  <p className="font-semibold">The lab is closed on this day.</p>
                  <p className="text-sm mt-1">Please choose a different date.</p>
                </div>
              ) : (
                <TimeSlotGrid
                  slots={slots}
                  selectedStart={selectedStart}
                  selectedEnd={selectedStart && endTime ? endTime : null}
                  onSelectStart={(t) => { setSelectedStart(t); setHours(1); }}
                  loading={slotsLoading}
                />
              )}

              {selectedStart && !isTraining && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-pcl-dark-gray mb-3">
                    Duration (starting {formatDisplayTime(selectedStart)}):
                  </p>
                  <HourSelector max={maxHours} value={hours} onChange={setHours} />
                  {endTime && (
                    <p className="text-xs text-gray-400 mt-2">
                      Session: {formatDisplayTime(selectedStart)} – {formatDisplayTime(endTime)}
                    </p>
                  )}
                </div>
              )}

              {isTraining && selectedStart && endTime && (
                <p className="text-xs text-gray-400 mt-4">
                  Training: {formatDisplayTime(selectedStart)} – {formatDisplayTime(endTime)}
                </p>
              )}
            </section>
          )}

          {/* Step 4 */}
          {selectedDate && selectedStart && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg text-pcl-dark-gray mb-4">4. Your details</h2>
              <div className="space-y-4">
                {[
                  { label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'Your full name' },
                  { label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com' },
                  { label: 'Phone', type: 'tel', value: phone, onChange: setPhone, placeholder: '+91 98765 43210' },
                ].map(({ label, type, value, onChange, placeholder }) => (
                  <div key={label}>
                    <label className="block text-sm font-semibold text-pcl-dark-gray mb-1">{label}</label>
                    <input
                      type={type}
                      required
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-pcl-dark-gray focus:outline-none focus:ring-2 focus:ring-pcl-blue/30 focus:border-pcl-blue transition"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Price + Submit */}
          {selectedDate && selectedStart && endTime && (
            <section className="space-y-4">
              {isTraining ? (
                <div className="bg-white rounded-lg shadow-md p-5">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Tool Training fee</span>
                    <span className="font-semibold">₹{TOOL_TRAINING_PRICE}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>Duration</span>
                    <span>{formatDisplayTime(selectedStart)} – {formatDisplayTime(endTime)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold text-pcl-dark-gray">Total</span>
                    <span className="font-bold text-xl text-pcl-blue">₹{TOOL_TRAINING_PRICE}</span>
                  </div>
                </div>
              ) : (
                <PriceSummary
                  passType={passType}
                  hours={hours}
                  machine={machine}
                  startTime={selectedStart}
                  endTime={endTime}
                />
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-primary w-full text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isTraining ? 'Booking your training…' : 'Confirming your booking…'}
                  </>
                ) : (
                  isTraining ? 'Confirm Training Booking' : 'Confirm Booking'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {isTraining
                  ? 'A confirmation will be sent to your email. A PCL team member will be present to guide you.'
                  : "By booking you confirm you've completed tool training for this machine. A confirmation will be sent to your email."}
              </p>
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
