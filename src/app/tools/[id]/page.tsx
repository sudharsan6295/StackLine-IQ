import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  Building2,
  CalendarClock,
  Star,
  TriangleAlert,
} from "lucide-react";
import { tools, functionById, phaseById, getToolsForFunction } from "@/lib/data";
import {
  formatFreeTier,
  formatPrice,
  formatPriceCompact,
  isPricingStale,
  STALE_PRICING_DAYS,
} from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return tools.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tools/[id]">): Promise<Metadata> {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) return {};
  const title = `${tool.name} — pricing, free tier, and best use case`;
  return {
    title,
    description: tool.description,
    openGraph: {
      title,
      description: tool.description,
      url: `${siteConfig.url}/tools/${tool.id}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) notFound();

  const primaryFunctionId = tool.functions[0];
  const primaryFunction = primaryFunctionId
    ? functionById.get(primaryFunctionId)
    : undefined;
  const alternatives = primaryFunctionId
    ? getToolsForFunction(primaryFunctionId)
        .filter((t) => t.id !== tool.id)
        .slice(0, 4)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "BusinessApplication",
    url: tool.officialUrl,
    offers: tool.paidTier.isCustomPricing
      ? undefined
      : {
          "@type": "Offer",
          price: tool.paidTier.startingPrice ?? 0,
          priceCurrency: tool.paidTier.currency ?? "USD",
        },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to registry
      </Link>

      <div className="mt-4 flex items-start gap-3">
        <span className="gradient-bg flex size-12 shrink-0 items-center justify-center rounded-xl font-data text-sm font-bold text-white">
          {tool.logoInitial ?? tool.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {tool.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{tool.bestFor}</p>
        </div>
        {tool.topPick && (
          <span className="gradient-bg ml-auto flex items-center gap-1 self-start rounded-full px-2.5 py-1 font-data text-xs font-semibold tracking-wide text-white uppercase">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Best pick
          </span>
        )}
      </div>

      <p className="mt-6 max-w-2xl text-base text-foreground/90">
        {tool.description}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-md border border-line bg-card p-5 sm:grid-cols-2">
        <div>
          <div className="font-data text-xs text-muted-foreground uppercase">
            Free tier
          </div>
          <div className="mt-1 font-medium">{formatFreeTier(tool)}</div>
        </div>
        <div>
          <div className="font-data text-xs text-muted-foreground uppercase">
            Starting price
          </div>
          <div className="mt-1 font-medium">{formatPrice(tool)}</div>
        </div>
        {tool.paidTier.notes && (
          <p className="col-span-full border-t border-line pt-3 text-sm text-muted-foreground">
            {tool.paidTier.notes}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tool.functions.map((fid) => (
          <Link
            key={fid}
            href={`/functions/${fid}`}
            className="rounded-xs border border-line px-2 py-1 font-data text-xs text-muted-foreground hover:border-signal hover:text-signal"
          >
            {functionById.get(fid)?.name ?? fid}
          </Link>
        ))}
        {tool.phases.map((pid) => (
          <span
            key={pid}
            className="rounded-xs border border-dashed border-line px-2 py-1 font-data text-xs text-muted-foreground"
          >
            {phaseById.get(pid)?.name ?? pid}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-sm text-muted-foreground">
        {tool.enterpriseReady && (
          <span className="flex items-center gap-1.5">
            <Building2 className="size-4" aria-hidden="true" /> Enterprise-ready
          </span>
        )}
        <span
          className={
            isPricingStale(tool)
              ? "flex items-center gap-1.5 text-amber"
              : "flex items-center gap-1.5"
          }
        >
          {isPricingStale(tool) ? (
            <TriangleAlert className="size-4" aria-hidden="true" />
          ) : (
            <CalendarClock className="size-4" aria-hidden="true" />
          )}{" "}
          Pricing checked {tool.lastChecked}
          {isPricingStale(tool) &&
            ` — over ${STALE_PRICING_DAYS} days ago, may be outdated`}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="gradient-bg rounded-full text-white hover:opacity-90">
          <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer">
            Visit {tool.name}{" "}
            <ExternalLink className="ml-1.5 size-4" aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <a href={tool.sourceUrl} target="_blank" rel="noopener noreferrer">
            View pricing source{" "}
            <ExternalLink className="ml-1.5 size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>

      {alternatives.length > 0 && (
        <div className="mt-10 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold">
            Alternatives in {primaryFunction?.name ?? "this function"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Other tools already sourced for the same function — compare
            before you commit.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                href={`/tools/${alt.id}`}
                className="flex flex-col gap-1.5 rounded-md border border-line bg-card p-3.5 hover:border-signal"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-secondary font-data text-xs font-semibold">
                    {alt.logoInitial ?? alt.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate text-sm font-semibold">
                    {alt.name}
                  </span>
                  {alt.topPick && (
                    <Star
                      className="ml-auto size-3.5 shrink-0 fill-amber text-amber"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{alt.bestFor}</p>
                <p className="mt-auto pt-1 font-data text-xs font-medium">
                  {formatPriceCompact(alt)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
