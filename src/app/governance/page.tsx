import type { Metadata } from "next";
import { ShieldCheck, Lock, UserCheck, PiggyBank } from "lucide-react";

export const metadata: Metadata = {
  title: "Governance & safety",
  description:
    "How to adopt AI tools responsibly: data privacy, access control, human approval, and cost control.",
};

const pillars = [
  {
    icon: Lock,
    title: "Data privacy",
    summary: "Know what leaves your walls before you turn a tool on.",
    points: [
      "Confirm whether a vendor trains on your data by default, and turn that off where it's optional — several vendors in this registry (e.g. Business/Enterprise tiers) default to training opt-out; free and Pro tiers often don't.",
      'Route customer, financial, and legal data only through tools whose contract explicitly covers that data class — a generic "AI assistant" plan is rarely enough on its own.',
      "Prefer vendors offering zero data retention or configurable retention windows for regulated data.",
    ],
  },
  {
    icon: UserCheck,
    title: "Access control",
    summary: "Give people the tool, not the keys to everything it can touch.",
    points: [
      "Provision AI tool access through the same SSO/SCIM your org already uses — most enterprise-ready tools in this registry support SAML SSO on their top tier.",
      "Scope agentic tools (coding agents, support agents, contract-drafting agents) to the specific systems they need, not broad standing credentials.",
      "Review and revoke access on offboarding with the same urgency as any other SaaS credential — AI tools are often missed in offboarding checklists.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Human approval",
    summary:
      "Some decisions stay human, permanently — not just during a pilot.",
    points: [
      "Anything customer-facing (a support reply, a marketing send, a sales email) gets human review before it goes out, until measured accuracy earns a narrower exception.",
      "Anything financial (an invoice approval, a forecast submitted upward, a contract term) requires named human sign-off — AI can draft it, but a person owns the decision.",
      "Keep an audit trail of what was AI-generated vs. human-authored, especially for regulated functions like Finance and Legal.",
    ],
  },
  {
    icon: PiggyBank,
    title: "Cost control",
    summary:
      "AI tool spend sprawls fast — treat it like the recurring cost it is.",
    points: [
      "Track spend per seat, not just per tool — unused seats on usage-based AI tools (billed per resolution, per credit, per conversation) are easy to miss.",
      "Re-check pricing on a schedule — this registry flags any tool whose pricing was last verified more than 120 days ago; do the same for your own procurement record.",
      "Consolidate before renewing: the Stack Builder's Optimize stage exists specifically to catch overlapping tools before an auto-renewal locks them in.",
    ],
  },
];

export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Governance
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Adopt AI tools safely
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The registry tells you which tool to pick. This page is the four things
        worth checking before you turn it on for a whole function.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <section
            key={pillar.title}
            className="rounded-md border border-line bg-card p-5"
          >
            <div className="flex items-center gap-2">
              <pillar.icon className="size-5 text-signal" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold">
                {pillar.title}
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {pillar.summary}
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {pillar.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-signal"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
