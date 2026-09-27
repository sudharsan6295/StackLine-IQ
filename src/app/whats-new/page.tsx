import type { Metadata } from "next";
import Link from "next/link";
import { Rss, Star } from "lucide-react";
import type { Tool } from "@/lib/schema";
import {
  getRecentlyAddedTools,
  getRecentlyCheckedTools,
  functionById,
} from "@/lib/data";
import { formatPriceCompact } from "@/lib/format";
import { WhatsNewExplorer } from "@/components/whats-new-explorer";

function TopPickHighlightCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="flex flex-col gap-2.5 rounded-xl border border-line bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTopWidth: "3px", borderTopColor: "var(--signal)" }}
    >
      <div className="flex items-center gap-2">
        <span className="gradient-bg flex size-8 shrink-0 items-center justify-center rounded-lg font-data text-xs font-bold text-white">
          {tool.logoInitial ?? tool.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="truncate text-sm font-semibold">{tool.name}</span>
        <span className="gradient-bg ml-auto flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-data text-[0.6rem] font-semibold tracking-wide text-white uppercase">
          <Star className="size-2.5 fill-current" aria-hidden="true" />
          Best pick
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{tool.bestFor}</p>
      <div className="mt-auto flex items-center justify-between pt-1 font-data text-xs">
        <span className="text-muted-foreground">
          {tool.functions
            .map((id) => functionById.get(id)?.shortName ?? id)
            .join(", ")}
        </span>
        <span className="font-semibold">{formatPriceCompact(tool)}</span>
      </div>
    </Link>
  );
}

export const metadata: Metadata = {
  title: "What's new",
  description:
    "New tools added to the registry and recent pricing re-verifications — a real changelog, searchable and filterable by team.",
};

const RECENTLY_CHECKED_LIMIT = 16;
const TOP_PICK_HIGHLIGHT_LIMIT = 6;

export default function WhatsNewPage() {
  const recentlyAdded = getRecentlyAddedTools();
  const recentlyChecked = getRecentlyCheckedTools(RECENTLY_CHECKED_LIMIT);

  // Category leaders worth calling out, drawn from the two changelogs above
  // rather than the whole registry's 21 top picks — this stays scoped to
  // what's actually new/recently updated, not a duplicate top-picks
  // directory. Order follows first appearance (new tools, then re-checked),
  // so the most recently-added top pick leads. Curated and unaffected by
  // the search/filter controls below (those apply to the two changelogs).
  const topPickHighlights = Array.from(
    new Map(
      [...recentlyAdded, ...recentlyChecked]
        .filter((tool) => tool.topPick)
        .map((tool) => [tool.id, tool] as const),
    ).values(),
  ).slice(0, TOP_PICK_HIGHLIGHT_LIMIT);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Updates
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        What&apos;s <span className="gradient-text">new</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Category leaders worth knowing, top new picks added to the registry,
        and price changes re-verified against each vendor&apos;s own page —
        three real changelogs, not one blended list.
      </p>
      <Link
        href="/whats-new/feed.xml"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-signal hover:underline"
      >
        <Rss className="size-3.5" aria-hidden="true" />
        Subscribe via RSS
      </Link>

      {topPickHighlights.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Star className="size-4 fill-amber text-amber" aria-hidden="true" />
            Top picks to know about
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Category-leading tools among the updates below — new to the
            registry or freshly re-verified.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topPickHighlights.map((tool) => (
              <TopPickHighlightCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <WhatsNewExplorer addedTools={recentlyAdded} checkedTools={recentlyChecked} />
    </div>
  );
}
