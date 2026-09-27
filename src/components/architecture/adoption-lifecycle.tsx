import Link from "next/link";
import {
  Target,
  Search,
  FlaskConical,
  Filter,
  Rocket,
  Activity,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

const STAGE_THEMES = [
  {
    header: "bg-emerald-600",
    ring: "border-emerald-600/30",
    chip: "bg-emerald-50 text-emerald-800 border-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-200",
  },
  {
    header: "bg-sky-600",
    ring: "border-sky-600/30",
    chip: "bg-sky-50 text-sky-800 border-sky-600/20 dark:bg-sky-950/40 dark:text-sky-200",
  },
  {
    header: "bg-violet-600",
    ring: "border-violet-600/30",
    chip: "bg-violet-50 text-violet-800 border-violet-600/20 dark:bg-violet-950/40 dark:text-violet-200",
  },
  {
    header: "bg-orange-600",
    ring: "border-orange-600/30",
    chip: "bg-orange-50 text-orange-800 border-orange-600/20 dark:bg-orange-950/40 dark:text-orange-200",
  },
  {
    header: "bg-rose-600",
    ring: "border-rose-600/30",
    chip: "bg-rose-50 text-rose-800 border-rose-600/20 dark:bg-rose-950/40 dark:text-rose-200",
  },
  {
    header: "bg-cyan-600",
    ring: "border-cyan-600/30",
    chip: "bg-cyan-50 text-cyan-800 border-cyan-600/20 dark:bg-cyan-950/40 dark:text-cyan-200",
  },
];

interface Stage {
  name: string;
  icon: LucideIcon;
  description: string;
  href?: string;
  linkLabel?: string;
}

const stages: Stage[] = [
  {
    name: "Identify",
    icon: Target,
    description:
      "Spot a repetitive, high-value task in a function and name the metric it should move before picking a tool.",
  },
  {
    name: "Select",
    icon: Search,
    description:
      "Compare real, sourced options for that function — pricing, free tier, and enterprise-readiness side by side.",
    href: "/",
    linkLabel: "Compare in the Registry",
  },
  {
    name: "Pilot",
    icon: FlaskConical,
    description:
      "Run one team through the tool with a human-review gate on every output before any wider rollout.",
    href: "/stack-builder",
    linkLabel: "Plan a pilot",
  },
  {
    name: "Guardrail & Eval",
    icon: Filter,
    description:
      "Build an evaluation (eval) set from your own tasks and put filters, allow-lists, and spend caps in place before scaling.",
    href: "/governance",
    linkLabel: "See guardrails & evaluation",
  },
  {
    name: "Deploy & Scale",
    icon: Rocket,
    description:
      "Roll out to the full function once the pilot clears its success bar, and estimate the real monthly cost.",
    href: "/stack-builder",
    linkLabel: "Build the stack",
  },
  {
    name: "Monitor",
    icon: Activity,
    description:
      "Log outputs, watch for drift, and alert on anomalies — what you learn here feeds back into Identify and Evals.",
    href: "/governance",
    linkLabel: "See what to monitor",
  },
];

/**
 * The tool-adoption lifecycle: a separate concept from the canvas above.
 * The canvas maps which tool fits which business function and lifecycle
 * stage; this maps the process for actually rolling out any one of them,
 * end to end, tying together the Registry, Stack Builder, and Governance
 * pages into one sequence.
 */
export function AdoptionLifecycle() {
  const stageCount = stages.length;

  return (
    <div className="rounded-xl border border-line bg-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {stages.map((stage, i) => {
          const theme = STAGE_THEMES[i % STAGE_THEMES.length];
          const Icon = stage.icon;
          return (
            <div key={stage.name} className="flex flex-1 flex-col sm:flex-row sm:items-stretch">
              <div className={`flex flex-1 flex-col overflow-hidden rounded-xl border ${theme.ring}`}>
                <div
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white ${theme.header}`}
                >
                  {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{stage.name}</span>
                </div>
                <div className={`flex flex-1 flex-col gap-2 p-2.5 ${theme.chip}`}>
                  <p className="text-[0.7rem] leading-snug font-medium">
                    {stage.description}
                  </p>
                  {stage.href && (
                    <Link
                      href={stage.href}
                      className="mt-auto inline-flex items-center gap-1 text-[0.65rem] font-semibold underline decoration-current/40 underline-offset-2 hover:decoration-current"
                    >
                      {stage.linkLabel}
                      <ArrowRight className="size-2.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>

              {i < stageCount - 1 && (
                <>
                  <div className="hidden shrink-0 items-center justify-center px-1.5 sm:flex">
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex shrink-0 items-center justify-center py-1.5 sm:hidden">
                    <ArrowDown className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <RotateCcw className="size-3.5 shrink-0" aria-hidden="true" />
        Monitor feeds straight back into Identify and Evals — this is a loop, not a one-time rollout.
      </div>
    </div>
  );
}
