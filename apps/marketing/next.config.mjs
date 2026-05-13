/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@gtmstack/ui",
    "@gtmstack/ai",
    "@gtmstack/analytics",
    "@gtmstack/payments",
    "@gtmstack/database-core",
    "@gtmstack/jobs",
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
