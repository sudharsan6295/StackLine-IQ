import { tools } from "@/lib/data";
import type { Tool } from "@/lib/schema";

/**
 * Top-pick tools for a phase, in a stable order (file order, which is
 * grouped by function) so the same phase always renders the same chips
 * rather than shuffling between builds.
 */
export function getTopPicksForPhase(phaseId: string): Tool[] {
  return tools.filter((t) => t.topPick && t.phases.includes(phaseId));
}
