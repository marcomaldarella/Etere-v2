/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // static export
  images: {
    unoptimized: true,   // disattiva l’Image Optimization API
  },
};

export default nextConfig;