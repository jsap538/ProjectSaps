/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize webpack for performance
  webpack: (config, { dev, isServer }) => {
    // Fix browser globals for server-side rendering
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Define global variables to prevent 'self is not defined' error
    config.plugins = config.plugins || [];
    config.plugins.push(
      new (require('webpack')).DefinePlugin({
        'typeof self': JSON.stringify('undefined'),
        'typeof window': JSON.stringify(typeof window !== 'undefined' ? 'object' : 'undefined'),
      })
    );

    // Optimize cache strategy for large strings
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      maxMemoryGenerations: dev ? 1 : 2,
      memoryCacheUnaffected: true,
    };

    // Optimize module resolution
    config.resolve.symlinks = false;
    config.resolve.cacheWithContext = false;

    return config;
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  // Enable compression
  compress: true,

  // Optimize experimental features
  experimental: {
    optimizeCss: true,
    // Temporarily disable package import optimization to fix self is not defined error
    // optimizePackageImports: ['@clerk/nextjs', 'mongoose'],
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

