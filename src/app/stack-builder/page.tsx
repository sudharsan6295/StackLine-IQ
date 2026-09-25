"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { functions } from "@/lib/data";
import { buildStack, type BudgetLevel } from "@/lib/stack-builder";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const budgetOptions: {
  value: BudgetLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "free-only",
    label: "Free-only",
    description: "Stick strictly to tools with a genuine free tier",
  },
  {
    value: "low",
    label: "Low budget",
    description: "Cheapest published price per function",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Best-in-category, enterprise-ready tools regardless of price",
  },
];

export default function StackBuilderPage() {
  const [selected, setSelected] = useState<string[]>(
    functions.slice(0, 5).map((f) => f.id),
  );
  const [teamSize, setTeamSize] = useState(25);
  const [budget, setBudget] = useState<BudgetLevel>("low");
  const [computed, setComputed] = useState(false);

  const recommendation = useMemo(
    () => buildStack(selected, teamSize, budget),
    [selected, teamSize, budget],
  );

  const totalLow = recommendation.reduce((sum, r) => sum + r.monthlyLow, 0);
  const totalHigh = recommendation.reduce((sum, r) => sum + r.monthlyHigh, 0);
  const hasCustom = recommendation.some(
    (r) => r.tool?.paidTier.isCustomPricing,
  );

  const chartData = recommendation
    .filter((r) => r.tool)
    .map((r) => ({
      name:
        functions.find((f) => f.id === r.functionId)?.shortName ?? r.functionId,
      low: r.monthlyLow,
      high: r.monthlyHigh,
    }));

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Enterprise stack builder
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Build your AI stack
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick which functions you&apos;re rolling AI out to, your team size, and
        a budget level. We&apos;ll recommend one tool per function from the
        registry and estimate the monthly cost.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Functions
            </h2>
            <div className="flex flex-col gap-1.5 rounded-md border border-line bg-card p-3">
              {functions.map((fn) => (
                <label
                  key={fn.id}
                  className="flex items-center gap-2 rounded-sm px-1 py-1 text-sm hover:bg-secondary/50"
                >
                  <Checkbox
                    checked={selected.includes(fn.id)}
                    onCheckedChange={() => toggle(fn.id)}
                  />
                  {fn.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Team size
            </h2>
            <input
              type="number"
              min={1}
              max={100000}
              value={teamSize}
              onChange={(e) =>
                setTeamSize(Math.max(1, Number(e.target.value) || 1))
              }
              className="h-9 w-full rounded-sm border border-line bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal"
              aria-label="Team size in seats"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Seats used for per-user pricing.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-data text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Budget level
            </h2>
            <ToggleGroup
              type="single"
              value={budget}
              onValueChange={(v) => v && setBudget(v as BudgetLevel)}
              className="flex flex-col gap-1.5"
            >
              {budgetOptions.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  className="h-auto w-full flex-col items-start gap-0.5 rounded-sm border border-line px-3 py-2 text-left data-[state=on]:border-signal data-[state=on]:bg-signal/10"
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button className="rounded-sm" onClick={() => setComputed(true)}>
            Recommend a stack
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {!computed ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-md border border-dashed border-line text-sm text-muted-foreground">
              Configure your inputs and select &ldquo;Recommend a stack&rdquo;.
            </div>
          ) : (
            <>
              <div className="rounded-md border border-line bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    Estimated monthly cost
                  </h2>
                  <span className="font-data text-2xl font-bold tabular-nums">
                    ${totalLow.toLocaleString()}–${totalHigh.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </span>
                </div>
                {hasCustom && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    One or more recommended tools use custom/unpublished pricing
                    and aren&apos;t included in this estimate — see the notes
                    below.
                  </p>
                )}
                {chartData.length > 0 && (
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ left: -20 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--line)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={{ stroke: "var(--line)" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={48}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--line)",
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                          formatter={(value) => [
                            `$${Number(value).toLocaleString()}`,
                            "Monthly",
                          ]}
                        />
                        <Bar
                          dataKey="high"
                          fill="var(--signal)"
                          radius={[3, 3, 0, 0]}
                          name="High estimate"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {recommendation.map((rec) => {
                  const fn = functions.find((f) => f.id === rec.functionId);
                  return (
                    <div
                      key={rec.functionId}
                      className="flex items-center justify-between gap-3 rounded-sm border border-line bg-card p-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{fn?.name}</div>
                        {rec.tool ? (
                          <Link
                            href={`/tools/${rec.tool.id}`}
                            className="text-xs text-signal hover:underline"
                          >
                            {rec.tool.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No match at this budget level
                          </span>
                        )}
                      </div>
                      <div className="text-right font-data text-xs text-muted-foreground">
                        {rec.note}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
