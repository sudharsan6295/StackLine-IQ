import type { Metadata } from "next";
import { ExternalLink, Waypoints, ShieldCheck, Compass } from "lucide-react";
import { stats } from "@/lib/data";
import { STALE_PRICING_DAYS } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why StacklineIQ exists, how it's sourced and kept honest, and who built it.",
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Sourced, not guessed",
    body: "Every price, free-tier limit, and pricing-source link is checked against the vendor's own page. Where a vendor won't publish real numbers, that's stated outright — never smoothed over with a plausible-sounding figure.",
  },
  {
    icon: Compass,
    title: "One tool called out per category",
    body: `A "Top pick" only appears where one tool clearly leads its category — most categories don't get one, on purpose, rather than forcing a false consensus.`,
  },
  {
    icon: Waypoints,
    title: "Built to stay current",
    body: `Every tool carries the date its pricing was last verified, and a visible flag once that's over ${STALE_PRICING_DAYS} days old — so staleness is something you can see, not something you have to take on faith.`,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        About
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Why <span className="gradient-text">StacklineIQ</span> exists
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Picking an AI tool for a business function usually means ten browser
        tabs, a vendor pricing page that hasn&apos;t been updated since the
        model it&apos;s selling was announced, and no easy way to compare
        what you found against the next function over. StacklineIQ is a
        single, sourced registry — {stats.functionCount} business functions,{" "}
        {stats.toolCount} tools, mapped across the product lifecycle — built
        to answer one question directly: which AI tool should this team
        actually run, and what does it really cost.
      </p>

      <div className="mt-10 flex flex-col gap-5">
        {principles.map((p, i) => (
          <div
            key={p.title}
            className="flex gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white ${
                ["bg-violet-600", "bg-fuchsia-600", "bg-sky-600"][i % 3]
              }`}
            >
              <p.icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-sm font-semibold">
                {p.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold">Built by</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          StacklineIQ is built and maintained by Sudharsan Balaji. More
          writing and other projects live on his personal site.
        </p>
        <a
          href="https://sudharsanbalaji.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:underline"
        >
          sudharsanbalaji.com
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
