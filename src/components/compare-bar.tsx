"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Scale,
  Bookmark,
  Download,
  Link as LinkIcon,
  X,
  ExternalLink,
} from "lucide-react";
import { useShortlistStore } from "@/lib/store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { toolById, functionById, phaseById } from "@/lib/data";
import {
  formatFreeTier,
  formatPrice,
  formatPriceCompact,
  isPricingStale,
} from "@/lib/format";
import { toolsToCsv, downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

/**
 * useSearchParams needs a Suspense boundary, and not every place that
 * renders CompareBar (e.g. function-tool-grid.tsx) already provides one —
 * so CompareBar wraps its own real implementation rather than relying on
 * every call site to remember to.
 */
export function CompareBar() {
  return (
    <Suspense fallback={null}>
      <CompareBarInner />
    </Suspense>
  );
}

function CompareBarInner() {
  // Same SSR/localStorage mismatch as tool-card.tsx: this whole bar mounts
  // or stays hidden based on persisted state that doesn't exist on the
  // server, so gate the read on mount rather than letting the client's
  // first render disagree with the server's (always-hidden) markup.
  const mounted = useHasMounted();
  const compareIdsRaw = useShortlistStore((s) => s.compareIds);
  const shortlistIdsRaw = useShortlistStore((s) => s.shortlistIds);
  const compareIds = mounted ? compareIdsRaw : [];
  const shortlistIds = mounted ? shortlistIdsRaw : [];
  const toggleCompare = useShortlistStore((s) => s.toggleCompare);
  const toggleShortlist = useShortlistStore((s) => s.toggleShortlist);
  const clearCompare = useShortlistStore((s) => s.clearCompare);
  const addToShortlist = useShortlistStore((s) => s.addToShortlist);
  const addToCompare = useShortlistStore((s) => s.addToCompare);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hydrate from a shared link (?shortlist=id,id or ?compare=id,id), then
  // strip the params so refreshing or navigating away doesn't re-apply them.
  useEffect(() => {
    const shortlistParam = searchParams.get("shortlist");
    const compareParam = searchParams.get("compare");
    if (!shortlistParam && !compareParam) return;

    if (shortlistParam) {
      const ids = shortlistParam.split(",").filter((id) => toolById.has(id));
      if (ids.length) addToShortlist(ids);
    }
    if (compareParam) {
      const ids = compareParam.split(",").filter((id) => toolById.has(id));
      if (ids.length) addToCompare(ids);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("shortlist");
    params.delete("compare");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
    // Only ever run this against the params present on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [compareOpen, setCompareOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);

  const compareTools = compareIds
    .map((id) => toolById.get(id))
    .filter((t) => !!t);
  const shortlistTools = shortlistIds
    .map((id) => toolById.get(id))
    .filter((t) => !!t);

  if (compareIds.length === 0 && shortlistIds.length === 0) return null;

  const rows: Array<{
    label: string;
    render: (t: (typeof compareTools)[number]) => React.ReactNode;
  }> = [
    {
      label: "Best for",
      render: (t) => <span className="text-muted-foreground">{t.bestFor}</span>,
    },
    {
      label: "Description",
      render: (t) => (
        <span className="text-muted-foreground">{t.description}</span>
      ),
    },
    { label: "Badge", render: (t) => t.badge },
    { label: "Free tier", render: (t) => formatFreeTier(t) },
    { label: "Starting price", render: (t) => formatPrice(t) },
    {
      label: "Pricing notes",
      render: (t) => (
        <span className="text-muted-foreground">
          {t.paidTier.notes ?? "—"}
        </span>
      ),
    },
    {
      label: "Functions",
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.functions.map((id) => (
            <span
              key={id}
              className="rounded-full border border-line px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
            >
              {functionById.get(id)?.shortName ?? functionById.get(id)?.name ?? id}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Lifecycle stages",
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.phases.map((id) => (
            <span
              key={id}
              className="rounded-full border border-dashed border-line px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
            >
              {phaseById.get(id)?.name ?? id}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Enterprise-ready",
      render: (t) => (t.enterpriseReady ? "Yes" : "No"),
    },
    { label: "Top pick", render: (t) => (t.topPick ? "Yes" : "—") },
    {
      label: "Last checked",
      render: (t) => (
        <span className={isPricingStale(t) ? "text-amber" : undefined}>
          {t.lastChecked}
          {isPricingStale(t) && " — may be outdated"}
        </span>
      ),
    },
    {
      label: "Links",
      render: (t) => (
        <div className="flex flex-col gap-1">
          <a
            href={t.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-signal hover:underline"
          >
            Visit site <ExternalLink className="size-3" aria-hidden="true" />
          </a>
          <a
            href={t.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            Pricing source <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6">
          {compareIds.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-sm"
              onClick={() => setCompareOpen(true)}
            >
              <Scale className="size-3.5" aria-hidden="true" />
              Compare ({compareIds.length})
            </Button>
          )}
          {shortlistIds.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-sm"
              onClick={() => setShortlistOpen(true)}
            >
              <Bookmark className="size-3.5" aria-hidden="true" />
              Saved ({shortlistIds.length})
            </Button>
          )}
        </div>
      </div>

      <Sheet open={compareOpen} onOpenChange={setCompareOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display">Compare tools</SheetTitle>
            <SheetDescription>
              Detailed side-by-side comparison of up to 4 compared tools —
              click the × on any column to remove it.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-x-auto px-4 pb-4">
            {compareTools.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Add tools to compare from any tool card.
              </p>
            ) : (
              <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-28 p-2 text-left font-data text-xs text-muted-foreground uppercase">
                      Field
                    </th>
                    {compareTools.map((t) => (
                      <th
                        key={t.id}
                        className="w-[240px] border-l border-line p-2 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-semibold">
                            {t.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleCompare(t.id)}
                            aria-label={`Remove ${t.name} from compare`}
                          >
                            <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-line">
                      <th
                        scope="row"
                        className="p-2 text-left align-top font-data text-xs text-muted-foreground uppercase"
                      >
                        {row.label}
                      </th>
                      {compareTools.map((t) => (
                        <td
                          key={t.id}
                          className="border-l border-line p-2 align-top break-words"
                        >
                          {row.render(t)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <SheetFooter className="flex-row flex-wrap justify-between gap-2 border-t border-line pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              disabled={compareTools.length === 0}
            >
              Clear compare
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={compareTools.length === 0}
                onClick={() =>
                  downloadCsv("ai-tools-compare.csv", toolsToCsv(compareTools))
                }
              >
                <Download className="size-3.5" aria-hidden="true" /> Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={compareTools.length === 0}
                onClick={() => {
                  const url = new URL(window.location.origin);
                  url.searchParams.set("compare", compareIds.join(","));
                  navigator.clipboard.writeText(url.toString());
                }}
              >
                <LinkIcon className="size-3.5" aria-hidden="true" /> Copy link
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={shortlistOpen} onOpenChange={setShortlistOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display">Saved tools</SheetTitle>
            <SheetDescription>
              Kept in this browser. Export or share the list.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4">
            {shortlistTools.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing saved yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {shortlistTools.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-sm border border-line px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPriceCompact(t)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(t.id)}
                      aria-label={`Remove ${t.name} from saved`}
                    >
                      <X className="size-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <SheetFooter className="flex-row gap-2 border-t border-line pt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              disabled={shortlistTools.length === 0}
              onClick={() =>
                downloadCsv(
                  "ai-tools-shortlist.csv",
                  toolsToCsv(shortlistTools),
                )
              }
            >
              <Download className="size-3.5" aria-hidden="true" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              disabled={shortlistTools.length === 0}
              onClick={() => {
                const url = new URL(window.location.origin);
                url.searchParams.set("shortlist", shortlistIds.join(","));
                navigator.clipboard.writeText(url.toString());
              }}
            >
              <LinkIcon className="size-3.5" aria-hidden="true" /> Copy link
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
