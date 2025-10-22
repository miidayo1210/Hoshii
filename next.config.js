/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',  // Vercel用にコメントアウト
  trailingSlash: true,
  // basePath: '/Hoshii',  // ローカル開発時はコメントアウト
  // assetPrefix: '/Hoshii/',  // ローカル開発時はコメントアウト
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
