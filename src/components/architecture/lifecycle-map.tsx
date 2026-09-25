"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Star,
} from "lucide-react";
import {
  functionById,
  functions,
  phases,
  getToolsForCell,
  getConnectionsForFunction,
  getPhasesForFunction,
} from "@/lib/data";
import { getFunctionIcon } from "@/lib/function-icons";
import { getPhaseIcon } from "@/lib/phase-icons";
import { DetailPanel, type Selection } from "./detail-panel";
import { cn } from "cn";

const BUSINESS_LANE = [
  "product-ideation",
  "sales",
  "marketing",
  "customer-support",
  "executive-leadership-analytics",
  "finance",
  "hr-talent",
  "legal-compliance",
  "cross-company-ai-assistants",
];

const TECHNICAL_LANE = [
  "software-development",
  "qa-testing",
  "devops-operations",
  "design-creative",
  "it-security",
];

function functionToolCount(functionId: string): number {
  return phases.reduce(
    (sum, p) => sum + getToolsForCell(functionId, p.id).length,
    0,
  );
}

export function LifecycleMap() {
  const [selection, setSelection] = useState<Selection>(null);

  const relatedFunctionIds = useMemo(() => {
    if (!selection) return new Set<string>();
    if (selection.type === "function") {
      return new Set(
        getConnectionsForFunction(selection.id).map((c) => c.functionId),
      );
    }
    return new Set(
      functions
        .filter((f) => getToolsForCell(f.id, selection.id).length > 0)
        .map((f) => f.id),
    );
  }, [selection]);

  const relatedPhaseIds = useMemo(() => {
    if (!selection || selection.type === "phase") return new Set<string>();
    return new Set(getPhasesForFunction(selection.id).map((p) => p.id));
  }, [selection]);

  function toggle(next: Selection) {
    setSelection((prev) =>
      prev && next && prev.type === next.type && prev.id === next.id
        ? null
        : next,
    );
  }

  function functionClass(id: string) {
    const isActive = selection?.type === "function" && selection.id === id;
    const isRelated = relatedFunctionIds.has(id);
    return cn(
      "flex items-center gap-2 rounded-sm border px-2.5 py-2 text-left transition-colors",
      isActive
        ? "border-amber bg-amber/10"
        : isRelated
          ? "border-amber/50 bg-amber/5"
          : "border-line bg-card hover:border-amber/60",
    );
  }

  function phaseClass(id: string) {
    const isActive = selection?.type === "phase" && selection.id === id;
    const isRelated = relatedPhaseIds.has(id);
    return cn(
      "flex h-full w-[152px] shrink-0 flex-col gap-1.5 rounded-md border p-3 text-left transition-colors sm:w-[168px]",
      isActive
        ? "border-signal bg-signal/10"
        : isRelated
          ? "border-signal/50 bg-signal/5"
          : "border-line bg-card hover:border-signal/60",
    );
  }

  function renderFunctionChip(id: string) {
    const fn = functionById.get(id);
    if (!fn) return null;
    const Icon = getFunctionIcon(fn.icon);
    return (
      <button
        key={id}
        type="button"
        data-testid={`lifecycle-function-${id}`}
        onClick={() => toggle({ type: "function", id })}
        className={functionClass(id)}
      >
        <Icon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span>
          <span className="block text-xs font-semibold">
            {fn.shortName ?? fn.name}
          </span>
          <span className="block font-data text-[0.6rem] text-muted-foreground">
            {functionToolCount(fn.id)} tools
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
          Business &amp; go-to-market functions
        </p>
        {selection && (
          <button
            type="button"
            onClick={() => setSelection(null)}
            className="flex items-center gap-1.5 rounded-sm border border-line px-2 py-1 text-xs font-medium hover:border-signal hover:text-signal"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {BUSINESS_LANE.map(renderFunctionChip)}
      </div>

      <div
        className="my-1 flex items-center justify-center gap-1.5 text-muted-foreground/60"
        aria-hidden="true"
      >
        <ChevronDown className="size-3.5" />
        <span className="font-data text-[0.6rem] tracking-wide uppercase">
          informs &amp; supports every stage
        </span>
        <ChevronDown className="size-3.5" />
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 py-1 sm:mx-0 sm:justify-between sm:px-0">
        {phases.map((phase, i) => {
          const Icon = getPhaseIcon(phase.id);
          const isLast = i === phases.length - 1;
          return (
            <div
              key={phase.id}
              className="flex shrink-0 snap-start items-stretch sm:shrink"
            >
              <button
                type="button"
                data-testid={`lifecycle-phase-${phase.id}`}
                onClick={() => toggle({ type: "phase", id: phase.id })}
                className={phaseClass(phase.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-7 items-center justify-center rounded-sm bg-secondary text-signal">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-data text-[0.6rem] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}/07
                  </span>
                </div>
                <span className="font-display text-[0.8rem] leading-tight font-semibold">
                  {phase.name}
                </span>
                <span className="mt-auto font-data text-[0.6rem] text-muted-foreground">
                  {functions.reduce(
                    (sum, f) => sum + getToolsForCell(f.id, phase.id).length,
                    0,
                  )}{" "}
                  tools
                </span>
              </button>
              {!isLast && (
                <div
                  className="hidden w-6 shrink-0 items-center justify-center sm:flex"
                  aria-hidden="true"
                >
                  <ChevronRight className="size-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-sm border border-dashed border-line px-3 py-1.5 text-xs text-muted-foreground">
        <RotateCcw
          className="size-3.5 shrink-0 text-signal"
          aria-hidden="true"
        />
        Learnings from {phases[phases.length - 1]?.name} feed back into{" "}
        {phases[0]?.name} — the loop starts again for the next release.
      </div>

      <div
        className="my-1 flex items-center justify-center gap-1.5 text-muted-foreground/60"
        aria-hidden="true"
      >
        <ChevronUp className="size-3.5" />
        <span className="font-data text-[0.6rem] tracking-wide uppercase">
          built &amp; run by
        </span>
        <ChevronUp className="size-3.5" />
      </div>

      <p className="font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
        Technical &amp; delivery functions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {TECHNICAL_LANE.map(renderFunctionChip)}
      </div>

      {!selection && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3 text-amber" aria-hidden="true" />
          Click any stage or function above to see its subtypes, connections,
          and top-pick tools.
        </p>
      )}

      {selection && (
        <div className="mt-3">
          <DetailPanel selection={selection} onSelect={setSelection} />
        </div>
      )}
    </div>
  );
}
