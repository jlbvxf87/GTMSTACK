/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gtmstack/ui", "@gtmstack/analytics"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
