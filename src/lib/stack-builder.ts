import type { Tool } from "@/lib/schema";
import { getToolsForFunction } from "@/lib/data";

export type BudgetLevel = "free-only" | "low" | "enterprise";

export interface StackRecommendation {
  functionId: string;
  tool: Tool | null;
  monthlyLow: number;
  monthlyHigh: number;
  note: string;
}

function pickForBudget(tools: Tool[], budget: BudgetLevel): Tool | null {
  if (tools.length === 0) return null;

  if (budget === "free-only") {
    const free = tools.filter((t) => t.freeTier.available);
    if (free.length === 0) return null;
    return free.find((t) => t.topPick) ?? free[0];
  }

  if (budget === "enterprise") {
    const enterprise = tools.filter((t) => t.enterpriseReady);
    const pool = enterprise.length > 0 ? enterprise : tools;
    return pool.find((t) => t.topPick) ?? pool[0];
  }

  // "low": cheapest tool with a published (non-custom) starting price; prefer a free tier if it covers real usage.
  const priced = tools.filter(
    (t) =>
      !t.paidTier.isCustomPricing && t.paidTier.startingPrice !== undefined,
  );
  if (priced.length === 0) return tools.find((t) => t.topPick) ?? tools[0];
  return [...priced].sort(
    (a, b) => (a.paidTier.startingPrice ?? 0) - (b.paidTier.startingPrice ?? 0),
  )[0];
}

function costRangeFor(
  tool: Tool,
  teamSize: number,
  budget: BudgetLevel,
): { low: number; high: number; note: string } {
  if (budget === "free-only") {
    return { low: 0, high: 0, note: "Free tier" };
  }
  if (tool.paidTier.isCustomPricing) {
    return { low: 0, high: 0, note: "Custom pricing — request a quote" };
  }
  const price = tool.paidTier.startingPrice ?? 0;
  const isPerSeat = tool.paidTier.billingUnit === "per user / month";
  const seats = isPerSeat ? teamSize : 1;
  const monthly = price * seats;
  return {
    low: Math.round(monthly * 0.85),
    high: Math.round(monthly * 1.15),
    note: isPerSeat ? `$${price}/user/mo × ${seats}` : `$${price}/mo flat`,
  };
}

export function buildStack(
  functionIds: string[],
  teamSize: number,
  budget: BudgetLevel,
): StackRecommendation[] {
  return functionIds.map((functionId) => {
    const candidates = getToolsForFunction(functionId);
    const tool = pickForBudget(candidates, budget);
    if (!tool) {
      return {
        functionId,
        tool: null,
        monthlyLow: 0,
        monthlyHigh: 0,
        note: "No tool available at this budget level",
      };
    }
    const { low, high, note } = costRangeFor(tool, teamSize, budget);
    return { functionId, tool, monthlyLow: low, monthlyHigh: high, note };
  });
}
