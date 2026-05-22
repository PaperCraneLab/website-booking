import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, cancelBooking } from '@/lib/google-sheets';

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error('Admin bookings fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await cancelBooking(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cancel booking error:', err);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
