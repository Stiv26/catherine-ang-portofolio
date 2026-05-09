/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduces memory footprint by ~40% on Railway
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Serve optimized images from Vercel/Railway instead of external CDN requests
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
  },

  // Remove unused locales
  i18n: undefined,

  // Compress responses
  compress: true,

  // Disable x-powered-by header (minor security + bandwidth saving)
  poweredByHeader: false,
};

export default nextConfig;
