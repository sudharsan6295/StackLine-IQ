"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, RotateCcw, Waypoints } from "lucide-react";
import { phases } from "@/lib/data";
import { getTopPicksForPhase } from "@/lib/lifecycle-top-picks";
import { useUrlFilters } from "@/lib/use-url-filters";
import { getPhaseIcon } from "@/lib/phase-icons";
import { cn } from "cn";

const CHIPS_PER_STAGE = 3;

export function ArchitectureDiagram() {
  const { update } = useUrlFilters();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function updateFades() {
      if (!el) return;
      setShowLeftFade(el.scrollLeft > 4);
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  function showAllForPhase(phaseId: string) {
    update({ phases: [phaseId] });
    document
      .getElementById("registry-filters")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
        >
        {phases.map((phase, i) => {
          const Icon = getPhaseIcon(phase.id);
          const picks = getTopPicksForPhase(phase.id);
          const shown = picks.slice(0, CHIPS_PER_STAGE);
          const extra = picks.length - shown.length;
          const isLast = i === phases.length - 1;

          return (
            <div
              key={phase.id}
              className="flex shrink-0 snap-start items-stretch"
            >
              <div className="flex w-[190px] flex-col gap-2.5 rounded-md border border-line bg-card p-3.5 sm:w-[210px]">
                <div className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-sm bg-secondary text-signal">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-data text-[0.65rem] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}/
                    {String(phases.length).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-sm leading-tight font-semibold">
                    {phase.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-1 border-t border-line pt-2.5">
                  <span className="flex items-center gap-1 font-data text-[0.6rem] font-medium tracking-wide text-amber uppercase">
                    <Star
                      className="size-2.5 fill-current"
                      aria-hidden="true"
                    />
                    Top picks
                  </span>
                  {shown.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      None yet
                    </span>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {shown.map((tool) => (
                        <li key={tool.id}>
                          <Link
                            href={`/tools/${tool.id}`}
                            className="block truncate rounded-xs border border-line bg-secondary/40 px-1.5 py-1 text-xs font-medium hover:border-signal hover:text-signal"
                            title={tool.name}
                          >
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {extra > 0 && (
                    <button
                      type="button"
                      onClick={() => showAllForPhase(phase.id)}
                      className="text-left text-[0.65rem] text-muted-foreground hover:text-foreground"
                    >
                      +{extra} more →
                    </button>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className="flex w-8 shrink-0 items-center justify-center sm:w-10"
                  aria-hidden="true"
                >
                  <ChevronRight className="size-4 text-muted-foreground/50" />
                </div>
              )}
            </div>
          );
        })}
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0 bottom-3 left-0 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 sm:w-12",
            showLeftFade ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0 right-0 bottom-3 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 sm:w-12",
            showRightFade ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-sm border border-dashed border-line px-3 py-2 text-xs text-muted-foreground">
          <RotateCcw
            className="size-3.5 shrink-0 text-signal"
            aria-hidden="true"
          />
          Learnings from {phases[phases.length - 1]?.name} feed back into{" "}
          {phases[0]?.name} — the loop starts again for the next release.
        </div>
        <Link
          href="/architecture"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-line px-3 py-2 text-xs font-medium hover:border-signal hover:text-signal"
        >
          <Waypoints className="size-3.5" aria-hidden="true" />
          Explore the full interactive architecture
        </Link>
      </div>
    </div>
  );
}
