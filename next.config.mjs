/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize webpack for performance
  webpack: (config, { dev, isServer }) => {
    // Optimize cache strategy for large strings
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      // Use Buffer instead of strings for large data
      maxMemoryGenerations: dev ? 1 : 2,
      memoryCacheUnaffected: true,
    };

    // Optimize module resolution
    config.resolve.symlinks = false;
    config.resolve.cacheWithContext = false;

    // Optimize bundle splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    };

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
    optimizePackageImports: ['@clerk/nextjs', 'mongoose'],
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

