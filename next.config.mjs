
const nextConfig = {
  images: {
    remotePatterns: [
    {
      protocol: "https",
      hostname: "randomuser.me"
    }]

  },

  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    }
  }
};

export default nextConfig;
