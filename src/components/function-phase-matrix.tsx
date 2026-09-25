"use client";

import { useMemo } from "react";
import { functions, phases, getMatrixCounts } from "@/lib/data";
import { cn } from "cn";

interface FunctionPhaseMatrixProps {
  onCellClick: (functionId: string, phaseId: string) => void;
  activeFunctionId?: string | null;
  activePhaseId?: string | null;
}

export function FunctionPhaseMatrix({
  onCellClick,
  activeFunctionId,
  activePhaseId,
}: FunctionPhaseMatrixProps) {
  const counts = useMemo(() => getMatrixCounts(), []);
  const max = useMemo(
    () =>
      Math.max(
        1,
        ...Object.values(counts).flatMap((row) => Object.values(row)),
      ),
    [counts],
  );

  return (
    <div className="overflow-x-auto rounded-md border border-line bg-card">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <caption className="sr-only">
          Number of AI tools available for each business function at each
          product lifecycle phase. Select a cell to filter the registry below.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-card p-3 font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase"
            >
              Function \ Phase
            </th>
            {phases.map((phase) => (
              <th
                key={phase.id}
                scope="col"
                className={cn(
                  "min-w-[92px] border-l border-line p-2 text-center font-data text-[0.62rem] font-medium tracking-wide text-muted-foreground uppercase",
                  activePhaseId === phase.id && "bg-signal/5 text-signal",
                )}
              >
                {phase.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {functions.map((fn) => (
            <tr key={fn.id} className="border-t border-line">
              <th
                scope="row"
                className={cn(
                  "sticky left-0 z-10 bg-card p-3 text-left text-sm font-medium whitespace-nowrap",
                  activeFunctionId === fn.id && "bg-signal/5 text-signal",
                )}
              >
                {fn.shortName ?? fn.name}
              </th>
              {phases.map((phase) => {
                const count = counts[fn.id]?.[phase.id] ?? 0;
                const intensity = count === 0 ? 0 : Math.max(0.12, count / max);
                const isActive =
                  activeFunctionId === fn.id && activePhaseId === phase.id;
                return (
                  <td
                    key={phase.id}
                    className="border-l border-line p-1 text-center"
                  >
                    <button
                      type="button"
                      onClick={() => onCellClick(fn.id, phase.id)}
                      disabled={count === 0}
                      className={cn(
                        "flex h-11 w-full items-center justify-center rounded-xs font-data text-xs font-semibold transition-colors",
                        count === 0
                          ? "cursor-default text-muted-foreground/40"
                          : "hover:ring-1 hover:ring-signal",
                        isActive && "ring-2 ring-signal",
                      )}
                      style={
                        count > 0
                          ? {
                              backgroundColor: `color-mix(in oklab, var(--signal) ${Math.round(intensity * 55)}%, transparent)`,
                            }
                          : undefined
                      }
                      aria-label={`${fn.name} × ${phase.name}: ${count} tool${count === 1 ? "" : "s"}`}
                    >
                      {count > 0 ? count : "·"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
