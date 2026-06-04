import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "images.unsplash.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
