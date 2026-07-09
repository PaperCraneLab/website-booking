import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns total minutes from midnight for a HH:mm string
export function parseMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Integer hour — kept for places that only need the hour component
export function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

// Generates 30-minute slots between startHour and endHour
export function generateTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let minutes = startHour * 60; minutes < endHour * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots;
}

export function formatDisplayTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

export function addMinutes(time: string, minutes: number): string {
  const total = parseMinutes(time) + minutes;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function addHours(time: string, hours: number): string {
  return addMinutes(time, Math.round(hours * 60));
}

export function formatDuration(hours: number): string {
  const totalMins = Math.round(hours * 60);
  if (totalMins < 60) return `${totalMins}m`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
