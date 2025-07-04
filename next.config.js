const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['utfs.io'],
//   },
// }

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ufs.sh', // match all ufs.sh subdomains
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
}

module.exports = withNextVideo(nextConfig)
