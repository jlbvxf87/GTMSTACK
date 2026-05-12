/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gtmstack/ui", "@gtmstack/analytics", "@gtmstack/payments"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
