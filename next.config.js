/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["chwhvo0jyabanku0.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
  rewrites: async () => [
    {
      source: "/privacy",
      destination: "https://api.emojis.sh/assets/privacy",
      basePath: false,
    },
    {
      source: "/terms",
      destination: "https://api.emojis.sh/assets/terms",
      basePath: false,
    },
  ],
};

module.exports = nextConfig;
