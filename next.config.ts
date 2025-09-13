import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "beaverhacks.org",
      },
      // You can add other trusted domains here
    ],
  },
};

export default nextConfig;
