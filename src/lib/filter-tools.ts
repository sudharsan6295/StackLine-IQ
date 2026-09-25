import type { Tool } from "@/lib/schema";

export interface ToolFilters {
  q: string;
  functions: string[];
  phases: string[];
  badges: string[];
  maxPrice: number | null;
  enterpriseOnly: boolean;
}

export const defaultFilters: ToolFilters = {
  q: "",
  functions: [],
  phases: [],
  badges: [],
  maxPrice: null,
  enterpriseOnly: false,
};

function effectiveMonthlyPrice(tool: Tool): number | null {
  if (tool.freeTier.available && tool.pricingModel !== "paid") return 0;
  if (tool.paidTier.isCustomPricing) return null;
  return tool.paidTier.startingPrice ?? null;
}

export function applyFilters(
  tools: Tool[],
  filters: ToolFilters,
  matchedIds?: Set<string> | null,
): Tool[] {
  return tools.filter((tool) => {
    if (matchedIds && !matchedIds.has(tool.id)) return false;
    if (
      filters.functions.length > 0 &&
      !tool.functions.some((f) => filters.functions.includes(f))
    ) {
      return false;
    }
    if (
      filters.phases.length > 0 &&
      !tool.phases.some((p) => filters.phases.includes(p))
    ) {
      return false;
    }
    if (filters.badges.length > 0 && !filters.badges.includes(tool.badge)) {
      return false;
    }
    if (filters.enterpriseOnly && !tool.enterpriseReady) {
      return false;
    }
    if (filters.maxPrice !== null) {
      const price = effectiveMonthlyPrice(tool);
      if (price === null || price > filters.maxPrice) return false;
    }
    return true;
  });
}

export function isFiltersEmpty(filters: ToolFilters): boolean {
  return (
    filters.q.trim() === "" &&
    filters.functions.length === 0 &&
    filters.phases.length === 0 &&
    filters.badges.length === 0 &&
    filters.maxPrice === null &&
    !filters.enterpriseOnly
  );
}
