import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  functions,
  getConnectionsForFunction,
  getTopPicksForFunction,
  getPhasesForFunction,
  functionById,
} from "@/lib/data";
import { getFunctionIcon } from "@/lib/function-icons";

/**
 * A fully static, crawlable, keyboard/screen-reader-friendly listing of the
 * same information the interactive canvas shows — every function, its
 * subtypes, its connections to other functions, and its top-pick tools.
 * The canvas is the fast, visual way to explore this; this list is the
 * reliable one that works without JS, a mouse, or a big screen.
 */
export function FunctionDirectory() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {functions.map((fn) => {
        const Icon = getFunctionIcon(fn.icon);
        const connections = getConnectionsForFunction(fn.id);
        const picks = getTopPicksForFunction(fn.id);
        const activePhases = getPhasesForFunction(fn.id);

        return (
          <article
            key={fn.id}
            id={`function-${fn.id}`}
            className="flex flex-col gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="gradient-bg flex size-8 items-center justify-center rounded-lg text-white">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-sm font-semibold">{fn.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{fn.description}</p>

            <div>
              <h4 className="font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                Sub-functions &amp; how AI shows up
              </h4>
              <ul className="mt-1 flex flex-col gap-1.5">
                {fn.subtypes.map((s) => (
                  <li key={s.name} className="text-[0.7rem]" title={s.aiUseCase}>
                    <span className="font-medium">{s.name}</span>
                    <span className="block text-muted-foreground">{s.aiUseCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                Active stages
              </h4>
              <ul className="mt-1 flex flex-wrap gap-1">
                {activePhases.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-full border border-dashed border-line px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>

            {connections.length > 0 && (
              <div>
                <h4 className="font-data text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                  Connects to
                </h4>
                <ul className="mt-1 flex flex-col gap-1">
                  {connections.map((c) => (
                    <li
                      key={`${c.direction}-${c.functionId}`}
                      className="text-[0.7rem] text-muted-foreground"
                    >
                      <Link
                        href={`/functions/${c.functionId}`}
                        className="font-medium text-foreground hover:text-signal"
                      >
                        {functionById.get(c.functionId)?.name ?? c.functionId}
                      </Link>
                      {" — "}
                      {c.relationship}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {picks.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
                {picks.slice(0, 3).map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="rounded-full border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber hover:border-amber"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`/functions/${fn.id}`}
              className="inline-flex items-center gap-1 text-xs text-signal hover:underline"
            >
              Full function page{" "}
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
