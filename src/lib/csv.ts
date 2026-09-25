import type { Tool } from "@/lib/schema";
import { functionById, phaseById } from "@/lib/data";
import { formatFreeTier, formatPrice } from "@/lib/format";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toolsToCsv(tools: Tool[]): string {
  const headers = [
    "Name",
    "Best for",
    "Functions",
    "Phases",
    "Badge",
    "Free tier",
    "Starting price",
    "Enterprise ready",
    "Official URL",
    "Source URL",
    "Last checked",
  ];
  const rows = tools.map((tool) => [
    tool.name,
    tool.bestFor,
    tool.functions.map((id) => functionById.get(id)?.name ?? id).join("; "),
    tool.phases.map((id) => phaseById.get(id)?.name ?? id).join("; "),
    tool.badge,
    formatFreeTier(tool),
    formatPrice(tool),
    tool.enterpriseReady ? "Yes" : "No",
    tool.officialUrl,
    tool.sourceUrl,
    tool.lastChecked,
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
