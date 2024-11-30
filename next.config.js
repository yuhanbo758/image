/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://raw.githubusercontent.com/yuhanbo758/image/main/:path*',
      },
    ]
  }
}

module.exports = nextConfig 