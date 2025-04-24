import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.watchstore.vn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
