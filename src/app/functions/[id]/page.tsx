import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { functions, getToolsForFunction, phases } from "@/lib/data";
import { buildRoadmap } from "@/lib/roadmap";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { FunctionToolGrid } from "@/components/function-tool-grid";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return functions.map((fn) => ({ id: fn.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/functions/[id]">): Promise<Metadata> {
  const { id } = await params;
  const fn = functions.find((f) => f.id === id);
  if (!fn) return {};
  const toolCount = getToolsForFunction(fn.id).length;
  const title = `Best AI tools for ${fn.name}`;
  const description = `${fn.description} ${toolCount} AI tools tracked with sourced pricing and free-tier details.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/functions/${fn.id}`,
    },
  };
}

export default async function FunctionPage({
  params,
}: PageProps<"/functions/[id]">) {
  const { id } = await params;
  const fn = functions.find((f) => f.id === id);
  if (!fn) notFound();

  const tools = getToolsForFunction(fn.id);
  const topPick = tools.find((t) => t.topPick) ?? tools[0];
  const roadmap = buildRoadmap(fn, topPick);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best AI tools for ${fn.name}`,
    description: fn.description,
    url: `${siteConfig.url}/functions/${fn.id}`,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← All functions
      </Link>
      <p className="mt-4 font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Business function
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {fn.name}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        {fn.description}
      </p>

      <section aria-labelledby="tools-heading" className="mt-10">
        <h2 id="tools-heading" className="font-display text-lg font-semibold">
          {tools.length} tool{tools.length === 1 ? "" : "s"} for{" "}
          {fn.name.toLowerCase()}
        </h2>
        <FunctionToolGrid tools={tools} phases={phases} />
      </section>

      <section aria-labelledby="roadmap-heading" className="mt-12">
        <h2 id="roadmap-heading" className="font-display text-lg font-semibold">
          Adoption roadmap
        </h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          A practical Pilot → Scale → Optimize path for rolling AI out across{" "}
          {fn.name.toLowerCase()}.
        </p>
        <RoadmapTimeline stages={roadmap} />
      </section>
    </div>
  );
}
