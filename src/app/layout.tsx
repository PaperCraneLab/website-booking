import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Paper Crane Lab',
  description: 'Making STEM Education Accessible — Book a PCL Pass or explore our programs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SiteNavbar />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
