import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-bold text-pcl-blue mb-4">404</h1>
        <h2 className="text-2xl font-bold text-pcl-dark-gray mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/makerspace" className="btn-secondary">Visit Makerspace</Link>
        </div>
      </div>
    </div>
  );
}
