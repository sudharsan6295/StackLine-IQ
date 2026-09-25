import { ArchitectureCanvas } from "@/components/architecture/architecture-canvas";
import { ArchitectureLegend } from "@/components/architecture/legend";
import { FunctionDirectory } from "@/components/architecture/function-directory";
import { stats } from "@/lib/data";

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Interactive architecture
      </p>
      <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
        How the whole AI-augmented lifecycle fits together
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Every one of the {stats.functionCount} business functions, mapped onto
        the 7 stages of shipping a product, with the connections between
        functions made explicit. Click any node to see its subtypes, which
        stages it&apos;s active in, what it connects to, and its top-pick tools.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <ArchitectureLegend />
        <ArchitectureCanvas />
      </div>

      <section className="mt-16" aria-labelledby="directory-heading">
        <h2
          id="directory-heading"
          className="font-display text-xl font-bold tracking-tight"
        >
          Every function, in detail
        </h2>
        <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
          The same information as the diagram above, as a plain list — for
          screen readers, small screens, or whenever a list is just faster than
          clicking around a canvas.
        </p>
        <FunctionDirectory />
      </section>
    </div>
  );
}
