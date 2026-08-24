import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ['*.staging.revolte.io'],
};

export default nextConfig;
