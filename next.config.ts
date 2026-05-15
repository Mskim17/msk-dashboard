import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://mskhouse.iptime.org:3324/api/:path*', // HTTP 서버 주소
      },
    ];
  },
};

export default nextConfig;
