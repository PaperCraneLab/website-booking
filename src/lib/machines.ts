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
    materialFee: 50,  // per hour (filament)
    icon: '🖨️',
    accentColor: '#11B2CA',
    pricingModel: 'firstHourOnly',
  },
  {
    id: '3d-printer-bambu',
    name: '3D Printer — Bambu',
    description: 'High-speed multi-material FDM printing with the Bambu Lab printer. Faster prints, more detail.',
    materialFee: 100,  // per hour (filament)
    icon: '🖨️',
    accentColor: '#63C9D8',
    pricingModel: 'firstHourOnly',
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
} as const;

export const OPEN_HOURS = { start: 10, end: 18 }; // fallback: 10am – 6pm
export const MAX_CONCURRENT_PASSES = 2;
export const TOOL_TRAINING_PRICE = 500; // ₹500 flat fee per training session

export function getMachine(id: string): Machine | undefined {
  return MACHINES.find((m) => m.id === id);
}

// Base machine-time price (excluding materials)
export function getBasePrice(passType: keyof typeof PASS_TYPES, hours: number, machine?: Machine): number {
  if (machine?.pricingModel === 'firstHourOnly') {
    // 3D printers: ₹200 machine fee covers only the first hour
    return PASS_TYPES.hourly.price;
  }
  if (passType === 'tenHour') return PASS_TYPES.tenHour.price;
  return PASS_TYPES.hourly.price * hours;
}

// Material fee on top of base price
export function getMaterialFee(machine: Machine, hours: number): number {
  if (machine.pricingModel === 'firstHourOnly') {
    return machine.materialFee * hours; // per-hour filament cost
  }
  return machine.materialFee; // flat (0 for all non-3D machines)
}
