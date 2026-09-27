"use client";

import { useState } from "react";
import type { Tool, LifecyclePhase } from "@/lib/schema";
import { ToolCard } from "@/components/tool-card";
import { ToolDetailsDrawer } from "@/components/tool-details-drawer";
import { CompareBar } from "@/components/compare-bar";

export function FunctionToolGrid({
  tools,
  phases,
}: {
  tools: Tool[];
  phases: LifecyclePhase[];
}) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const groups = phases
    .map((phase) => ({
      phase,
      tools: tools.filter((t) => t.phases.includes(phase.id)),
    }))
    .filter((g) => g.tools.length > 0);

  return (
    <div className="mt-4 flex flex-col gap-8">
      {groups.map(({ phase, tools: phaseTools }) => (
        <div key={phase.id} className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {phase.name}
            <span className="rounded-full border border-line px-1.5 py-0.5">
              {phaseTools.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phaseTools.map((tool) => (
              <ToolCard
                key={`${phase.id}-${tool.id}`}
                tool={tool}
                onOpenDetails={setActiveTool}
              />
            ))}
          </div>
        </div>
      ))}
      <ToolDetailsDrawer
        tool={activeTool}
        onOpenChange={(open) => !open && setActiveTool(null)}
      />
      <CompareBar />
    </div>
  );
}
