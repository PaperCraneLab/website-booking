import { Resend } from 'resend';
import { Booking } from '@/types';
import { getMachine, PASS_TYPES } from './machines';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'Paper Crane Lab <bookings@papercranelab.com>';
const ADMIN_EMAILS = ['hello@papercranelab.com', 'aditi@papercranelab.com'];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return format(new Date(y, m - 1, d), 'EEEE, d MMMM yyyy');
}

function formatTime(t: string): string {
  const [h, min] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${String(min).padStart(2, '0')} ${period}`;
}

function bookingTable(booking: Booking): string {
  const machine = getMachine(booking.machine);
  const isTraining = booking.bookingType === 'toolTraining';
  const rows: [string, string][] = [
    ['Machine', machine?.name ?? booking.machine],
    ['Booking Type', isTraining ? 'Tool Training' : 'PCL Pass'],
    ['Date', formatDate(booking.date)],
    ['Time', `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`],
    ...(!isTraining ? [['Pass Type', PASS_TYPES[booking.passType].label] as [string, string]] : []),
    ['Base Price', `₹${booking.basePrice}`],
    ...(booking.materialFee > 0 ? [['Material Fee', `₹${booking.materialFee}`] as [string, string]] : []),
    ['Total', `₹${booking.total}`],
    ['Booking ID', booking.id],
  ];
  return rows
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#3F4546;white-space:nowrap;">${k}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#3F4546;">${v}</td>
      </tr>`)
    .join('');
}

function wrapEmail(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Open Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#11B2CA;padding:28px 32px;text-align:center;">
            <div style="font-size:28px;margin-bottom:4px;">✈️</div>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Paper Crane Lab</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Making STEM Education Accessible</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;color:#3F4546;font-size:20px;">${title}</h2>
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#3F4546;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#C0C4CA;font-size:12px;">
              Questions? Email us at <a href="mailto:hello@papercranelab.com" style="color:#63C9D8;">hello@papercranelab.com</a>
            </p>
            <p style="margin:6px 0 0;color:#C0C4CA;font-size:11px;">© Paper Crane Lab · papercranelab.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function generateICS(booking: Booking): string {
  const machine = getMachine(booking.machine);
  const isTraining = booking.bookingType === 'toolTraining';
  const summary = isTraining
    ? `Tool Training — ${machine?.name ?? booking.machine}`
    : `PCL Pass — ${machine?.name ?? booking.machine}`;
  const description =
    `Booked by: ${booking.name}\\nEmail: ${booking.email}\\nPhone: ${booking.phone}\\nBooking ID: ${booking.id}`;
  const dateStr = booking.date.replace(/-/g, '');
  const start = booking.startTime.replace(':', '') + '00';
  const end   = booking.endTime.replace(':', '') + '00';
  const now   = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paper Crane Lab//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${booking.id}@papercranelab.com`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Kolkata:${dateStr}T${start}`,
    `DTEND;TZID=Asia/Kolkata:${dateStr}T${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'LOCATION:835\\, 10th Main Road\\, Water Tank Road\\, Indiranagar\\, Bangalore - 38',
    'ORGANIZER;CN=Paper Crane Lab:mailto:bookings@papercranelab.com',
    `ATTENDEE;RSVP=FALSE;CN=${booking.name}:mailto:${booking.email}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

async function sendEmail(params: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  const { data, error } = await resend.emails.send(params);
  if (error) {
    console.error('Resend API error:', JSON.stringify(error, null, 2));
    throw new Error(`Email delivery failed: ${error.message}`);
  }
  console.log('Email sent successfully, id:', data?.id);
}

export async function sendUserConfirmation(booking: Booking): Promise<void> {
  const machine = getMachine(booking.machine);
  const isTraining = booking.bookingType === 'toolTraining';

  const notice = isTraining
    ? `<div style="background:#11B2CA20;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0;color:#3F4546;font-size:14px;">
          <strong>📋 What to expect:</strong> A PCL team member will guide you through the machine.
          Please arrive a few minutes early. Wear closed-toe shoes if working with machinery.
        </p>
      </div>`
    : `<div style="background:#F9C431;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0;color:#3F4546;font-size:14px;">
          <strong>⚠️ Please note:</strong> A PCL Pass assumes you've completed tool training for this machine.
          If you haven't, please book a Tool Training session first.
        </p>
      </div>`;

  const subjectLabel = isTraining
    ? `Tool Training — ${machine?.name} on ${formatDate(booking.date)}`
    : `Booking confirmed — ${machine?.name} on ${formatDate(booking.date)}`;

  const html = wrapEmail(
    isTraining ? 'Your tool training is booked! 🎉' : 'Your booking is confirmed! 🎉',
    `<p style="color:#3F4546;margin:0 0 20px;">Hi <strong>${booking.name}</strong>, you're all set. Here's a summary:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${bookingTable(booking)}
    </table>
    ${notice}
    <p style="color:#3F4546;margin:0 0 8px;">Need to reschedule or cancel? Just reply to this email or contact us at
      <a href="mailto:hello@papercranelab.com" style="color:#11B2CA;">hello@papercranelab.com</a>.
    </p>
    <p style="color:#3F4546;margin:0;">See you at the lab! 🚀</p>`
  );

  await sendEmail({
    from: FROM_ADDRESS,
    to: booking.email,
    subject: subjectLabel,
    html,
  });
}

export async function sendAdminNotification(booking: Booking): Promise<void> {
  const machine = getMachine(booking.machine);
  const isTraining = booking.bookingType === 'toolTraining';
  const label = isTraining ? 'Tool Training' : 'PCL Pass';

  const html = wrapEmail(
    `New ${label} — ${machine?.name}`,
    `<p style="color:#3F4546;margin:0 0 20px;">A new ${label.toLowerCase()} has been booked.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#3F4546;">Customer</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#3F4546;">${booking.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#3F4546;">Email</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${booking.email}" style="color:#11B2CA;">${booking.email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#3F4546;">Phone</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#3F4546;">${booking.phone}</td>
      </tr>
      ${bookingTable(booking)}
    </table>`
  );

  await sendEmail({
    from: FROM_ADDRESS,
    to: ADMIN_EMAILS,
    subject: `New ${label} — ${machine?.name} · ${formatDate(booking.date)}`,
    html,
    attachments: [
      {
        filename: `pcl-booking-${booking.id.slice(0, 8)}.ics`,
        content: Buffer.from(generateICS(booking)).toString('base64'),
      },
    ],
  });
}
