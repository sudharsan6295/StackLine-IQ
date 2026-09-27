import Link from "next/link";
import { ArrowRight, ArrowDown, Plug, Star, Wrench, X } from "lucide-react";
import { getWorkflowIcon } from "@/lib/workflow-icons";
import { getFunctionIcon } from "@/lib/function-icons";
import { functionById, toolById } from "@/lib/data";

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
];

interface WorkflowDrilldownProps {
  functionId: string;
  onClose: () => void;
}

/**
 * The "Function Drill-Down" panel: a richer, color-coded internal workflow
 * for one business function (its own multi-stage AI-augmented process),
 * distinct from the compact subtypes list in DetailPanel. Renders inline,
 * full width, below the canvas when a function node is selected.
 */
export function WorkflowDrilldown({ functionId, onClose }: WorkflowDrilldownProps) {
  const fn = functionById.get(functionId);
  if (!fn) return null;
  const FnIcon = getFunctionIcon(fn.icon);
  const stageCount = fn.workflow.length;

  return (
    <div className="animate-in fade-in slide-in-from-top-2 mt-4 rounded-xl border border-line bg-card p-4 duration-300 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="gradient-bg flex size-8 items-center justify-center rounded-lg text-white">
            {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
            <FnIcon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-data text-[0.65rem] text-muted-foreground uppercase">
              Function drill-down
            </p>
            <h3 className="font-display text-base font-semibold sm:text-lg">
              AI in {fn.name} — Detailed Architecture
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detailed architecture"
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 hidden items-center justify-center gap-2 sm:flex" aria-hidden="true">
        {fn.workflow.map((stage, i) => {
          const StageIcon = getWorkflowIcon(stage.icon);
          const theme = STAGE_THEMES[i % STAGE_THEMES.length];
          return (
            <div key={stage.name} className="flex items-center gap-2">
              <span
                className={`flex size-9 items-center justify-center rounded-full text-white shadow-sm ${theme.header}`}
              >
                {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
                <StageIcon className="size-4" aria-hidden="true" />
              </span>
              {i < stageCount - 1 && (
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-stretch">
        {fn.workflow.map((stage, i) => {
          const theme = STAGE_THEMES[i % STAGE_THEMES.length];
          const StageIcon = getWorkflowIcon(stage.icon);
          const stageTools = (stage.toolIds ?? [])
            .map((id) => toolById.get(id))
            .filter((t) => !!t);
          return (
            <div
              key={stage.name}
              className="flex flex-1 flex-col sm:flex-row sm:items-stretch"
            >
              <div
                className={`flex flex-1 flex-col overflow-hidden rounded-xl border ${theme.ring}`}
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white ${theme.header}`}
                >
                  {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
                  <StageIcon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{stage.name}</span>
                </div>
                <ul className="flex flex-col gap-1.5 p-2.5">
                  {stage.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-lg border px-2 py-1.5 text-[0.7rem] leading-snug font-medium ${theme.chip}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {stageTools.length > 0 ? (
                  <div className="mt-auto flex flex-col gap-1 border-t border-line/60 p-2.5 pt-2">
                    <span className="flex items-center gap-1 font-data text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                      <Wrench className="size-2.5" aria-hidden="true" />
                      Tools for this stage
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stageTools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.id}`}
                          className={
                            tool.topPick
                              ? "gradient-bg flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-white"
                              : "flex items-center gap-1 rounded-full border border-line bg-card px-2 py-0.5 text-[0.65rem] font-medium hover:border-signal hover:text-signal"
                          }
                        >
                          {tool.topPick && (
                            <Star className="size-2.5 fill-current" aria-hidden="true" />
                          )}
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  stage.noToolSuggestion && (
                    <div className="mt-auto flex flex-col gap-1 border-t border-line/60 p-2.5 pt-2">
                      <span className="flex items-center gap-1 font-data text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                        <Plug className="size-2.5" aria-hidden="true" />
                        Suggested approach
                      </span>
                      <p className="text-[0.68rem] leading-snug text-muted-foreground">
                        {stage.noToolSuggestion}
                      </p>
                    </div>
                  )
                )}
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
    </div>
  );
}
