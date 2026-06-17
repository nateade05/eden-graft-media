import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.188.62"],
  async headers() {
    return [
      {
        source: "/assets/videos/:path*.mov",
        headers: [{ key: "Content-Type", value: "video/quicktime" }],
      },
      {
        // Cache all static media assets in the browser for 24 h so back-navigation
        // serves them from disk cache instead of re-fetching, eliminating the
        // poster/blur flash on the second visit.
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
