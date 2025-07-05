/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore optional pino-pretty dependency to prevent build errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    }
    
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['v0-powerpuff-girls-9j.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v0-powerpuff-girls-9j.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
}

export default nextConfig
