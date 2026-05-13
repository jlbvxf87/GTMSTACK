/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@gtmstack/ui",
    "@gtmstack/ai",
    "@gtmstack/payments",
    "@gtmstack/database-core",
    "@gtmstack/analytics",
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
