/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['raw.githubusercontent.com'],
  },
}

module.exports = nextConfig 