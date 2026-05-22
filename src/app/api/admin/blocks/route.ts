import { NextRequest, NextResponse } from 'next/server';
import { getBlockedSlots, addBlockedSlot, deleteBlockedSlot } from '@/lib/google-sheets';

export async function GET() {
  try {
    const blocks = await getBlockedSlots();
    return NextResponse.json({ blocks });
  } catch (err) {
    console.error('Blocks fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const slot = await request.json();
    await addBlockedSlot(slot);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Add block error:', err);
    return NextResponse.json({ error: 'Failed to add block' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { machine, date, startTime } = await request.json();
    await deleteBlockedSlot(machine, date, startTime);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete block error:', err);
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 });
  }
}
