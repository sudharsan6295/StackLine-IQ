/**
 * Build-time data validation. Run via `npm run validate:data` (also runs
 * automatically before `npm run build` via the `prebuild` npm hook).
 * Fails the process (non-zero exit) on any schema or cross-reference error
 * so bad data can never reach a deploy.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { functionSchema, phaseSchema, toolSchema } from "../src/lib/schema";

const DATA_DIR = path.join(__dirname, "..", "src", "data");
const TOOLS_DIR = path.join(DATA_DIR, "tools");

let errorCount = 0;

function fail(message: string) {
  errorCount += 1;
  console.error(`✖ ${message}`);
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

const functionsRaw = readJson(path.join(DATA_DIR, "functions.json"));
const phasesRaw = readJson(path.join(DATA_DIR, "phases.json"));

const functionsResult = functionSchema.array().safeParse(functionsRaw);
if (!functionsResult.success) {
  fail(
    `functions.json failed validation:\n${functionsResult.error.toString()}`,
  );
}
const functionIds = new Set(
  functionsResult.success ? functionsResult.data.map((f) => f.id) : [],
);

const phasesResult = phaseSchema.array().safeParse(phasesRaw);
if (!phasesResult.success) {
  fail(`phases.json failed validation:\n${phasesResult.error.toString()}`);
}
const phaseIds = new Set(
  phasesResult.success ? phasesResult.data.map((p) => p.id) : [],
);

const toolFiles = readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".json"));
const seenToolIds = new Set<string>();
let toolCount = 0;
let topPickCount = 0;
let freeCount = 0;
const today = new Date();
const STALE_DAYS = 120;

for (const file of toolFiles) {
  const fullPath = path.join(TOOLS_DIR, file);
  const raw = readJson(fullPath);
  const result = toolSchema.array().safeParse(raw);
  if (!result.success) {
    fail(`${file} failed schema validation:\n${result.error.toString()}`);
    continue;
  }

  for (const tool of result.data) {
    toolCount += 1;
    if (tool.topPick) topPickCount += 1;
    if (tool.freeTier.available) freeCount += 1;

    if (seenToolIds.has(tool.id)) {
      fail(`${file}: duplicate tool id "${tool.id}"`);
    }
    seenToolIds.add(tool.id);

    for (const fnId of tool.functions) {
      if (!functionIds.has(fnId)) {
        fail(
          `${file}: tool "${tool.id}" references unknown function id "${fnId}"`,
        );
      }
    }
    for (const phaseId of tool.phases) {
      if (!phaseIds.has(phaseId)) {
        fail(
          `${file}: tool "${tool.id}" references unknown phase id "${phaseId}"`,
        );
      }
    }

    if (
      tool.pricingModel === "paid" &&
      !tool.paidTier.isCustomPricing &&
      tool.paidTier.startingPrice === undefined
    ) {
      fail(
        `${file}: tool "${tool.id}" is "paid" but has no startingPrice and isCustomPricing is false`,
      );
    }
    if (tool.badge === "Free" && tool.pricingModel !== "free") {
      fail(
        `${file}: tool "${tool.id}" has badge "Free" but pricingModel "${tool.pricingModel}"`,
      );
    }

    const lastChecked = new Date(tool.lastChecked);
    const ageDays =
      (today.getTime() - lastChecked.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > STALE_DAYS) {
      console.warn(
        `⚠ ${file}: tool "${tool.id}" was last checked ${tool.lastChecked} (${Math.round(ageDays)} days ago) — consider re-verifying pricing.`,
      );
    }
  }
}

if (errorCount > 0) {
  console.error(
    `\n${errorCount} data error(s) found. Fix src/data/*.json before building.`,
  );
  process.exit(1);
}

console.log(
  `✓ Data OK — ${functionIds.size} functions, ${phaseIds.size} phases, ${toolCount} tools (${topPickCount} top picks, ${freeCount} with a free tier) across ${toolFiles.length} files.`,
);
