import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getBookingsForDate, createBooking, getBlockedSlots } from '@/lib/google-sheets';
import { sendUserConfirmation, sendAdminNotification } from '@/lib/email';
import { getMachine, getBasePrice, getMaterialFee, MAX_CONCURRENT_PASSES, TOOL_TRAINING_PRICE } from '@/lib/machines';
import { Booking, BookingType } from '@/types';
import { parseMinutes } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machine, date, startTime, endTime, passType, hours, name, email, phone, bookingType } = body;

    const resolvedBookingType: BookingType = bookingType === 'toolTraining' ? 'toolTraining' : 'pass';

    const machineData = getMachine(machine);
    if (!machineData) {
      return NextResponse.json({ error: 'Invalid machine' }, { status: 400 });
    }

    if (!date || !startTime || !endTime || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (resolvedBookingType === 'pass' && !passType) {
      return NextResponse.json({ error: 'Pass type is required for pass bookings' }, { status: 400 });
    }

    const startMin = parseMinutes(startTime);
    const endMin = parseMinutes(endTime);

    if (endMin <= startMin) {
      return NextResponse.json({ error: 'Invalid time range' }, { status: 400 });
    }

    const [existingBookings, blockedSlots] = await Promise.all([
      getBookingsForDate(date),
      getBlockedSlots(date),
    ]);

    // Validate every 30-min slot in the requested range
    for (let slotMin = startMin; slotMin < endMin; slotMin += 30) {
      const slotEnd = slotMin + 30;

      const isBlocked = blockedSlots.some((s) => {
        if (s.machine !== 'all' && s.machine !== machine) return false;
        const start = parseMinutes(s.startTime);
        const end = parseMinutes(s.endTime);
        return start < slotEnd && end > slotMin;
      });
      if (isBlocked) {
        return NextResponse.json({ error: 'This time slot is blocked' }, { status: 409 });
      }

      const bookingsAtSlot = existingBookings.filter((b) => {
        const start = parseMinutes(b.startTime);
        const end = parseMinutes(b.endTime);
        return start < slotEnd && end > slotMin;
      });

      const passesAtSlot = bookingsAtSlot.filter((b) => b.bookingType !== 'toolTraining');
      const trainingsAtSlot = bookingsAtSlot.filter((b) => b.bookingType === 'toolTraining');

      if (resolvedBookingType === 'toolTraining') {
        if (bookingsAtSlot.length > 0) {
          return NextResponse.json(
            { error: 'Tool training slots must be unoccupied — someone has already booked this time' },
            { status: 409 }
          );
        }
      } else {
        if (trainingsAtSlot.length > 0) {
          return NextResponse.json(
            { error: 'A tool training session is scheduled at this time — no passes can be booked' },
            { status: 409 }
          );
        }
        if (passesAtSlot.length >= MAX_CONCURRENT_PASSES) {
          return NextResponse.json(
            { error: `The lab is fully booked at this time (max ${MAX_CONCURRENT_PASSES} passes)` },
            { status: 409 }
          );
        }
        if (bookingsAtSlot.some((b) => b.machine === machine)) {
          return NextResponse.json(
            { error: 'This machine is already booked at the selected time' },
            { status: 409 }
          );
        }
      }
    }

    const sessionHours = (endMin - startMin) / 60;

    let basePrice: number;
    let materialFee: number;
    if (resolvedBookingType === 'toolTraining') {
      basePrice = TOOL_TRAINING_PRICE;
      materialFee = 0;
    } else {
      basePrice = getBasePrice(passType, hours ?? sessionHours, machineData);
      materialFee = getMaterialFee(machineData, hours ?? sessionHours);
    }
    const total = basePrice + materialFee;

    const booking: Booking = {
      id: uuidv4(),
      machine,
      date,
      startTime,
      endTime,
      passType: resolvedBookingType === 'toolTraining' ? 'hourly' : passType,
      hours: resolvedBookingType === 'toolTraining' ? sessionHours : (hours ?? sessionHours),
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
