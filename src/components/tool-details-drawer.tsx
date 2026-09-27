"use client";

import Link from "next/link";
import {
  ExternalLink,
  Star,
  Building2,
  CalendarClock,
  TriangleAlert,
} from "lucide-react";
import type { Tool } from "@/lib/schema";
import { functionById, phaseById } from "@/lib/data";
import {
  formatFreeTier,
  formatPrice,
  isPricingStale,
  STALE_PRICING_DAYS,
} from "@/lib/format";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface ToolDetailsDrawerProps {
  tool: Tool | null;
  onOpenChange: (open: boolean) => void;
}

export function ToolDetailsDrawer({
  tool,
  onOpenChange,
}: ToolDetailsDrawerProps) {
  return (
    <Drawer open={!!tool} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-2xl">
        {tool && (
          <>
            <DrawerHeader className="text-left">
              <div className="flex items-center gap-2">
                <span className="gradient-bg flex size-9 shrink-0 items-center justify-center rounded-xl font-data text-xs font-bold text-white">
                  {tool.logoInitial ?? tool.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <DrawerTitle className="font-display text-lg">
                    {tool.name}
                  </DrawerTitle>
                  <DrawerDescription>{tool.bestFor}</DrawerDescription>
                </div>
                {tool.topPick && (
                  <span className="gradient-bg ml-auto flex items-center gap-1 self-start rounded-full px-2 py-0.5 font-data text-[0.6rem] font-semibold tracking-wide text-white uppercase">
                    <Star
                      className="size-2.5 fill-current"
                      aria-hidden="true"
                    />
                    Best pick
                  </span>
                )}
              </div>
            </DrawerHeader>

            <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-4">
              <p className="text-sm text-foreground/90">{tool.description}</p>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-secondary/40 p-3 font-data text-xs">
                <div>
                  <div className="text-muted-foreground">Free tier</div>
                  <div className="mt-0.5 font-semibold">
                    {formatFreeTier(tool)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Starting price</div>
                  <div className="mt-0.5 font-semibold">
                    {formatPrice(tool)}
                  </div>
                </div>
                {tool.paidTier.notes && (
                  <div className="col-span-2 border-t border-line pt-2 text-muted-foreground">
                    {tool.paidTier.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tool.functions.map((id) => (
                  <Link
                    key={id}
                    href={`/functions/${id}`}
                    className="rounded-xs border border-line px-1.5 py-0.5 font-data text-[0.65rem] text-muted-foreground hover:border-signal hover:text-signal"
                  >
                    {functionById.get(id)?.name ?? id}
                  </Link>
                ))}
                {tool.phases.map((id) => (
                  <span
                    key={id}
                    className="rounded-xs border border-dashed border-line px-1.5 py-0.5 font-data text-[0.65rem] text-muted-foreground"
                  >
                    {phaseById.get(id)?.name ?? id}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3 text-xs text-muted-foreground">
                {tool.enterpriseReady && (
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5" aria-hidden="true" />{" "}
                    Enterprise-ready
                  </span>
                )}
                <span
                  className={
                    isPricingStale(tool)
                      ? "flex items-center gap-1 text-amber"
                      : "flex items-center gap-1"
                  }
                >
                  {isPricingStale(tool) ? (
                    <TriangleAlert className="size-3.5" aria-hidden="true" />
                  ) : (
                    <CalendarClock className="size-3.5" aria-hidden="true" />
                  )}{" "}
                  Checked {tool.lastChecked}
                  {isPricingStale(tool) &&
                    ` — over ${STALE_PRICING_DAYS} days ago`}
                </span>
                <a
                  href={tool.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Pricing source{" "}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <DrawerFooter className="flex-row gap-2 border-t border-line pt-3">
              <Button asChild className="gradient-bg flex-1 rounded-full text-white hover:opacity-90">
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site{" "}
                  <ExternalLink className="ml-1 size-3.5" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1 rounded-full">
                <Link href={`/tools/${tool.id}`}>Full details page</Link>
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
