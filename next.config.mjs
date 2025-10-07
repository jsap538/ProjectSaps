/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

