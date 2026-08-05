/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['papercranelab.com'],
  },
  async rewrites() {
    return [
      { source: '/annualreport', destination: '/annual_report/index.html' },
      { source: '/annualreport/:path*', destination: '/annual_report/:path*' },
    ];
  },
};

module.exports = nextConfig;
