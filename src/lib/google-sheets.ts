import { google } from 'googleapis';
import { Booking, BlockedSlot, BookingType, LabEvent, DayHours } from '@/types';

function getAuth() {
  let credentials: Record<string, string>;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
    const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, 'base64').toString('utf-8');
    credentials = JSON.parse(json);
  } else {
    credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, '') ?? '',
    };
  }

  return new google.auth.GoogleAuth({
    credentials,
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
const HOURS_SHEET = 'OpenHours';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_HOURS: DayHours[] = [
  { day: 'Monday',    open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Tuesday',   open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Wednesday', open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Thursday',  open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Friday',    open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Saturday',  open: '10:00', close: '18:00', status: 'open',   note: '', trainingOpen: true },
  { day: 'Sunday',    open: '10:00', close: '18:00', status: 'closed', note: '', trainingOpen: true },
];

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
    range: `${EVENTS_SHEET}!A2:H`,
  });
  const rows = res.data.values ?? [];

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC

  return rows
    .filter((r) => {
      if (!r[0]) return false;
      const publish = (r[7] ?? '').toString().trim().toUpperCase();
      if (publish !== '' && publish !== 'Y') return false;
      // Only filter by date when column C is clearly YYYY-MM-DD format
      const dateStr = (r[2] ?? '').toString().trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr) && dateStr < todayStr) return false;
      return true;
    })
    .map((row) => ({
      title:       row[0] ?? '',
      description: row[1] ?? '',
      date:        row[2] ?? '',
      time:        row[3] ?? '',
      cost:        row[4] ?? '',
      imageUrl:    row[5] ?? '',
      bookingLink: row[6] ?? '',
    }));
}

// ── Open Hours ────────────────────────────────────────────────────────────────
// OpenHours sheet: A=Day, B=Open, C=Close, D=Status, E=Note, F=TrainingOpen

export async function getOpenHours(): Promise<DayHours[]> {
  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${HOURS_SHEET}!A2:F`,
    });
    const rows = res.data.values ?? [];
    // Always return all 7 days in order, falling back to defaults for missing rows
    return DAY_ORDER.map((dayName) => {
      const row = rows.find((r) => r[0] === dayName);
      if (!row) return DEFAULT_HOURS.find((d) => d.day === dayName)!;
      return {
        day:          row[0],
        open:         row[1] ?? '10:00',
        close:        row[2] ?? '18:00',
        status:       (row[3] === 'closed' ? 'closed' : 'open') as 'open' | 'closed',
        note:         row[4] ?? '',
        trainingOpen: row[5] !== 'false',
      };
    });
  } catch {
    return DEFAULT_HOURS;
  }
}

export async function updateDayHours(hours: DayHours): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HOURS_SHEET}!A2:A`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === hours.day);
  const trainingVal = hours.trainingOpen === false ? 'false' : 'true';
  const rowData = [hours.day, hours.open, hours.close, hours.status, hours.note, trainingVal];
  if (rowIndex === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${HOURS_SHEET}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });
  } else {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${HOURS_SHEET}!A${rowIndex + 2}:F${rowIndex + 2}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });
  }
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

  const eventsHeaders = [['Title', 'Description', 'Date', 'Time', 'Cost', 'Image URL', 'Booking Link', 'Publish']];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${EVENTS_SHEET}!A1:H1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: eventsHeaders },
  });

  const hoursHeaders = [['Day', 'Open', 'Close', 'Status', 'Note']];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HOURS_SHEET}!A1:E1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: hoursHeaders },
  });

  // Seed default hours if sheet is empty
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HOURS_SHEET}!A2:A8`,
  });
  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${HOURS_SHEET}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: DEFAULT_HOURS.map((h) => [h.day, h.open, h.close, h.status, h.note]),
      },
    });
  }
}
