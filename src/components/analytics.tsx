import Script from "next/script";

/**
 * Privacy-friendly analytics, off by default. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 * to opt into Plausible (no cookies, no personal data collected) — nothing
 * loads unless that env var is present at build time.
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!plausibleDomain) return null;

  return (
    <Script
      defer
      data-domain={plausibleDomain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
