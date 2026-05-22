import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}

export function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

export function formatDisplayTime(time: string): string {
  const h = parseHour(time);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${period}`;
}

export function addHours(time: string, hours: number): string {
  const h = parseHour(time) + hours;
  return `${String(h).padStart(2, '0')}:00`;
}
