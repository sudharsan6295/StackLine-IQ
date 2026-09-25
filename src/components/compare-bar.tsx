"use client";

import { useState } from "react";
import { Scale, Bookmark, Download, Link as LinkIcon, X } from "lucide-react";
import { useShortlistStore } from "@/lib/store";
import { toolById } from "@/lib/data";
import { formatFreeTier, formatPrice } from "@/lib/format";
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

export function CompareBar() {
  const compareIds = useShortlistStore((s) => s.compareIds);
  const shortlistIds = useShortlistStore((s) => s.shortlistIds);
  const toggleCompare = useShortlistStore((s) => s.toggleCompare);
  const toggleShortlist = useShortlistStore((s) => s.toggleShortlist);
  const clearCompare = useShortlistStore((s) => s.clearCompare);

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
    { label: "Badge", render: (t) => t.badge },
    { label: "Free tier", render: (t) => formatFreeTier(t) },
    { label: "Starting price", render: (t) => formatPrice(t) },
    {
      label: "Enterprise-ready",
      render: (t) => (t.enterpriseReady ? "Yes" : "No"),
    },
    { label: "Top pick", render: (t) => (t.topPick ? "Yes" : "—") },
    { label: "Last checked", render: (t) => t.lastChecked },
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
              Shortlist ({shortlistIds.length})
            </Button>
          )}
        </div>
      </div>

      <Sheet open={compareOpen} onOpenChange={setCompareOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-md"
        >
          <SheetHeader>
            <SheetTitle className="font-display">Compare tools</SheetTitle>
            <SheetDescription>
              Side-by-side comparison of up to 4 shortlisted tools.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-x-auto px-4 pb-4">
            {compareTools.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Add tools to compare from any tool card.
              </p>
            ) : (
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-32 p-2 text-left font-data text-xs text-muted-foreground uppercase">
                      Field
                    </th>
                    {compareTools.map((t) => (
                      <th
                        key={t.id}
                        className="border-l border-line p-2 text-left"
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
                          className="border-l border-line p-2 align-top"
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
          <SheetFooter className="flex-row justify-between gap-2 border-t border-line pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              disabled={compareTools.length === 0}
            >
              Clear compare
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={shortlistOpen} onOpenChange={setShortlistOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display">Your shortlist</SheetTitle>
            <SheetDescription>
              Saved tools, kept in this browser. Export or share the list.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4">
            {shortlistTools.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing shortlisted yet.
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
                        {formatPrice(t)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(t.id)}
                      aria-label={`Remove ${t.name} from shortlist`}
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
