// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'solsticedev.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dev.letsmultiply.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev.letsmultiply.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;