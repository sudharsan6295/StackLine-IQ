import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { RegistryExplorer } from "@/components/registry-explorer";
import { LifecycleMap } from "@/components/architecture/lifecycle-map";
import { CompareBar } from "@/components/compare-bar";
import { LiveStat } from "@/components/live-stat";
import { stats } from "@/lib/data";

export default function Home() {
  return (
    <div className="pb-24">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
            The enterprise AI registry
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
            Know exactly which AI tool to run for every job, in every function.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            One registry, mapped across the full product lifecycle — from
            ideation to support — with sourced pricing, free-tier limits, and a
            &ldquo;Top pick&rdquo; called out where one tool clearly leads its
            category.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#registry-filters"
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse the registry{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <Link
              href="/stack-builder"
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-line px-4 text-sm font-medium hover:bg-secondary"
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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
            Architecture at a glance
          </p>
          <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
            How the whole AI-augmented lifecycle fits together
          </h2>
          <p className="mt-2 mb-6 max-w-2xl text-sm text-muted-foreground">
            Business functions above feed and are fed by the 7-stage build
            pipeline; technical functions below build and run it. Click any
            stage or function to see its subtypes, connections, and top-pick
            tools.
          </p>
          <LifecycleMap />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
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
