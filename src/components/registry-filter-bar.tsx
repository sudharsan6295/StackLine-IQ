"use client";

import { Search, X, SlidersHorizontal, Download } from "lucide-react";
import { functions, phases } from "@/lib/data";
import type { ToolFilters } from "@/lib/filter-tools";
import { isFiltersEmpty } from "@/lib/filter-tools";
import type { Tool } from "@/lib/schema";
import { toolsToCsv, downloadCsv } from "@/lib/csv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "cn";

const BADGES = ["Free", "Freemium", "Paid"] as const;

interface RegistryFilterBarProps {
  filters: ToolFilters;
  view: "function" | "phase";
  onFiltersChange: (partial: Partial<ToolFilters>) => void;
  onToggleList: (key: "functions" | "phases" | "badges", value: string) => void;
  onViewChange: (view: "function" | "phase") => void;
  onClear: () => void;
  resultCount: number;
  resultTools: Tool[];
}

export function RegistryFilterBar({
  filters,
  view,
  onFiltersChange,
  onToggleList,
  onViewChange,
  onClear,
  resultCount,
  resultTools,
}: RegistryFilterBarProps) {
  const activeFilterCount =
    filters.functions.length +
    filters.phases.length +
    filters.badges.length +
    (filters.enterpriseOnly ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0);

  return (
    <div id="registry-filters" className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={filters.q}
            onChange={(e) => onFiltersChange({ q: e.target.value })}
            placeholder="Search tools by name or use case…"
            aria-label="Search tools"
            className="h-9 rounded-sm pl-9"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-1.5 rounded-sm">
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
            className="max-h-[var(--radix-popover-content-available-height)] w-80 overflow-y-auto rounded-md p-4"
          >
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Pricing
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BADGES.map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => onToggleList("badges", badge)}
                      className={cn(
                        "rounded-xs border px-2 py-1 text-xs font-medium",
                        filters.badges.includes(badge)
                          ? "border-signal bg-signal/10 text-signal"
                          : "border-line text-muted-foreground hover:text-foreground",
                      )}
                      aria-pressed={filters.badges.includes(badge)}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <span>Max monthly price</span>
                  <span className="text-foreground normal-case">
                    {filters.maxPrice === null
                      ? "Any"
                      : filters.maxPrice === 0
                        ? "Free only"
                        : `$${filters.maxPrice}`}
                  </span>
                </div>
                <Slider
                  value={[filters.maxPrice ?? 500]}
                  max={500}
                  step={10}
                  onValueChange={([v]) => onFiltersChange({ maxPrice: v })}
                  aria-label="Maximum monthly price"
                />
                {filters.maxPrice !== null && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ maxPrice: null })}
                    className="mt-1 text-xs text-signal hover:underline"
                  >
                    Clear price filter
                  </button>
                )}
              </div>

              <label className="flex items-center justify-between gap-2">
                <span className="font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Enterprise-ready only
                </span>
                <Switch
                  checked={filters.enterpriseOnly}
                  onCheckedChange={(v) =>
                    onFiltersChange({ enterpriseOnly: v })
                  }
                />
              </label>

              <div>
                <div className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Team
                </div>
                <div className="grid max-h-40 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                  {functions.map((fn) => (
                    <label
                      key={fn.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={filters.functions.includes(fn.id)}
                        onCheckedChange={() => onToggleList("functions", fn.id)}
                      />
                      {fn.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Stage
                </div>
                <div className="grid max-h-40 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                  {phases.map((phase) => (
                    <label
                      key={phase.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={filters.phases.includes(phase.id)}
                        onCheckedChange={() => onToggleList("phases", phase.id)}
                      />
                      {phase.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onViewChange(v as "function" | "phase")}
          className="h-9 shrink-0 rounded-sm border border-line"
        >
          <ToggleGroupItem
            value="function"
            className="h-9 rounded-none rounded-l-sm px-3 text-xs data-[state=on]:gradient-bg data-[state=on]:text-white"
          >
            By Team
          </ToggleGroupItem>
          <ToggleGroupItem
            value="phase"
            className="h-9 rounded-none rounded-r-sm px-3 text-xs data-[state=on]:gradient-bg data-[state=on]:text-white"
          >
            By Stage
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          type="button"
          variant="outline"
          className="h-9 shrink-0 gap-1.5 rounded-sm"
          disabled={resultTools.length === 0}
          onClick={() =>
            downloadCsv("ai-tools-registry.csv", toolsToCsv(resultTools))
          }
          title="Export the current filtered results as CSV"
        >
          <Download className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-data font-semibold text-foreground">
            {resultCount}
          </span>{" "}
          tool{resultCount === 1 ? "" : "s"} match
        </span>
        {!isFiltersEmpty(filters) && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
