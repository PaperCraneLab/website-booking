import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getBookingsForDate, createBooking, getBlockedSlots } from '@/lib/google-sheets';
import { sendUserConfirmation, sendAdminNotification } from '@/lib/email';
import { getMachine, calculatePrice, MAX_CONCURRENT_PASSES, TOOL_TRAINING_PRICE } from '@/lib/machines';
import { Booking, BookingType } from '@/types';
import { parseHour } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machine, date, startTime, endTime, passType, hours, name, email, phone, bookingType } = body;

    const resolvedBookingType: BookingType = bookingType === 'toolTraining' ? 'toolTraining' : 'pass';

    // Validate machine
    const machineData = getMachine(machine);
    if (!machineData) {
      return NextResponse.json({ error: 'Invalid machine' }, { status: 400 });
    }

    // Validate required fields
    if (!date || !startTime || !endTime || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (resolvedBookingType === 'pass' && !passType) {
      return NextResponse.json({ error: 'Pass type is required for pass bookings' }, { status: 400 });
    }

    const startHour = parseHour(startTime);
    const endHour = parseHour(endTime);

    if (endHour <= startHour) {
      return NextResponse.json({ error: 'Invalid time range' }, { status: 400 });
    }

    // Re-check availability server-side to prevent race conditions
    const [existingBookings, blockedSlots] = await Promise.all([
      getBookingsForDate(date),
      getBlockedSlots(date),
    ]);

    for (let hour = startHour; hour < endHour; hour++) {
      // Check if blocked
      const isBlocked = blockedSlots.some((s) => {
        if (s.machine !== 'all' && s.machine !== machine) return false;
        const start = parseHour(s.startTime);
        const end = parseHour(s.endTime);
        return start <= hour && end > hour;
      });
      if (isBlocked) {
        return NextResponse.json({ error: 'This time slot is blocked' }, { status: 409 });
      }

      const bookingsAtHour = existingBookings.filter((b) => {
        const start = parseHour(b.startTime);
        const end = parseHour(b.endTime);
        return start <= hour && end > hour;
      });

      const passesAtHour = bookingsAtHour.filter((b) => b.bookingType !== 'toolTraining');
      const trainingsAtHour = bookingsAtHour.filter((b) => b.bookingType === 'toolTraining');

      if (resolvedBookingType === 'toolTraining') {
        // Tool training requires the slot to be completely free
        if (bookingsAtHour.length > 0) {
          return NextResponse.json(
            { error: 'Tool training slots must be unoccupied — someone has already booked this time' },
            { status: 409 }
          );
        }
      } else {
        // Pass booking
        if (trainingsAtHour.length > 0) {
          return NextResponse.json(
            { error: 'A tool training session is scheduled at this time — no passes can be booked' },
            { status: 409 }
          );
        }
        if (passesAtHour.length >= MAX_CONCURRENT_PASSES) {
          return NextResponse.json(
            { error: `The lab is fully booked at this time (max ${MAX_CONCURRENT_PASSES} passes)` },
            { status: 409 }
          );
        }
        if (bookingsAtHour.some((b) => b.machine === machine)) {
          return NextResponse.json(
            { error: 'This machine is already booked at the selected time' },
            { status: 409 }
          );
        }
      }
    }

    let basePrice: number;
    let materialFee: number;
    if (resolvedBookingType === 'toolTraining') {
      basePrice = TOOL_TRAINING_PRICE;
      materialFee = 0;
    } else {
      basePrice = calculatePrice(passType, hours);
      materialFee = machineData.materialFee;
    }
    const total = basePrice + materialFee;

    const booking: Booking = {
      id: uuidv4(),
      machine,
      date,
      startTime,
      endTime,
      passType: resolvedBookingType === 'toolTraining' ? 'hourly' : passType,
      hours: resolvedBookingType === 'toolTraining' ? endHour - startHour : hours,
      name,
      email,
      phone,
      basePrice,
      materialFee,
      total,
      bookingTimestamp: new Date().toISOString(),
      status: 'confirmed',
      bookingType: resolvedBookingType,
    };

    await createBooking(booking);

    try {
      await Promise.all([
        sendUserConfirmation(booking),
        sendAdminNotification(booking),
      ]);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
