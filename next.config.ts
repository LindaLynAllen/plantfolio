import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.getplanta.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
