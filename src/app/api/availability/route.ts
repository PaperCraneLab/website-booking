import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForDate, getBlockedSlots } from '@/lib/google-sheets';
import { OPEN_HOURS, MAX_CONCURRENT_PASSES, getMachine } from '@/lib/machines';
import { TimeSlot } from '@/types';
import { parseHour } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const machineId = searchParams.get('machine');
  // 'pass' (default) or 'toolTraining'
  const bookingType = searchParams.get('type') ?? 'pass';

  if (!date || !machineId) {
    return NextResponse.json({ error: 'Missing date or machine' }, { status: 400 });
  }

  if (!getMachine(machineId)) {
    return NextResponse.json({ error: 'Invalid machine' }, { status: 400 });
  }

  try {
    const [bookings, blockedSlots] = await Promise.all([
      getBookingsForDate(date),
      getBlockedSlots(date),
    ]);

    const slots: TimeSlot[] = [];

    for (let hour = OPEN_HOURS.start; hour < OPEN_HOURS.end; hour++) {
      // All active bookings that overlap this hour across ALL machines
      const bookingsAtHour = bookings.filter((b) => {
        const start = parseHour(b.startTime);
        const end = parseHour(b.endTime);
        return start <= hour && end > hour;
      });

      const passesAtHour = bookingsAtHour.filter((b) => b.bookingType !== 'toolTraining');
      const trainingsAtHour = bookingsAtHour.filter((b) => b.bookingType === 'toolTraining');

      // Is this machine already booked at this hour?
      const machineBooked = bookingsAtHour.some((b) => b.machine === machineId);

      // Is this machine (or all machines) blocked at this hour?
      const isBlocked = blockedSlots.some((s) => {
        if (s.machine !== 'all' && s.machine !== machineId) return false;
        const start = parseHour(s.startTime);
        const end = parseHour(s.endTime);
        return start <= hour && end > hour;
      });

      let available: boolean;
      if (bookingType === 'toolTraining') {
        // Tool training: slot must be completely free (no passes, no other trainings)
        available = !isBlocked && !machineBooked && bookingsAtHour.length === 0;
      } else {
        // Pass: slot blocked if any training exists, or machine is already booked, or at capacity
        available =
          !isBlocked &&
          !machineBooked &&
          trainingsAtHour.length === 0 &&
          passesAtHour.length < MAX_CONCURRENT_PASSES;
      }

      const time = `${String(hour).padStart(2, '0')}:00`;
      slots.push({
        time,
        available,
        count: bookingsAtHour.length,
      });
    }

    return NextResponse.json({ slots });
  } catch (err) {
    console.error('Availability error:', err);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
