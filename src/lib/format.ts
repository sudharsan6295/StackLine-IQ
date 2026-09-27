import type { Tool } from "@/lib/schema";

export const STALE_PRICING_DAYS = 120;

/**
 * True once a tool's pricing hasn't been re-checked in over
 * STALE_PRICING_DAYS days — the flag the Governance page's cost-control
 * pillar promises ("this registry flags any tool whose pricing was last
 * verified more than 120 days ago"). Kept here, next to the other
 * lastChecked-adjacent formatting, so the threshold has exactly one home.
 */
export function daysSinceChecked(lastChecked: string): number {
  const checked = new Date(`${lastChecked}T00:00:00Z`).getTime();
  const now = Date.now();
  return Math.floor((now - checked) / (1000 * 60 * 60 * 24));
}

export function isPricingStale(tool: Tool): boolean {
  return daysSinceChecked(tool.lastChecked) > STALE_PRICING_DAYS;
}

/**
 * `startingPrice` is always the floor of a tool's paid tiers, not its only
 * price — most tools have a higher tier above it (see `paidTier.notes`). So
 * the formatted string always says "Starts at", never a bare "$X", to avoid
 * implying that's the tool's one flat price.
 */
export function formatPrice(tool: Tool): string {
  if (tool.paidTier.isCustomPricing) return "Custom pricing";
  if (tool.paidTier.startingPrice === undefined) return "Contact sales";
  const unit = tool.paidTier.billingUnit ?? "per month";
  const unitLabel: Record<string, string> = {
    "per month": "/mo",
    "per user / month": "/user/mo",
    "per year": "/yr",
    "one-time": " one-time",
    "usage-based": " usage-based",
    custom: "",
  };
  return `Starts at $${tool.paidTier.startingPrice}${unitLabel[unit] ?? ""}`;
}

/** A shorter form of {@link formatPrice} for tight spaces (card price line) —
 * same "starts at" semantics via a "+" suffix instead of the full phrase. */
export function formatPriceCompact(tool: Tool): string {
  if (tool.paidTier.isCustomPricing) return "Custom";
  if (tool.paidTier.startingPrice === undefined) return "Contact sales";
  const unit = tool.paidTier.billingUnit ?? "per month";
  const unitLabel: Record<string, string> = {
    "per month": "/mo",
    "per user / month": "/user/mo",
    "per year": "/yr",
    "one-time": " one-time",
    "usage-based": " usage-based",
    custom: "",
  };
  return `From $${tool.paidTier.startingPrice}${unitLabel[unit] ?? ""}`;
}

export function formatFreeTier(tool: Tool): string {
  if (!tool.freeTier.available) return "No free tier";
  return tool.freeTier.limits ?? "Free tier available";
}

export const badgeToneClass: Record<Tool["badge"], string> = {
  Free: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Freemium: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  Paid: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
};
