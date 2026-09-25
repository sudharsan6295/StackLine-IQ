import type { BusinessFunction, Tool } from "@/lib/schema";

export interface RoadmapStage {
  id: "pilot" | "scale" | "optimize";
  name: string;
  timeframe: string;
  goal: string;
  actions: string[];
  humanReviewGate: string;
  successMetric: string;
}

export function buildRoadmap(
  fn: BusinessFunction,
  topPick: Tool | undefined,
): RoadmapStage[] {
  const toolName = topPick?.name ?? "the top-pick tool";

  return [
    {
      id: "pilot",
      name: "Pilot",
      timeframe: "Weeks 1–4",
      goal: `Prove AI adds value in ${fn.name.toLowerCase()} with one team, before any wider rollout.`,
      actions: [
        `Select a single team or workflow and stand up ${toolName} for that team only.`,
        "Baseline current cycle time, cost, and quality for the workflow being changed.",
        "Write a one-page usage policy: what the tool may touch, and what stays human-only.",
      ],
      humanReviewGate:
        "Every AI-generated output is reviewed by a human before it ships or is acted on — no exceptions during the pilot.",
      successMetric:
        "Pilot team reports a measurable time or quality improvement, with zero unreviewed AI output reaching a customer, filing, or financial system.",
    },
    {
      id: "scale",
      name: "Scale",
      timeframe: "Months 2–4",
      goal: `Roll the proven workflow out across all of ${fn.name}, and connect it to the systems the team already uses.`,
      actions: [
        "Expand access from the pilot team to the full function, with role-based access control.",
        "Integrate the tool with existing systems of record (CRM, ticketing, code host, or equivalent) rather than running it as a silo.",
        "Add a second tool from the registry to cover an adjacent lifecycle phase, if the pilot tool doesn't already span it.",
      ],
      humanReviewGate:
        "Human review shifts from 100% to risk-based spot checks — full review stays mandatory for anything customer-facing or financial.",
      successMetric:
        "Adoption across the majority of the function, with cost-per-outcome trending down and no increase in reviewed-and-rejected AI output.",
    },
    {
      id: "optimize",
      name: "Optimize",
      timeframe: "Ongoing",
      goal: "Consolidate spend, retire redundant tools, and negotiate enterprise terms once usage patterns are clear.",
      actions: [
        "Review actual usage against license seats; right-size or renegotiate before auto-renewal.",
        "Retire any tool from the pilot/scale phases that a consolidated tool now covers.",
        "Feed adoption learnings back into procurement guidance for the next function to onboard.",
      ],
      humanReviewGate:
        "Human approval remains permanently required for customer-facing communication and any financial commitment, regardless of tool confidence scores.",
      successMetric:
        "Total cost of ownership per seat is falling year over year, and the governance policy is reused, not rewritten, for the next function.",
    },
  ];
}
