/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GoDaddy
  output: 'export',
  trailingSlash: true,

  // Essential for static hosting
  images: {
    unoptimized: true
  },

  // Optimize for your animation libraries
  transpilePackages: ['gsap', 'lenis'],

  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
