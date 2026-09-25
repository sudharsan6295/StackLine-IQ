import functionsData from "@/data/functions.json";
import phasesData from "@/data/phases.json";
import {
  functionSchema,
  phaseSchema,
  toolSchema,
  type BusinessFunction,
  type LifecyclePhase,
  type Tool,
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
];

export const functions: BusinessFunction[] = functionSchema
  .array()
  .parse(functionsData);
export const phases: LifecyclePhase[] = phaseSchema
  .array()
  .parse(phasesData)
  .sort((a, b) => a.order - b.order);
export const tools: Tool[] = toolSchema.array().parse(rawToolFiles.flat());

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
