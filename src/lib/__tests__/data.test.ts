import { describe, expect, it } from "vitest";
import {
  functions,
  phases,
  tools,
  functionById,
  phaseById,
  getToolsForFunction,
  getToolsForCell,
  stats,
} from "@/lib/data";

describe("registry data integrity", () => {
  it("loads a non-trivial number of functions, phases, and tools", () => {
    expect(functions.length).toBeGreaterThanOrEqual(10);
    expect(phases.length).toBeGreaterThanOrEqual(5);
    expect(tools.length).toBeGreaterThan(0);
  });

  it("has no duplicate tool ids", () => {
    const ids = tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every tool references only known function and phase ids", () => {
    for (const tool of tools) {
      for (const fnId of tool.functions) {
        expect(
          functionById.has(fnId),
          `${tool.id} references unknown function ${fnId}`,
        ).toBe(true);
      }
      for (const phaseId of tool.phases) {
        expect(
          phaseById.has(phaseId),
          `${tool.id} references unknown phase ${phaseId}`,
        ).toBe(true);
      }
    }
  });

  it("every tool has a working source and official URL string", () => {
    for (const tool of tools) {
      expect(tool.officialUrl.startsWith("https://")).toBe(true);
      expect(tool.sourceUrl.startsWith("https://")).toBe(true);
    }
  });

  it("getToolsForFunction only returns tools tagged with that function", () => {
    const devTools = getToolsForFunction("software-development");
    expect(devTools.length).toBeGreaterThan(0);
    for (const tool of devTools) {
      expect(tool.functions).toContain("software-development");
    }
  });

  it("getToolsForCell intersects function and phase", () => {
    const cell = getToolsForCell("software-development", "build");
    for (const tool of cell) {
      expect(tool.functions).toContain("software-development");
      expect(tool.phases).toContain("build");
    }
  });

  it("stats counts are internally consistent", () => {
    expect(stats.toolCount).toBe(tools.length);
    expect(stats.freeToolCount).toBe(
      tools.filter((t) => t.freeTier.available).length,
    );
    expect(stats.topPickCount).toBe(tools.filter((t) => t.topPick).length);
  });
});
