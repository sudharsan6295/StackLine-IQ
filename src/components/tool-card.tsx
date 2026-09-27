"use client";

import { Star, Building2, Bookmark, Scale, TriangleAlert } from "lucide-react";
import type { Tool } from "@/lib/schema";
import {
  formatFreeTier,
  formatPriceCompact,
  isPricingStale,
  STALE_PRICING_DAYS,
} from "@/lib/format";
import { useShortlistStore } from "@/lib/store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

const edgeColor: Record<Tool["badge"], string> = {
  Free: "var(--chart-3)",
  Freemium: "var(--signal)",
  Paid: "var(--amber)",
};

interface ToolCardProps {
  tool: Tool;
  onOpenDetails: (tool: Tool) => void;
}

export function ToolCard({ tool, onOpenDetails }: ToolCardProps) {
  // The shortlist/compare store persists to localStorage, which doesn't
  // exist during SSR — gate the derived booleans on mount so the client's
  // first render matches the server's (always "not saved/comparing")
  // instead of jumping straight to the rehydrated value and triggering a
  // hydration mismatch. See use-has-mounted.ts.
  const mounted = useHasMounted();
  const isShortlistedRaw = useShortlistStore((s) => s.isShortlisted(tool.id));
  const isComparingRaw = useShortlistStore((s) => s.isComparing(tool.id));
  const isShortlisted = mounted && isShortlistedRaw;
  const isComparing = mounted && isComparingRaw;
  const toggleShortlist = useShortlistStore((s) => s.toggleShortlist);
  const toggleCompare = useShortlistStore((s) => s.toggleCompare);

  return (
    <div
      className="group flex h-full flex-col rounded-xl border border-line bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTopWidth: "3px", borderTopColor: edgeColor[tool.badge] }}
    >
      <button
        type="button"
        onClick={() => onOpenDetails(tool)}
        className="flex flex-1 flex-col gap-3 p-4 text-left"
        aria-haspopup="dialog"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-secondary font-data text-[0.65rem] font-semibold">
              {tool.logoInitial ?? tool.name.slice(0, 2).toUpperCase()}
            </span>
            <h3 className="font-display text-sm leading-tight font-semibold">
              {tool.name}
            </h3>
          </div>
          {tool.topPick && (
            <span className="gradient-bg flex items-center gap-1 rounded-full px-2 py-0.5 font-data text-[0.6rem] font-bold tracking-wide text-white uppercase">
              <Star className="size-2.5 fill-current" aria-hidden="true" />
              Best pick
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{tool.bestFor}</p>

        <div className="mt-auto flex flex-col gap-1.5 pt-2 font-data text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {formatFreeTier(tool)}
            </span>
            <span className="font-semibold">{formatPriceCompact(tool)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[0.65rem] text-muted-foreground">
            {tool.enterpriseReady && (
              <span className="inline-flex items-center gap-0.5 rounded-xs border border-line px-1 py-0.5">
                <Building2 className="size-2.5" aria-hidden="true" />
                Enterprise
              </span>
            )}
            <span className="rounded-xs border border-line px-1 py-0.5">
              {tool.badge}
            </span>
            {isPricingStale(tool) && (
              <span
                className="inline-flex items-center gap-0.5 rounded-xs border border-amber/40 bg-amber/10 px-1 py-0.5 text-amber"
                title={`Pricing last verified ${tool.lastChecked} — over ${STALE_PRICING_DAYS} days ago`}
              >
                <TriangleAlert className="size-2.5" aria-hidden="true" />
                May be outdated
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1 border-t border-line p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 flex-1 gap-1.5 rounded-sm text-xs",
            isShortlisted && "bg-secondary",
          )}
          onClick={() => toggleShortlist(tool.id)}
          aria-pressed={isShortlisted}
        >
          <Bookmark
            className={cn("size-3.5", isShortlisted && "fill-current")}
            aria-hidden="true"
          />
          {isShortlisted ? "Saved" : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 flex-1 gap-1.5 rounded-sm text-xs",
            isComparing && "bg-secondary text-signal",
          )}
          onClick={() => toggleCompare(tool.id)}
          aria-pressed={isComparing}
          aria-label={
            isComparing
              ? `Remove ${tool.name} from compare`
              : `Add ${tool.name} to compare`
          }
        >
          <Scale className="size-3.5" aria-hidden="true" />
          {isComparing ? "Comparing" : "Compare"}
        </Button>
      </div>
    </div>
  );
}
