"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, BadgeCheck, X } from "lucide-react";
import type { Tool } from "@/lib/schema";
import { functionById } from "@/lib/data";
import { createToolSearchIndex, searchTools } from "@/lib/search";
import { formatFreeTier, formatPriceCompact } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "cn";

type UpdateType = "all" | "new" | "updated";

function groupByDate<T extends { date: string }>(items: T[]) {
  const groups: { date: string; items: T[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.date === item.date) last.items.push(item);
    else groups.push({ date: item.date, items: [item] });
  }
  return groups;
}

function ToolCardLink({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="flex flex-col gap-1.5 rounded-xl border border-line bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-secondary font-data text-xs font-semibold">
          {tool.logoInitial ?? tool.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="truncate text-sm font-semibold">{tool.name}</span>
        {tool.topPick && (
          <Star
            className="ml-auto size-3.5 shrink-0 fill-amber text-amber"
            aria-hidden="true"
          />
        )}
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
      <p className="text-[0.65rem] text-muted-foreground">
        {formatFreeTier(tool)}
      </p>
    </Link>
  );
}

interface WhatsNewExplorerProps {
  addedTools: Tool[];
  checkedTools: Tool[];
}

export function WhatsNewExplorer({
  addedTools,
  checkedTools,
}: WhatsNewExplorerProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<UpdateType>("all");
  const [functionIds, setFunctionIds] = useState<string[]>([]);
  const [topPickOnly, setTopPickOnly] = useState(false);

  const searchIndex = useMemo(() => {
    const byId = new Map<string, Tool>();
    for (const t of [...addedTools, ...checkedTools]) byId.set(t.id, t);
    return createToolSearchIndex([...byId.values()]);
  }, [addedTools, checkedTools]);

  const matchedIds = useMemo(
    () => searchTools(searchIndex, query),
    [searchIndex, query],
  );

  const availableFunctions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of [...addedTools, ...checkedTools]) {
      for (const fid of t.functions) counts.set(fid, (counts.get(fid) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([id, count]) => ({ id, count, name: functionById.get(id)?.name ?? id }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [addedTools, checkedTools]);

  function matchesFilters(tool: Tool) {
    if (matchedIds && !matchedIds.has(tool.id)) return false;
    if (functionIds.length > 0 && !tool.functions.some((f) => functionIds.includes(f)))
      return false;
    if (topPickOnly && !tool.topPick) return false;
    return true;
  }

  const filteredAdded = useMemo(
    () => (type === "updated" ? [] : addedTools.filter(matchesFilters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addedTools, type, matchedIds, functionIds, topPickOnly],
  );
  const filteredChecked = useMemo(
    () => (type === "new" ? [] : checkedTools.filter(matchesFilters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkedTools, type, matchedIds, functionIds, topPickOnly],
  );

  const addedGroups = groupByDate(
    filteredAdded.map((tool) => ({ date: tool.addedOn, tool })),
  );
  const checkedGroups = groupByDate(
    filteredChecked.map((tool) => ({ date: tool.lastChecked, tool })),
  );

  const activeFilterCount = functionIds.length + (topPickOnly ? 1 : 0);
  const hasAnyFilter = query.trim() !== "" || type !== "all" || activeFilterCount > 0;
  const totalResults = filteredAdded.length + filteredChecked.length;

  function toggleFunction(id: string) {
    setFunctionIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  function clearAll() {
    setQuery("");
    setType("all");
    setFunctionIds([]);
    setTopPickOnly(false);
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search updates by tool name or use case…"
              aria-label="Search updates"
              className="h-9 rounded-sm pl-9"
            />
          </div>

          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as UpdateType)}
            className="h-9 shrink-0 rounded-sm border border-line"
          >
            <ToggleGroupItem
              value="all"
              className="h-9 rounded-none rounded-l-sm px-3 text-xs data-[state=on]:gradient-bg data-[state=on]:text-white"
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value="new"
              className="h-9 rounded-none px-3 text-xs data-[state=on]:gradient-bg data-[state=on]:text-white"
            >
              New
            </ToggleGroupItem>
            <ToggleGroupItem
              value="updated"
              className="h-9 rounded-none rounded-r-sm px-3 text-xs data-[state=on]:gradient-bg data-[state=on]:text-white"
            >
              Price changes
            </ToggleGroupItem>
          </ToggleGroup>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 shrink-0 gap-1.5 rounded-sm">
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-signal font-data text-[0.6rem] text-signal-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              collisionPadding={{ top: 64, bottom: 16 }}
              className="max-h-[var(--radix-popover-content-available-height)] w-72 overflow-y-auto rounded-md p-4"
            >
              <div className="flex flex-col gap-5">
                <label className="flex items-center justify-between gap-2">
                  <span className="font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Top picks only
                  </span>
                  <Checkbox
                    checked={topPickOnly}
                    onCheckedChange={(v) => setTopPickOnly(!!v)}
                  />
                </label>

                <div>
                  <div className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Team
                  </div>
                  <div className="grid max-h-52 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                    {availableFunctions.map((fn) => (
                      <label key={fn.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={functionIds.includes(fn.id)}
                          onCheckedChange={() => toggleFunction(fn.id)}
                        />
                        {fn.name}
                        <span className="ml-auto font-data text-[0.65rem] text-muted-foreground">
                          {fn.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <span className="font-data font-semibold text-foreground">
              {totalResults}
            </span>{" "}
            update{totalResults === 1 ? "" : "s"} match
          </span>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <X className="size-3" aria-hidden="true" /> Clear all
            </button>
          )}
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-line py-16 text-center">
          <p className="font-medium">No updates match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing a filter or searching a different term.
          </p>
        </div>
      ) : (
        <>
          {addedGroups.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-lg font-semibold">Top new picks</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Newest first — the date each tool was actually added to the
                registry.
              </p>
              <div className="mt-4 flex flex-col gap-8">
                {addedGroups.map((group) => (
                  <div key={group.date}>
                    <h3 className="font-data text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {group.date}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.items.map(({ tool }) => (
                        <ToolCardLink key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {checkedGroups.length > 0 && (
            <section
              className={cn(
                "mt-12 pt-8",
                addedGroups.length > 0 && "border-t border-line",
              )}
            >
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <BadgeCheck className="size-4 text-signal" aria-hidden="true" />
                Price changes
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tools whose pricing, free tier, or plan details were most
                recently re-checked against the vendor&apos;s own page.
              </p>
              <div className="mt-4 flex flex-col gap-8">
                {checkedGroups.map((group) => (
                  <div key={group.date}>
                    <h3 className="font-data text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {group.date}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.items.map(({ tool }) => (
                        <ToolCardLink key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
