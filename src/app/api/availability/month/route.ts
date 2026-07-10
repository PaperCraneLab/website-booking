import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, getBlockedSlots, getOpenHours } from '@/lib/google-sheets';
import { OPEN_HOURS, MAX_CONCURRENT_PASSES, getMachine } from '@/lib/machines';
import { parseMinutes, todayIST, nowISTMinutes } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // YYYY-MM
  const machineId = searchParams.get('machine');
  const bookingType = searchParams.get('type') ?? 'pass';

  if (!month || !machineId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  if (!getMachine(machineId)) {
    return NextResponse.json({ error: 'Invalid machine' }, { status: 400 });
  }

  try {
    const [allBookings, allBlocks, allHours] = await Promise.all([
      getAllBookings(),
      getBlockedSlots(),
      getOpenHours(),
    ]);

    const monthBookings = allBookings.filter(
      (b) => b.date.startsWith(month) && b.status !== 'cancelled'
    );
    const monthBlocks = allBlocks.filter((b) => b.date.startsWith(month));

    const todayStr = todayIST();
    const currentISTMinutes = nowISTMinutes();

    const [year, mon] = month.split('-').map(Number);
    const daysInMonth = new Date(year, mon, 0).getDate();

    const unavailableDates: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${String(day).padStart(2, '0')}`;
      const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });

      const dayHours = allHours.find((h) => h.day === dayName);
      const isClosed = dayHours?.status === 'closed';

      if (isClosed) {
        unavailableDates.push(date);
        continue;
      }

      const openMinutes = parseMinutes(dayHours?.open ?? `${OPEN_HOURS.start}:00`);
      const closeMinutes = parseMinutes(dayHours?.close ?? `${OPEN_HOURS.end}:00`);

      const dayBookings = monthBookings.filter((b) => b.date === date);
      const dayBlocks = monthBlocks.filter((b) => b.date === date);

      let hasAvailableSlot = false;
      const sameDayCutoff = date === todayStr ? currentISTMinutes + 4 * 60 : 0;

      for (let slotMin = openMinutes; slotMin < closeMinutes; slotMin += 30) {
        const slotEnd = slotMin + 30;

        const bookingsAtSlot = dayBookings.filter((b) => {
          const start = parseMinutes(b.startTime);
          const end = parseMinutes(b.endTime);
          return start < slotEnd && end > slotMin;
        });

        const passesAtSlot = bookingsAtSlot.filter((b) => b.bookingType !== 'toolTraining');
        const trainingsAtSlot = bookingsAtSlot.filter((b) => b.bookingType === 'toolTraining');
        const machineBooked = bookingsAtSlot.some((b) => b.machine === machineId);

        const isBlocked = dayBlocks.some((s) => {
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

        if (available) {
          hasAvailableSlot = true;
          break;
        }
      }

      if (!hasAvailableSlot) {
        unavailableDates.push(date);
      }
    }

    return NextResponse.json({ unavailableDates });
  } catch (err) {
    console.error('Month availability error:', err);
    return NextResponse.json({ error: 'Failed to fetch month availability' }, { status: 500 });
  }
}
