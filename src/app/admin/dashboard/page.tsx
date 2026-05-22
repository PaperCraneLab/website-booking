'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Booking, BlockedSlot } from '@/types';
import { MACHINES, getMachine } from '@/lib/machines';
import { formatDisplayTime } from '@/lib/utils';
import { LogOut, Loader2, Trash2, PlusCircle, RefreshCw } from 'lucide-react';

type Tab = 'bookings' | 'blocks';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // New block form
  const [blockMachine, setBlockMachine] = useState('all');
  const [blockDate, setBlockDate] = useState('');
  const [blockStart, setBlockStart] = useState('10:00');
  const [blockEnd, setBlockEnd] = useState('18:00');
  const [blockReason, setBlockReason] = useState('');
  const [blockSaving, setBlockSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  async function fetchData() {
    setLoading(true);
    try {
      const [bRes, blRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/blocks'),
      ]);

      if (!bRes.ok) {
        console.error('Bookings API error:', bRes.status, await bRes.text());
      }
      if (!blRes.ok) {
        console.error('Blocks API error:', blRes.status, await blRes.text());
      }

      const bData = bRes.ok ? await bRes.json() : {};
      const blData = blRes.ok ? await blRes.json() : {};
      setBookings(bData.bookings ?? []);
      setBlocks(blData.blocks ?? []);
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
      body: JSON.stringify({
        machine: blockMachine,
        date: blockDate,
        startTime: blockStart,
        endTime: blockEnd,
        reason: blockReason,
      }),
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pcl-teal" />
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-pcl-dark">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">PCL Makerspace Booking Manager</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-pcl-teal hover:text-pcl-teal text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Upcoming Bookings', value: upcomingBookings.length, color: 'text-pcl-teal' },
          { label: 'Total Revenue (upcoming)', value: `₹${upcomingBookings.reduce((s, b) => s + b.total, 0).toLocaleString()}`, color: 'text-pcl-teal' },
          { label: 'Active Blocks', value: blocks.length, color: 'text-pcl-pink' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`font-poppins font-bold text-2xl ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['bookings', 'blocks'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-poppins font-semibold text-sm transition-colors ${
              tab === t
                ? 'bg-pcl-teal text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-pcl-teal hover:text-pcl-teal'
            }`}
          >
            {t === 'bookings' ? 'Bookings' : 'Blocked Slots'}
          </button>
        ))}
      </div>

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="space-y-6">
          <BookingTable
            title="Upcoming"
            bookings={upcomingBookings}
            onCancel={cancelBooking}
          />
          <BookingTable
            title="Past"
            bookings={pastBookings}
            onCancel={cancelBooking}
            dim
          />
        </div>
      )}

      {/* Blocks tab */}
      {tab === 'blocks' && (
        <div className="space-y-6">
          {/* Add block form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-poppins font-semibold text-pcl-dark mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-pcl-teal" />
              Block a time slot
            </h2>
            <form onSubmit={addBlock} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Machine</label>
                <select
                  value={blockMachine}
                  onChange={(e) => setBlockMachine(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark focus:outline-none focus:ring-2 focus:ring-pcl-teal/40"
                >
                  <option value="all">All machines</option>
                  {MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark focus:outline-none focus:ring-2 focus:ring-pcl-teal/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Start time</label>
                <input
                  type="time"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark focus:outline-none focus:ring-2 focus:ring-pcl-teal/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">End time</label>
                <input
                  type="time"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark focus:outline-none focus:ring-2 focus:ring-pcl-teal/40"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Reason (optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Maintenance, holiday, etc."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-pcl-dark focus:outline-none focus:ring-2 focus:ring-pcl-teal/40"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={blockSaving || !blockDate}
                  className="px-5 py-2.5 bg-pcl-teal text-white rounded-xl font-poppins font-semibold text-sm hover:bg-pcl-teal/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {blockSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  Add Block
                </button>
              </div>
            </form>
          </div>

          {/* Existing blocks */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-poppins font-semibold text-pcl-dark">Active Blocks</h2>
            </div>
            {blocks.length === 0 ? (
              <p className="text-gray-400 text-sm p-5">No slots blocked.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 font-semibold text-gray-500 text-xs">Machine</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 text-xs">Date</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 text-xs">Time</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 text-xs">Reason</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-5 py-3 text-pcl-dark">
                        {b.machine === 'all' ? 'All machines' : getMachine(b.machine)?.name ?? b.machine}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{b.date}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatDisplayTime(b.startTime)} – {formatDisplayTime(b.endTime)}
                      </td>
                      <td className="px-5 py-3 text-gray-400">{b.reason || '—'}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => deleteBlock(b.machine, b.date, b.startTime)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
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
    </div>
  );
}

function BookingTable({
  title,
  bookings,
  onCancel,
  dim,
}: {
  title: string;
  bookings: Booking[];
  onCancel: (id: string) => void;
  dim?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${dim ? 'opacity-70' : ''}`}>
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-poppins font-semibold text-pcl-dark">{title}</h2>
        <span className="text-xs text-gray-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-400 text-sm p-5">No bookings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Machine', 'Date', 'Time', 'Name', 'Email', 'Pass', 'Total', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-pcl-dark font-medium whitespace-nowrap">
                    {getMachine(b.machine)?.name ?? b.machine}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDisplayTime(b.startTime)} – {formatDisplayTime(b.endTime)}
                  </td>
                  <td className="px-4 py-3 text-pcl-dark">{b.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{b.email}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap capitalize">
                    {b.bookingType === 'toolTraining' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pcl-yellow/20 text-pcl-dark">Training</span>
                    ) : b.passType}
                  </td>
                  <td className="px-4 py-3 font-semibold text-pcl-teal">₹{b.total}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === 'confirmed'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => onCancel(b.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                        title="Cancel booking"
                      >
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
