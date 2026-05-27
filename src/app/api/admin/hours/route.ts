import { NextRequest, NextResponse } from 'next/server';
import { getOpenHours, updateDayHours } from '@/lib/google-sheets';

export async function GET() {
  try {
    const hours = await getOpenHours();
    return NextResponse.json({ hours });
  } catch (err) {
    console.error('Get hours error:', err);
    return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await updateDayHours(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update hours error:', err);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}
