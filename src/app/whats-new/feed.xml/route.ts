import { NextResponse } from "next/server";
import { getRecentlyAddedTools } from "@/lib/data";
import { formatFreeTier, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** GET /whats-new/feed.xml — RSS 2.0, one item per tool, newest addedOn first. */
export function GET() {
  const tools = getRecentlyAddedTools();
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const items = tools
    .map((tool) => {
      const url = `${siteUrl}/tools/${tool.id}`;
      const pubDate = new Date(`${tool.addedOn}T00:00:00Z`).toUTCString();
      const description = escapeXml(
        `${tool.bestFor} — ${formatFreeTier(tool)}. ${formatPrice(tool)}.`,
      );
      return `    <item>
      <title>${escapeXml(tool.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} — What's new</title>
    <link>${siteUrl}/whats-new</link>
    <description>Every tool added to the ${escapeXml(siteConfig.name)} registry, newest first.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
