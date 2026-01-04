import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /supabase\/functions/ },
    ];
    return config;
  },
  // Force Vercel rebuild - framer-motion completely removed
};

export default nextConfig;
// Cache bust: 1767506296
