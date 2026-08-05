/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['papercranelab.com'],
  },
  async rewrites() {
    return [
      { source: '/annualreport', destination: '/annualreport/index.html' },
    ];
  },
};

module.exports = nextConfig;
