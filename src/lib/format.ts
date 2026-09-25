import type { Tool } from "@/lib/schema";

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
  return `$${tool.paidTier.startingPrice}${unitLabel[unit] ?? ""}`;
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
