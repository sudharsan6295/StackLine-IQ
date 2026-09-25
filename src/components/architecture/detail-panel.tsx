"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Star, X } from "lucide-react";
import {
  functionById,
  phaseById,
  getFunctionsForPhase,
  getPhasesForFunction,
  getConnectionsForFunction,
  getTopPicksForFunction,
} from "@/lib/data";
import { getTopPicksForPhase } from "@/lib/lifecycle-top-picks";
import { getFunctionIcon } from "@/lib/function-icons";
import { getPhaseIcon } from "@/lib/phase-icons";

export type Selection = { type: "phase" | "function"; id: string } | null;

interface DetailPanelProps {
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

function Chip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xs border border-line bg-secondary/40 px-2 py-1 text-left text-xs font-medium hover:border-signal hover:text-signal"
    >
      {children}
    </button>
  );
}

function SectionLabel({
  children,
  amber,
}: {
  children: React.ReactNode;
  amber?: boolean;
}) {
  return (
    <p
      className={`mb-2 flex items-center gap-1 font-data text-xs font-medium tracking-wide uppercase ${amber ? "text-amber" : "text-muted-foreground"}`}
    >
      {children}
    </p>
  );
}

export function DetailPanel({ selection, onSelect }: DetailPanelProps) {
  if (!selection) return null;

  if (selection.type === "phase") {
    const phase = phaseById.get(selection.id);
    if (!phase) return null;
    const Icon = getPhaseIcon(phase.id);
    const activeFunctions = getFunctionsForPhase(phase.id);
    const picks = getTopPicksForPhase(phase.id);

    return (
      <div className="rounded-md border border-signal/40 bg-card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-sm bg-secondary text-signal">
              {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-data text-[0.65rem] text-muted-foreground uppercase">
                Lifecycle stage {phase.order}/7
              </p>
              <h3 className="font-display text-lg font-semibold">
                {phase.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            aria-label="Clear selection"
          >
            <X className="size-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {phase.description}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <SectionLabel>Functions active in this stage</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {activeFunctions.map((fn) => (
                <Chip
                  key={fn.id}
                  onClick={() => onSelect({ type: "function", id: fn.id })}
                >
                  {fn.name}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel amber>
              <Star className="size-3 fill-current" aria-hidden="true" />
              Top-pick tools for this stage
            </SectionLabel>
            {picks.length === 0 ? (
              <p className="text-xs text-muted-foreground">None yet.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {picks.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={`/tools/${tool.id}`}
                      className="flex items-center justify-between rounded-sm border border-line px-2.5 py-1.5 text-sm hover:border-signal hover:text-signal"
                    >
                      {tool.name}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Link
          href={`/?ph=${phase.id}`}
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          Browse every tool for this stage in the full registry{" "}
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const fn = functionById.get(selection.id);
  if (!fn) return null;
  const Icon = getFunctionIcon(fn.icon);
  const connections = getConnectionsForFunction(fn.id);
  const activePhases = getPhasesForFunction(fn.id);
  const picks = getTopPicksForFunction(fn.id);

  return (
    <div className="rounded-md border border-amber/40 bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-sm bg-secondary text-foreground">
            {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-data text-[0.65rem] text-muted-foreground uppercase">
              Business function
            </p>
            <h3 className="font-display text-lg font-semibold">{fn.name}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-label="Clear selection"
        >
          <X className="size-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        {fn.description}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>Subtypes</SectionLabel>
            <ul className="flex flex-col gap-1 text-sm">
              {fn.subtypes.map((s) => (
                <li key={s} className="flex items-start gap-1.5">
                  <span
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-signal"
                    aria-hidden="true"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Active in these stages</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {activePhases.map((p) => (
                <Chip
                  key={p.id}
                  onClick={() => onSelect({ type: "phase", id: p.id })}
                >
                  {p.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Connected functions</SectionLabel>
          {connections.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No modeled connections yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {connections.map((c) => (
                <li key={`${c.direction}-${c.functionId}`}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelect({ type: "function", id: c.functionId })
                    }
                    className="flex w-full items-start gap-2 rounded-sm border border-line px-2.5 py-1.5 text-left text-xs hover:border-signal"
                  >
                    {c.direction === "outgoing" ? (
                      <ArrowRight
                        className="mt-0.5 size-3 shrink-0 text-signal"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowLeft
                        className="mt-0.5 size-3 shrink-0 text-amber"
                        aria-hidden="true"
                      />
                    )}
                    <span>
                      <span className="font-medium">
                        {functionById.get(c.functionId)?.name ?? c.functionId}
                      </span>
                      <span className="block text-muted-foreground">
                        {c.relationship}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <SectionLabel amber>
            <Star className="size-3 fill-current" aria-hidden="true" />
            Top-pick tools
          </SectionLabel>
          {picks.length === 0 ? (
            <p className="text-xs text-muted-foreground">None yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {picks.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="flex items-center justify-between rounded-sm border border-line px-2.5 py-1.5 text-sm hover:border-signal hover:text-signal"
                  >
                    {tool.name}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Link
        href={`/functions/${fn.id}`}
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        Full function page (all tools + adoption roadmap){" "}
        <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
