import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForDate, getBlockedSlots, getOpenHours } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';
import { OPEN_HOURS, MAX_CONCURRENT_PASSES, getMachine } from '@/lib/machines';
import { TimeSlot } from '@/types';
import { parseMinutes, todayIST, nowISTMinutes } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const machineId = searchParams.get('machine');
  const bookingType = searchParams.get('type') ?? 'pass';

  if (!date || !machineId) {
    return NextResponse.json({ error: 'Missing date or machine' }, { status: 400 });
  }

  if (!getMachine(machineId)) {
    return NextResponse.json({ error: 'Invalid machine' }, { status: 400 });
  }

  try {
    // Resolve actual lab hours for the requested date
    const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const [bookings, blockedSlots, allHours] = await Promise.all([
      getBookingsForDate(date),
      getBlockedSlots(date),
      getOpenHours(),
    ]);

    const dayHours = allHours.find((h) => h.day === dayName);
    const openMinutes = parseMinutes(dayHours?.open ?? `${OPEN_HOURS.start}:00`);
    const closeMinutes = parseMinutes(dayHours?.close ?? `${OPEN_HOURS.end}:00`);
    const isClosed = dayHours?.status === 'closed';
    const isTrainingClosed = bookingType === 'toolTraining' && dayHours?.trainingOpen === false;

    const openTime = `${String(Math.floor(openMinutes / 60)).padStart(2, '0')}:${String(openMinutes % 60).padStart(2, '0')}`;
    const closeTime = `${String(Math.floor(closeMinutes / 60)).padStart(2, '0')}:${String(closeMinutes % 60).padStart(2, '0')}`;

    if (isClosed || isTrainingClosed) {
      return NextResponse.json({ slots: [], openTime: null, closeTime: null, closed: true });
    }

    // Same-day bookings require at least 4 hours advance notice
    const sameDayCutoff = date === todayIST() ? nowISTMinutes() + 4 * 60 : 0;

    const slots: TimeSlot[] = [];

    for (let slotMin = openMinutes; slotMin < closeMinutes; slotMin += 30) {
      const slotEnd = slotMin + 30;

      const bookingsAtSlot = bookings.filter((b) => {
        const start = parseMinutes(b.startTime);
        const end = parseMinutes(b.endTime);
        return start < slotEnd && end > slotMin;
      });

      const passesAtSlot = bookingsAtSlot.filter((b) => b.bookingType !== 'toolTraining');
      const trainingsAtSlot = bookingsAtSlot.filter((b) => b.bookingType === 'toolTraining');
      const machineBooked = bookingsAtSlot.some((b) => b.machine === machineId);

      const isBlocked = blockedSlots.some((s) => {
        if (s.machine !== 'all' && s.machine !== machineId) return false;
        const start = parseMinutes(s.startTime);
        const end = parseMinutes(s.endTime);
        return start < slotEnd && end > slotMin;
      });

      let available: boolean;
      if (slotMin < sameDayCutoff) {
        available = false;
      } else if (bookingType === 'toolTraining') {
        available = !isBlocked && !machineBooked && bookingsAtSlot.length === 0;
      } else {
        available =
          !isBlocked &&
          !machineBooked &&
          trainingsAtSlot.length === 0 &&
          passesAtSlot.length < MAX_CONCURRENT_PASSES;
      }

      const h = Math.floor(slotMin / 60);
      const m = slotMin % 60;
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({ time, available, count: bookingsAtSlot.length });
    }

    return NextResponse.json({ slots, openTime, closeTime, closed: false });
  } catch (err) {
    console.error('Availability error:', err);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
