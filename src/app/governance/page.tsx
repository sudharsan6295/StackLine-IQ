import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  PiggyBank,
  ShieldAlert,
  FlaskConical,
  Filter,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Governance",
  description:
    "How to adopt AI tools responsibly: data privacy, access control, human approval, and cost control before rollout — plus threats, evals, guardrails, and monitoring once a tool is running.",
};

const adoptionPillars = [
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

const operatingPillars = [
  {
    icon: ShieldAlert,
    title: "Threats",
    summary:
      "The failure modes are different from normal software — plan for them specifically.",
    points: [
      "Prompt injection and data exfiltration: a support or coding agent that reads untrusted content (a web page, an email, a ticket) can be steered into leaking secrets or taking unintended actions — treat any agent with browsing or file access as operating in an adversarial environment.",
      "Shadow AI: employees adopting consumer AI tools outside procurement is the most common real-world data-leak path — a sanctioned, easy-to-use alternative in this registry beats a policy nobody reads.",
      "Supply-chain risk: a vendor's underlying model, fine-tune, or retrieval source can change without your sign-off — pin versions where the vendor allows it, and re-test after any vendor-announced model upgrade.",
    ],
  },
  {
    icon: FlaskConical,
    title: "Evals",
    summary:
      "Evaluation (evals) is how you get evidence a tool works — don't take a vendor's benchmark as your own.",
    points: [
      "Build a small, representative evaluation set from your own real tasks and data before rollout — vendor benchmarks measure the vendor's chosen tasks, not yours.",
      "Re-run the evaluation set after every model or vendor version upgrade, not just at initial rollout — a silent model swap is the most common cause of a tool's accuracy quietly changing underneath you.",
      "For regulated functions (Legal, Finance, HR), keep a human-graded evaluation alongside any automated one — automated grading alone under-catches the failure modes that matter most in those functions.",
    ],
  },
  {
    icon: Filter,
    title: "Guardrails",
    summary: "Guardrails are what stop a bad output from becoming a bad outcome.",
    points: [
      "Filter both directions: redact PII and secrets before they reach a third-party model, and screen outputs for policy violations before they reach a customer or a downstream system.",
      "Scope agentic tools to an explicit allow-list of actions and systems — design against an agent doing something correctly that it should never have been allowed to attempt in the first place.",
      "Set a hard spend and rate cap per tool per period as a technical control, not just a budget line — usage-based AI tools can run away on a bug or a bad prompt loop in a way flat-fee software can't.",
    ],
  },
  {
    icon: Activity,
    title: "Monitoring",
    summary:
      "Governance doesn't end at rollout — it's what tells you whether it's still working.",
    points: [
      "Log prompts, outputs, and the human decision that followed (approved, edited, or rejected) for every AI-assisted action in a regulated function — this is both your audit trail and your next eval set.",
      "Watch for drift: track accuracy and approval rate per tool over time, not just at launch, so a quiet vendor-side model change shows up as a metric moving, not a customer complaint.",
      "Alert on anomalies — a spend spike, an unusual access pattern, or an agent taking actions outside its normal scope — the same way you'd alert on any other production system.",
    ],
  },
];

type Pillar = (typeof adoptionPillars)[number];

const BADGE_COLORS = [
  "bg-violet-600",
  "bg-fuchsia-600",
  "bg-sky-600",
  "bg-emerald-600",
];

function PillarGrid({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {pillars.map((pillar, i) => (
        <section
          key={pillar.title}
          className="rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex size-8 items-center justify-center rounded-lg text-white ${BADGE_COLORS[i % BADGE_COLORS.length]}`}
            >
              <pillar.icon className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-lg font-bold">{pillar.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
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
  );
}

export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-data text-xs font-semibold tracking-[0.2em] text-signal uppercase">
        Governance
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Ship AI <span className="gradient-text">without the risk</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The registry tells you which tool to pick. This page is what to check
        before you turn a tool on for a whole function — and what to keep
        watching once it&apos;s running.
      </p>

      <section className="mt-10" aria-labelledby="adoption-heading">
        <h2
          id="adoption-heading"
          className="font-display text-xl font-extrabold tracking-tight"
        >
          Pre-flight
        </h2>
        <p className="mt-1 mb-5 max-w-2xl text-sm text-muted-foreground">
          Four things to settle before a tool touches real data or a real
          workflow.
        </p>
        <PillarGrid pillars={adoptionPillars} />
      </section>

      <section className="mt-12" aria-labelledby="operating-heading">
        <h2
          id="operating-heading"
          className="font-display text-xl font-extrabold tracking-tight"
        >
          In production
        </h2>
        <p className="mt-1 mb-5 max-w-2xl text-sm text-muted-foreground">
          Adoption isn&apos;t the finish line. These are the ongoing checks
          that catch a tool drifting, being misused, or being attacked after
          it's already trusted.
        </p>
        <PillarGrid pillars={operatingPillars} />
      </section>
    </div>
  );
}
