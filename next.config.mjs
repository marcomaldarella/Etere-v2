/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export when EXPORT environment variable is true
  ...(process.env.EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
  }),

  images: {
    unoptimized: true, // Already set - good for both Vercel and static export
  },

  // Ensure compatibility with your animation libraries
  transpilePackages: ['gsap', 'lenis'],

  // Optimize for production
  swcMinify: true,

  // Handle TypeScript and ESLint during builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
