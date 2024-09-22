/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
        //   pathname: '/**', // Adjust pathname as needed
        },
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
          pathname: '/**', // Adjust pathname as needed
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  