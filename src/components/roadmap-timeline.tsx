"use client";

import { CheckCircle2, ShieldCheck, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { RoadmapStage } from "@/lib/roadmap";

export function RoadmapTimeline({ stages }: { stages: RoadmapStage[] }) {
  return (
    <Tabs defaultValue={stages[0]?.id} className="w-full">
      <TabsList className="h-auto w-full justify-start gap-1 rounded-full bg-secondary/50 p-1">
        {stages.map((stage, i) => (
          <TabsTrigger
            key={stage.id}
            value={stage.id}
            className="flex-1 gap-1.5 rounded-full data-[state=active]:gradient-bg data-[state=active]:text-white"
          >
            <span className="font-data text-[0.65rem] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            {stage.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {stages.map((stage) => (
        <TabsContent
          key={stage.id}
          value={stage.id}
          className="mt-4 rounded-xl border border-line bg-card p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">{stage.name}</h3>
            <span className="rounded-xs border border-line px-2 py-0.5 font-data text-xs text-muted-foreground">
              {stage.timeframe}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{stage.goal}</p>

          <ul className="mt-4 flex flex-col gap-2">
            {stage.actions.map((action) => (
              <li key={action} className="flex items-start gap-2 text-sm">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-signal"
                  aria-hidden="true"
                />
                {action}
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-line pt-4 sm:grid-cols-2">
            <div className="flex gap-2 rounded-lg border border-line bg-secondary/40 p-3 text-xs">
              <ShieldCheck
                className="size-4 shrink-0 text-amber"
                aria-hidden="true"
              />
              <div>
                <div className="font-medium text-foreground">
                  Human-review gate
                </div>
                <p className="mt-0.5 text-muted-foreground">
                  {stage.humanReviewGate}
                </p>
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-line bg-secondary/40 p-3 text-xs">
              <Target
                className="size-4 shrink-0 text-signal"
                aria-hidden="true"
              />
              <div>
                <div className="font-medium text-foreground">
                  Success metric
                </div>
                <p className="mt-0.5 text-muted-foreground">
                  {stage.successMetric}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
