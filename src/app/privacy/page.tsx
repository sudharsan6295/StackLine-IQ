import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What StacklineIQ actually collects (almost nothing), what stays local to your browser, and how the optional analytics work.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Privacy
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        What this site does <span className="gradient-text">with your data</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        The short version: there&apos;s no account, no server-side tracking,
        and nothing personal is collected. The rest of this page is the
        specific, honest breakdown of what actually happens technically —
        not boilerplate.
      </p>

      <div className="mt-8 rounded-md border border-dashed border-amber/50 bg-amber/5 p-4">
        <h2 className="font-display text-sm font-semibold text-amber">
          Do your own research — this is a reference, not advice
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every price and feature here is researched and sourced as
          carefully as possible, and each tool links to where that pricing
          came from — but vendors change pricing, plans, and features
          without notice, and mistakes happen. Nothing on this site is
          financial, legal, or professional advice, and nothing here is a
          guarantee that a listed price or feature is still accurate today.
          Treat it as a starting point for narrowing down options, and
          confirm the real, current terms directly with the vendor before
          you buy, subscribe, or sign anything.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg font-semibold">
            No accounts, no server-side data
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There&apos;s nowhere to sign up and no database of visitors. The
            site is a static registry — pages are pre-built from the tool
            data itself, not generated per-visitor. Browsing, searching, and
            filtering the registry sends nothing to a server beyond a normal
            page request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            Your shortlist and comparisons stay in your browser
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Shortlisting a tool or adding it to Compare is saved with{" "}
            <code className="rounded-xs bg-secondary px-1 py-0.5 font-data text-[0.8em]">
              localStorage
            </code>{" "}
            — it lives only on your device, isn&apos;t sent anywhere, and
            isn&apos;t visible to anyone else. Clearing your browser data
            clears it. The only exception is deliberate: if you use the
            &ldquo;Copy link&rdquo; button to share a comparison, the tool
            IDs you selected are encoded directly in that URL so the person
            you send it to can see the same list — that&apos;s the only way
            this data ever leaves your browser, and only when you choose to
            share it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            Analytics — off by default, cookieless when on
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This site can optionally use{" "}
            <a
              href="https://plausible.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:underline"
            >
              Plausible
            </a>
            , a privacy-focused analytics tool that doesn&apos;t use cookies
            and doesn&apos;t collect or store any personal data or
            cross-site identifiers — it only reports aggregate numbers like
            page views. It loads only if a specific environment variable is
            configured on the deployment; if it&apos;s not, no analytics
            script loads at all.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            External links
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            &ldquo;Visit&rdquo; and pricing-source links take you to the AI
            vendor&apos;s own website in a new tab. Once you&apos;re there,
            that vendor&apos;s privacy policy applies, not this one — this
            site has no relationship with what those sites do.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            No cookies, no ads, no data sales
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No cookies are set by this site. No advertising or tracking
            pixels are embedded. There&apos;s no data to sell, share, or
            hand to a third party, because none is collected in the first
            place — there&apos;s nothing to opt out of under GDPR, CCPA, or
            similar frameworks beyond what&apos;s described above.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If anything here is unclear, reach out via the contact details on{" "}
            <Link href="/about" className="text-signal hover:underline">
              the About page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
