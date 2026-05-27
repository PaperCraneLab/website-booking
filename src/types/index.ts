export type PassType = 'hourly' | 'tenHour' | 'fullDay';

export type BookingType = 'pass' | 'toolTraining';

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  machine: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  passType: PassType;
  hours: number;
  name: string;
  email: string;
  phone: string;
  basePrice: number;
  materialFee: number;
  total: number;
  bookingTimestamp: string;
  status: BookingStatus;
  bookingType: BookingType;
}

export interface BlockedSlot {
  machine: string;     // machine id or 'all'
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  reason: string;
}

export interface TimeSlot {
  time: string;        // HH:mm
  available: boolean;
  count: number;       // active bookings at this time across all machines
}

export interface DayHours {
  day: string;            // Monday … Sunday
  open: string;           // HH:mm
  close: string;          // HH:mm
  status: 'open' | 'closed';
  note: string;
}

export interface LabEvent {
  title: string;
  description: string;
  date: string;        // display string, e.g. "15 June 2025"
  time: string;        // display string, e.g. "10:00 AM – 12:00 PM"
  cost: string;        // e.g. "Free" or "₹500"
  imageUrl: string;
  bookingLink: string;
}

export interface Machine {
  id: string;
  name: string;
  description: string;
  materialFee: number;
  icon: string;
  accentColor: string;
}

export interface BookingFormData {
  machine: string;
  date: string;
  startTime: string;
  endTime: string;
  passType: PassType;
  hours: number;
  name: string;
  email: string;
  phone: string;
  bookingType: BookingType;
}
