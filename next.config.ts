import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const analyticsEnabled = !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// 'unsafe-inline' on script-src covers the theme pre-paint script and the
// JSON-LD blocks (both authored by us, never user input); Next.js itself
// requires 'unsafe-inline' on style-src for its inlined critical CSS.
// plausible.io is only allow-listed when analytics is actually opted into.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${analyticsEnabled ? " https://plausible.io" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}${analyticsEnabled ? " https://plausible.io" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
