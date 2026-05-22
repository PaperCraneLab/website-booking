import { google } from 'googleapis';
import { Booking, BlockedSlot, BookingType, LabEvent } from '@/types';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, ''),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const BOOKINGS_SHEET = 'Bookings';
const BLOCKED_SHEET = 'BlockedSlots';
const EVENTS_SHEET = 'Events';

// ── Bookings ──────────────────────────────────────────────────────────────────

function rowToBooking(row: string[]): Booking {
  return {
    id: row[0],
    machine: row[1],
    date: row[2],
    startTime: row[3],
    endTime: row[4],
    passType: row[5] as Booking['passType'],
    hours: Number(row[6]),
    name: row[7],
    email: row[8],
    phone: row[9],
    basePrice: Number(row[10]),
    materialFee: Number(row[11]),
    total: Number(row[12]),
    bookingTimestamp: row[13],
    status: (row[14] || 'confirmed') as Booking['status'],
    bookingType: ((row[15] as BookingType) || 'pass'),
  };
}

export async function getAllBookings(): Promise<Booking[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A2:P`,
  });
  const rows = res.data.values ?? [];
  return rows.filter((r) => r[0]).map(rowToBooking);
}

export async function getBookingsForDate(date: string): Promise<Booking[]> {
  const all = await getAllBookings();
  return all.filter((b) => b.date === date && b.status !== 'cancelled');
}

export async function createBooking(booking: Booking): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A:P`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        booking.id,
        booking.machine,
        booking.date,
        booking.startTime,
        booking.endTime,
        booking.passType,
        booking.hours,
        booking.name,
        booking.email,
        booking.phone,
        booking.basePrice,
        booking.materialFee,
        booking.total,
        booking.bookingTimestamp,
        booking.status,
        booking.bookingType,
      ]],
    },
  });
}

export async function cancelBooking(id: string): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A:P`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === id);
  if (rowIndex === -1) throw new Error('Booking not found');

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!O${rowIndex + 1}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['cancelled']] },
  });
}

// ── Blocked Slots ─────────────────────────────────────────────────────────────

function rowToBlock(row: string[]): BlockedSlot {
  return {
    machine: row[0],
    date: row[1],
    startTime: row[2],
    endTime: row[3],
    reason: row[4] ?? '',
  };
}

export async function getBlockedSlots(date?: string): Promise<BlockedSlot[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOCKED_SHEET}!A2:E`,
  });
  const rows = res.data.values ?? [];
  const blocks = rows.filter((r) => r[0]).map(rowToBlock);
  return date ? blocks.filter((b) => b.date === date) : blocks;
}

export async function addBlockedSlot(slot: BlockedSlot): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOCKED_SHEET}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        slot.machine,
        slot.date,
        slot.startTime,
        slot.endTime,
        slot.reason,
      ]],
    },
  });
}

export async function deleteBlockedSlot(machine: string, date: string, startTime: string): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOCKED_SHEET}!A:E`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex(
    (r) => r[0] === machine && r[1] === date && r[2] === startTime
  );
  if (rowIndex === -1) return;

  // Clear the row (Sheets API doesn't have a delete-row without batchUpdate)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOCKED_SHEET}!A${rowIndex + 1}:E${rowIndex + 1}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['', '', '', '', '']] },
  });
}

// ── Events ────────────────────────────────────────────────────────────────────
// Events sheet columns: A=Title, B=Description, C=Date, D=Time, E=Cost, F=Image URL, G=Booking Link

export async function getEvents(): Promise<LabEvent[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${EVENTS_SHEET}!A2:G`,
  });
  const rows = res.data.values ?? [];
  return rows
    .filter((r) => r[0])
    .map((row) => ({
      title: row[0] ?? '',
      description: row[1] ?? '',
      date: row[2] ?? '',
      time: row[3] ?? '',
      cost: row[4] ?? '',
      imageUrl: row[5] ?? '',
      bookingLink: row[6] ?? '',
    }));
}

// ── Sheet initialiser (call once) ─────────────────────────────────────────────

export async function ensureSheetHeaders(): Promise<void> {
  const sheets = getSheets();

  const bookingHeaders = [
    ['ID', 'Machine', 'Date', 'Start Time', 'End Time', 'Pass Type', 'Hours',
      'Name', 'Email', 'Phone', 'Base Price', 'Material Fee', 'Total',
      'Booking Timestamp', 'Status', 'Booking Type'],
  ];
  const blockedHeaders = [
    ['Machine', 'Date', 'Start Time', 'End Time', 'Reason'],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BOOKINGS_SHEET}!A1:P1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: bookingHeaders },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOCKED_SHEET}!A1:E1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: blockedHeaders },
  });

  const eventsHeaders = [['Title', 'Description', 'Date', 'Time', 'Cost', 'Image URL', 'Booking Link']];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${EVENTS_SHEET}!A1:G1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: eventsHeaders },
  });
}
