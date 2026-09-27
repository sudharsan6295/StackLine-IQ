import functionsData from "@/data/functions.json";
import phasesData from "@/data/phases.json";
import functionConnectionsData from "@/data/function-connections.json";
import {
  functionSchema,
  phaseSchema,
  toolSchema,
  functionConnectionSchema,
  type BusinessFunction,
  type LifecyclePhase,
  type Tool,
  type FunctionConnection,
} from "@/lib/schema";

// Vite/webpack can statically glob JSON at build time; Next.js supports
// require.context-free static imports via import.meta.glob-like behavior
// through a manual list, since tool files are one-per-function and known
// at build time (adding a new function requires editing functions.json +
// adding its file, so this list and that file naturally stay in sync).
import softwareDevelopment from "@/data/tools/software-development.json";
import productIdeation from "@/data/tools/product-ideation.json";
import qaTesting from "@/data/tools/qa-testing.json";
import devopsOperations from "@/data/tools/devops-operations.json";
import sales from "@/data/tools/sales.json";
import marketing from "@/data/tools/marketing.json";
import customerSupport from "@/data/tools/customer-support.json";
import executiveLeadershipAnalytics from "@/data/tools/executive-leadership-analytics.json";
import finance from "@/data/tools/finance.json";
import hrTalent from "@/data/tools/hr-talent.json";
import legalCompliance from "@/data/tools/legal-compliance.json";
import crossCompanyAiAssistants from "@/data/tools/cross-company-ai-assistants.json";
import designCreative from "@/data/tools/design-creative.json";
import itSecurity from "@/data/tools/it-security.json";

const rawToolFiles = [
  softwareDevelopment,
  productIdeation,
  qaTesting,
  devopsOperations,
  sales,
  marketing,
  customerSupport,
  executiveLeadershipAnalytics,
  finance,
  hrTalent,
  legalCompliance,
  crossCompanyAiAssistants,
  designCreative,
  itSecurity,
];

export const functions: BusinessFunction[] = functionSchema
  .array()
  .parse(functionsData);
export const phases: LifecyclePhase[] = phaseSchema
  .array()
  .parse(phasesData)
  .sort((a, b) => a.order - b.order);
export const tools: Tool[] = toolSchema.array().parse(rawToolFiles.flat());
export const functionConnections: FunctionConnection[] =
  functionConnectionSchema.array().parse(functionConnectionsData);

export const functionById = new Map(functions.map((f) => [f.id, f]));
export const phaseById = new Map(phases.map((p) => [p.id, p]));
export const toolById = new Map(tools.map((t) => [t.id, t]));

export function getToolsForFunction(functionId: string): Tool[] {
  return tools.filter((t) => t.functions.includes(functionId));
}

export function getToolsForPhase(phaseId: string): Tool[] {
  return tools.filter((t) => t.phases.includes(phaseId));
}

export function getToolsForCell(functionId: string, phaseId: string): Tool[] {
  return tools.filter(
    (t) => t.functions.includes(functionId) && t.phases.includes(phaseId),
  );
}

export function getPhasesForFunction(functionId: string): LifecyclePhase[] {
  const phaseIds = new Set(
    getToolsForFunction(functionId).flatMap((t) => t.phases),
  );
  return phases.filter((p) => phaseIds.has(p.id));
}

export function getFunctionsForPhase(phaseId: string): BusinessFunction[] {
  const phaseTools = getToolsForPhase(phaseId);
  const functionIds = new Set(phaseTools.flatMap((t) => t.functions));
  return functions.filter((f) => functionIds.has(f.id));
}

export function getTopPicksForFunction(functionId: string): Tool[] {
  return tools.filter((t) => t.functions.includes(functionId) && t.topPick);
}

export interface RelatedFunction {
  functionId: string;
  relationship: string;
  direction: "outgoing" | "incoming";
}

/** Every connection touching this function, in either direction. */
export function getConnectionsForFunction(
  functionId: string,
): RelatedFunction[] {
  const related: RelatedFunction[] = [];
  for (const c of functionConnections) {
    if (c.from === functionId) {
      related.push({
        functionId: c.to,
        relationship: c.relationship,
        direction: "outgoing",
      });
    } else if (c.to === functionId) {
      related.push({
        functionId: c.from,
        relationship: c.relationship,
        direction: "incoming",
      });
    }
  }
  return related;
}

/** Tools sorted newest-first by addedOn — the real, git-derived date each
 * tool entry was introduced (see scripts/backfill note in schema.ts), not
 * a re-verification date. */
export function getRecentlyAddedTools(limit?: number): Tool[] {
  const sorted = [...tools].sort((a, b) =>
    b.addedOn === a.addedOn ? a.name.localeCompare(b.name) : b.addedOn.localeCompare(a.addedOn),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Tools sorted newest-first by lastChecked — a genuine, sourced "what
 * changed" signal distinct from addedOn: a tool re-appearing here means its
 * pricing/free-tier was just re-verified against the vendor's own page, not
 * that it's new to the registry. Used by /whats-new's second changelog
 * stream (see the page's own note on why the two dates are tracked
 * separately). */
export function getRecentlyCheckedTools(limit?: number): Tool[] {
  const sorted = [...tools].sort((a, b) =>
    b.lastChecked === a.lastChecked
      ? a.name.localeCompare(b.name)
      : b.lastChecked.localeCompare(a.lastChecked),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getMatrixCounts(): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};
  for (const fn of functions) {
    counts[fn.id] = {};
    for (const phase of phases) {
      counts[fn.id][phase.id] = getToolsForCell(fn.id, phase.id).length;
    }
  }
  return counts;
}

export const stats = {
  functionCount: functions.length,
  toolCount: tools.length,
  freeToolCount: tools.filter((t) => t.freeTier.available).length,
  topPickCount: tools.filter((t) => t.topPick).length,
};
