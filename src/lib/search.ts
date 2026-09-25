import Fuse, { type IFuseOptions } from "fuse.js";
import type { Tool } from "@/lib/schema";
import { functionById, phaseById } from "@/lib/data";

export interface SearchableTool extends Tool {
  functionNames: string;
  phaseNames: string;
}

export function toSearchable(tools: Tool[]): SearchableTool[] {
  return tools.map((tool) => ({
    ...tool,
    functionNames: tool.functions
      .map((id) => functionById.get(id)?.name ?? id)
      .join(" "),
    phaseNames: tool.phases
      .map((id) => phaseById.get(id)?.name ?? id)
      .join(" "),
  }));
}

const options: IFuseOptions<SearchableTool> = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 0.4 },
    { name: "bestFor", weight: 0.3 },
    { name: "description", weight: 0.15 },
    { name: "functionNames", weight: 0.1 },
    { name: "phaseNames", weight: 0.05 },
  ],
};

export function createToolSearchIndex(tools: Tool[]): Fuse<SearchableTool> {
  return new Fuse(toSearchable(tools), options);
}

export function searchTools(
  index: Fuse<SearchableTool>,
  query: string,
): Set<string> | null {
  if (!query.trim()) return null;
  return new Set(index.search(query).map((r) => r.item.id));
}
