import { Machine } from '@/types';

export const MACHINES: Machine[] = [
  {
    id: 'vinyl-cutter',
    name: 'Vinyl Cutter',
    description: 'Cut vinyl, paper, fabric, and other thin materials with precision. Great for stickers, decals, and signage.',
    materialFee: 0,
    icon: '✂️',
    accentColor: '#F19198',
  },
  {
    id: '3d-printer-creality',
    name: '3D Printer — Creality',
    description: 'FDM 3D printing with the Creality range. Bring your models to life in plastic.',
    materialFee: 50,
    icon: '🖨️',
    accentColor: '#11B2CA',
  },
  {
    id: '3d-printer-bambu',
    name: '3D Printer — Bambu',
    description: 'High-speed multi-material FDM printing with the Bambu Lab printer. Faster prints, more detail.',
    materialFee: 100,
    icon: '🖨️',
    accentColor: '#63C9D8',
  },
  {
    id: 'laser-cutter',
    name: 'Laser Cutter',
    description: 'Cut and engrave wood, acrylic, leather, cardboard, and more with pinpoint precision.',
    materialFee: 0,
    icon: '⚡',
    accentColor: '#F9C431',
  },
  {
    id: 'woodworking',
    name: 'Woodworking',
    description: 'Scroll saw, jigsaw, and a full suite of standard woodworking tools for your projects.',
    materialFee: 0,
    icon: '🔨',
    accentColor: '#3F4546',
  },
  {
    id: 'sewing-machine',
    name: 'Sewing Machine',
    description: 'Domestic and industrial sewing machines for fabric projects, repairs, and soft goods.',
    materialFee: 0,
    icon: '🧵',
    accentColor: '#F19198',
  },
  {
    id: 'electronics',
    name: 'Electronics Prototyping',
    description: 'Soldering stations, oscilloscopes, multimeters, power supplies, and breadboard kits.',
    materialFee: 0,
    icon: '🔌',
    accentColor: '#11B2CA',
  },
];

export const PASS_TYPES = {
  hourly: {
    label: 'Hourly Pass',
    price: 200,
    description: '₹200 per hour',
    shortDesc: 'Pay per hour',
  },
  tenHour: {
    label: '10-Hour Pack',
    price: 1500,
    description: '₹1,500 for 10 hours',
    shortDesc: 'Punch card — use across multiple visits',
  },
  fullDay: {
    label: 'Full Day Pass',
    price: 1000,
    description: '₹1,000 for the full day (10am – 6pm)',
    shortDesc: '10am to 6pm',
  },
} as const;

export const OPEN_HOURS = { start: 10, end: 18 }; // 10am – 6pm
export const MAX_CONCURRENT_PASSES = 2;
export const TOOL_TRAINING_PRICE = 500; // ₹500 flat fee per training session

export function getMachine(id: string): Machine | undefined {
  return MACHINES.find((m) => m.id === id);
}

export function calculatePrice(passType: keyof typeof PASS_TYPES, hours: number): number {
  if (passType === 'hourly') return PASS_TYPES.hourly.price * hours;
  if (passType === 'tenHour') return PASS_TYPES.tenHour.price;
  return PASS_TYPES.fullDay.price;
}
