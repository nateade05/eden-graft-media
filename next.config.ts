import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.188.62"],
  async headers() {
    return [
      {
        source: "/assets/videos/:path*.mov",
        headers: [{ key: "Content-Type", value: "video/quicktime" }],
      },
    ];
  },
};

export default nextConfig;
