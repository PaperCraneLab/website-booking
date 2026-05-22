# PCL Booking App — Setup Guide

## 1. Install dependencies

```bash
cd papercranelab-booking
npm install
```

## 2. Set up Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts → Create Service Account**
5. Name it (e.g. `pcl-booking`) and click through to finish
6. Click the service account → **Keys → Add Key → JSON** → download the file
7. Copy `client_email` and `private_key` from the JSON into your `.env.local`

8. Create a new [Google Sheet](https://sheets.google.com)
9. Create two sheets (tabs) named exactly:
   - `Bookings`
   - `BlockedSlots`
10. Share the sheet with your service account email (editor access)
11. Copy the spreadsheet ID from the URL into `GOOGLE_SHEETS_ID`

> The app will write column headers automatically on first booking.

## 3. Set up Resend (email)

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/month)
2. Add and verify your domain (`papercranelab.com`)
3. Create an API key and paste it into `RESEND_API_KEY`

> Until your domain is verified, you can test with Resend's sandbox (emails only deliver to your own address).

## 4. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

Admin panel: http://localhost:3000/admin

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all `.env.local` values as Environment Variables in the Vercel dashboard.

Set `NEXTAUTH_URL` to your production URL (e.g. `https://book.papercranelab.com`).

## Custom domain

Point a subdomain (e.g. `book.papercranelab.com`) to your Vercel deployment via your DNS provider.
