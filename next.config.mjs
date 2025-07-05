/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent optional pino dependency from breaking the build
  webpack: (config) => {
    config.resolve.alias ||= {};
    config.resolve.alias["pino-pretty"] = false;
    return config;
  },
};

export default nextConfig;
