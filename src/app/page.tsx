import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";
import { RegistryExplorer } from "@/components/registry-explorer";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { CompareBar } from "@/components/compare-bar";
import { LiveStat } from "@/components/live-stat";
import { stats } from "@/lib/data";

export default function Home() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
            AI, mapped for every team
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            The right AI tool for every job.{" "}
            <span className="gradient-text">Every time.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            One stack, mapped across the full product lifecycle — from
            ideation to support — with sourced pricing, free-tier limits, and a
            &ldquo;Top pick&rdquo; called out where one tool clearly leads its
            category.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#registry-filters"
              className="gradient-bg inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              Explore the stack{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <Link
              href="/stack-builder"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold hover:bg-secondary"
            >
              <Compass className="size-4" aria-hidden="true" />
              Build your stack
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
            <LiveStat
              value={stats.functionCount}
              label="Business functions covered"
            />
            <LiveStat value={stats.toolCount} label="AI tools tracked" />
            <LiveStat
              value={stats.freeToolCount}
              label="With a genuine free tier"
            />
            <LiveStat
              value={stats.topPickCount}
              label="Category-leading top picks"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <details className="group mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
                Explore
              </p>
              <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                From idea to support — see it all connect
              </h2>
            </div>
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-2 mb-6 max-w-2xl text-sm text-muted-foreground">
            Every stage of shipping a product, start to end, with the
            category-leading tool for that stage. Select a tool for its
            pricing, or &ldquo;+more&rdquo; to see every top pick for that
            stage — or see the full interactive version on the{" "}
            <Link href="/architecture" className="text-signal hover:underline">
              Explore page
            </Link>
            .
          </p>
          <Suspense>
            <ArchitectureDiagram />
          </Suspense>
        </details>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Suspense>
          <RegistryExplorer />
        </Suspense>
      </div>

      <Suspense>
        <CompareBar />
      </Suspense>
    </div>
  );
}
