"use client";

import { useMemo, useRef, useState } from "react";
import { functions, phases, tools as allTools } from "@/lib/data";
import { applyFilters } from "@/lib/filter-tools";
import { createToolSearchIndex, searchTools } from "@/lib/search";
import { useUrlFilters } from "@/lib/use-url-filters";
import { FunctionPhaseMatrix } from "@/components/function-phase-matrix";
import { RegistryFilterBar } from "@/components/registry-filter-bar";
import { ToolCard } from "@/components/tool-card";
import { ToolDetailsDrawer } from "@/components/tool-details-drawer";
import type { Tool } from "@/lib/schema";

const searchIndex = createToolSearchIndex(allTools);

export function RegistryExplorer() {
  const { filters, view, update, toggleListValue, clearAll } = useUrlFilters();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const matchedIds = useMemo(
    () => searchTools(searchIndex, filters.q),
    [filters.q],
  );
  const filtered = useMemo(
    () => applyFilters(allTools, filters, matchedIds),
    [filters, matchedIds],
  );

  function handleCellClick(functionId: string, phaseId: string) {
    update({ functions: [functionId], phases: [phaseId] });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeFunctionId =
    filters.functions.length === 1 ? filters.functions[0] : null;
  const activePhaseId = filters.phases.length === 1 ? filters.phases[0] : null;

  const groups = useMemo(() => {
    if (view === "function") {
      return functions
        .map((fn) => ({
          id: fn.id,
          name: fn.name,
          tools: filtered.filter((t) => t.functions.includes(fn.id)),
        }))
        .filter((g) => g.tools.length > 0);
    }
    return phases
      .map((phase) => ({
        id: phase.id,
        name: phase.name,
        tools: filtered.filter((t) => t.phases.includes(phase.id)),
      }))
      .filter((g) => g.tools.length > 0);
  }, [view, filtered]);

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="matrix-heading" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2
            id="matrix-heading"
            className="font-display text-lg font-semibold"
          >
            The function × lifecycle matrix
          </h2>
          <p className="text-xs text-muted-foreground">
            Select a cell to filter the registry below
          </p>
        </div>
        <FunctionPhaseMatrix
          onCellClick={handleCellClick}
          activeFunctionId={activeFunctionId}
          activePhaseId={activePhaseId}
        />
      </section>

      <section
        ref={resultsRef}
        aria-labelledby="registry-heading"
        className="flex scroll-mt-20 flex-col gap-4"
      >
        <h2
          id="registry-heading"
          className="font-display text-lg font-semibold"
        >
          Browse the registry
        </h2>
        <RegistryFilterBar
          filters={filters}
          view={view}
          onFiltersChange={update}
          onToggleList={toggleListValue}
          onViewChange={(v) => update({ view: v })}
          onClear={clearAll}
          resultCount={filtered.length}
        />

        {groups.length === 0 ? (
          <div className="rounded-md border border-dashed border-line py-16 text-center">
            <p className="font-medium">No tools match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing a filter or searching a different term.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groups.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
                  {group.name}
                  <span className="rounded-xs border border-line px-1.5 py-0.5 font-data text-[0.65rem] text-muted-foreground">
                    {group.tools.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.tools.map((tool) => (
                    <ToolCard
                      key={`${group.id}-${tool.id}`}
                      tool={tool}
                      onOpenDetails={setActiveTool}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ToolDetailsDrawer
        tool={activeTool}
        onOpenChange={(open) => !open && setActiveTool(null)}
      />
    </div>
  );
}
