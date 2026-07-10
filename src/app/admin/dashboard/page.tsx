'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Booking, BlockedSlot, DayHours } from '@/types';
import { MACHINES, getMachine } from '@/lib/machines';
import { formatDisplayTime } from '@/lib/utils';
import { LogOut, Loader2, Trash2, PlusCircle, RefreshCw, Save } from 'lucide-react';

type Tab = 'bookings' | 'blocks' | 'hours';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [hours, setHours] = useState<DayHours[]>([]);
  const [loading, setLoading] = useState(true);

  // New block form
  const [blockMachine, setBlockMachine] = useState('all');
  const [blockDate, setBlockDate] = useState('');
  const [blockStart, setBlockStart] = useState('10:00');
  const [blockEnd, setBlockEnd] = useState('18:00');
  const [blockReason, setBlockReason] = useState('');
  const [blockSaving, setBlockSaving] = useState(false);

  // Per-day saving state
  const [savingDay, setSavingDay] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  async function fetchData() {
    setLoading(true);
    try {
      const [bRes, blRes, hRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/blocks'),
        fetch('/api/admin/hours'),
      ]);
      const bData  = bRes.ok  ? await bRes.json()  : {};
      const blData = blRes.ok ? await blRes.json() : {};
      const hData  = hRes.ok  ? await hRes.json()  : {};
      setBookings(bData.bookings ?? []);
      setBlocks(blData.blocks ?? []);
      setHours(hData.hours ?? []);
    } catch (err) {
      console.error('fetchData error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status]);

  async function cancelBooking(id: string) {
    if (!confirm('Cancel this booking?')) return;
    await fetch('/api/admin/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setBlockSaving(true);
    await fetch('/api/admin/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine: blockMachine, date: blockDate, startTime: blockStart, endTime: blockEnd, reason: blockReason }),
    });
    setBlockDate('');
    setBlockReason('');
    setBlockSaving(false);
    fetchData();
  }

  async function deleteBlock(machine: string, date: string, startTime: string) {
    if (!confirm('Remove this block?')) return;
    await fetch('/api/admin/blocks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine, date, startTime }),
    });
    fetchData();
  }

  function updateHoursLocal(day: string, field: keyof DayHours, value: string) {
    setHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, [field]: value } : h))
    );
  }

  async function saveDayHours(day: DayHours) {
    setSavingDay(day.day);
    await fetch('/api/admin/hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(day),
    });
    setSavingDay(null);
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pcl-blue" />
      </div>
    );
  }

  if (!session) return null;

  const upcomingBookings = bookings
    .filter((b) => b.status !== 'cancelled' && b.date >= format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const pastBookings = bookings
    .filter((b) => b.date < format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
      tab === t
        ? 'bg-pcl-blue text-white'
        : 'bg-white border border-gray-200 text-gray-500 hover:border-pcl-blue hover:text-pcl-blue'
    }`;

  const inputClass = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark-gray focus:outline-none focus:ring-2 focus:ring-pcl-blue/30 focus:border-pcl-blue';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl text-pcl-dark-gray">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">PCL Makerspace Booking Manager</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-pcl-blue hover:text-pcl-blue text-sm transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Upcoming Bookings', value: upcomingBookings.length, color: 'text-pcl-blue' },
          { label: 'Total Revenue (upcoming)', value: `₹${upcomingBookings.reduce((s, b) => s + b.total, 0).toLocaleString()}`, color: 'text-pcl-blue' },
          { label: 'Active Blocks', value: blocks.length, color: 'text-pcl-pink' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`font-bold text-2xl ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button className={tabClass('bookings')} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={tabClass('blocks')}   onClick={() => setTab('blocks')}>Blocked Slots</button>
        <button className={tabClass('hours')}    onClick={() => setTab('hours')}>Lab Hours</button>
      </div>

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="space-y-6">
          <BookingTable title="Upcoming" bookings={upcomingBookings} onCancel={cancelBooking} />
          <BookingTable title="Past"     bookings={pastBookings}     onCancel={cancelBooking} dim />
        </div>
      )}

      {/* Blocks tab */}
      {tab === 'blocks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-pcl-dark-gray mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-pcl-blue" /> Block a time slot
            </h2>
            <form onSubmit={addBlock} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Machine</label>
                <select value={blockMachine} onChange={(e) => setBlockMachine(e.target.value)} className={inputClass}>
                  <option value="all">All machines</option>
                  {MACHINES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input type="date" required value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Start time</label>
                <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">End time</label>
                <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Reason (optional)</label>
                <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Maintenance, holiday, etc." className={inputClass} />
              </div>
              <div className="col-span-2">
                <button type="submit" disabled={blockSaving || !blockDate} className="px-5 py-2.5 bg-pcl-blue text-white rounded-xl font-semibold text-sm hover:bg-pcl-blue/90 disabled:opacity-50 transition-colors flex items-center gap-2">
                  {blockSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  Add Block
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-pcl-dark-gray">Active Blocks</h2>
            </div>
            {blocks.length === 0 ? (
              <p className="text-gray-400 text-sm p-5">No slots blocked.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Machine', 'Date', 'Time', 'Reason', ''].map((h) => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-500 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...blocks].sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)).map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-5 py-3 text-pcl-dark-gray">{b.machine === 'all' ? 'All machines' : getMachine(b.machine)?.name ?? b.machine}</td>
                      <td className="px-5 py-3 text-gray-600">{b.date}</td>
                      <td className="px-5 py-3 text-gray-600">{formatDisplayTime(b.startTime)} – {formatDisplayTime(b.endTime)}</td>
                      <td className="px-5 py-3 text-gray-400">{b.reason || '—'}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => deleteBlock(b.machine, b.date, b.startTime)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Hours tab */}
      {tab === 'hours' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-pcl-dark-gray">Lab Opening Hours</h2>
            <p className="text-gray-400 text-sm mt-0.5">Set open/close times per day. Changes save immediately per row.</p>
          </div>
          <div className="divide-y divide-gray-50">
            {hours.map((day) => (
              <div key={day.day} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="w-28 font-semibold text-pcl-dark-gray text-sm">{day.day}</div>

                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.status === 'closed'}
                    onChange={(e) => updateHoursLocal(day.day, 'status', e.target.checked ? 'closed' : 'open')}
                    className="rounded border-gray-300 text-pcl-blue"
                  />
                  <span className="text-gray-500">Closed</span>
                </label>

                {day.status === 'open' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Open</span>
                      <input type="time" value={day.open}  onChange={(e) => updateHoursLocal(day.day, 'open',  e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pcl-blue/30" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Close</span>
                      <input type="time" value={day.close} onChange={(e) => updateHoursLocal(day.day, 'close', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pcl-blue/30" />
                    </div>
                  </>
                )}

                <input
                  type="text"
                  value={day.note}
                  onChange={(e) => updateHoursLocal(day.day, 'note', e.target.value)}
                  placeholder="Note (optional)"
                  className="flex-1 min-w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pcl-blue/30"
                />

                <button
                  onClick={() => saveDayHours(day)}
                  disabled={savingDay === day.day}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pcl-blue text-white rounded-lg text-sm font-semibold hover:bg-pcl-blue/90 disabled:opacity-50 transition-colors"
                >
                  {savingDay === day.day ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingTable({ title, bookings, onCancel, dim }: {
  title: string; bookings: Booking[]; onCancel: (id: string) => void; dim?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${dim ? 'opacity-70' : ''}`}>
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-pcl-dark-gray">{title}</h2>
        <span className="text-xs text-gray-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-400 text-sm p-5">No bookings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Machine', 'Date', 'Time', 'Name', 'Email', 'Type', 'Total', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-pcl-dark-gray font-medium whitespace-nowrap">{getMachine(b.machine)?.name ?? b.machine}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDisplayTime(b.startTime)} – {formatDisplayTime(b.endTime)}</td>
                  <td className="px-4 py-3 text-pcl-dark-gray">{b.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{b.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.bookingType === 'toolTraining' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pcl-yellow/20 text-pcl-dark-gray">Training</span>
                    ) : (
                      <span className="text-gray-500 capitalize">{b.passType}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-pcl-blue">₹{b.total}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'confirmed' && (
                      <button onClick={() => onCancel(b.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Cancel booking">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
