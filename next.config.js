/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["bk.raqamliavlod.uz", "i.ytimg.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
