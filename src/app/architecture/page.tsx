import { ChevronDown } from "lucide-react";
import { ArchitectureCanvas } from "@/components/architecture/architecture-canvas";
import { ArchitectureLegend } from "@/components/architecture/legend";
import { FunctionDirectory } from "@/components/architecture/function-directory";
import { AdoptionLifecycle } from "@/components/architecture/adoption-lifecycle";
import { stats } from "@/lib/data";

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">Explore</p>
      <h1 className="mt-1.5 max-w-3xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        How the whole AI-augmented lifecycle <span className="gradient-text">connects</span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {stats.functionCount} business functions mapped onto the 7 stages of shipping a product. Click any node for
        its subtypes, connections, and top-pick tools.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <ArchitectureLegend />
        <ArchitectureCanvas />
      </div>

      <section className="mt-16" aria-labelledby="adoption-heading">
        <h2 id="adoption-heading" className="font-display text-xl font-extrabold tracking-tight">
          The AI adoption lifecycle
        </h2>
        <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
          The map above shows which tool fits which function and stage. This is the
          separate question of how to actually roll one out — from identifying the
          use case through selecting, piloting, and guardrailing a tool with a real
          evaluation set, all the way to monitoring it once it&apos;s live.
        </p>
        <AdoptionLifecycle />
      </section>

      <details className="group mt-16">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            Every team, every tool
          </h2>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
          The same information as the diagram above, as a plain list — for screen readers, small screens, or
          whenever a list is just faster than clicking around a canvas.
        </p>
        <FunctionDirectory />
      </details>
    </div>
  );
}
