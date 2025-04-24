/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  serverExternalPackages: ["mongoose"],
};

module.exports = nextConfig;
