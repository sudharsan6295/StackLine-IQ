import { NextResponse, type NextRequest } from "next/server";
import { tools } from "@/lib/data";
import {
  applyFilters,
  defaultFilters,
  type ToolFilters,
} from "@/lib/filter-tools";
import { createToolSearchIndex, searchTools } from "@/lib/search";

const searchIndex = createToolSearchIndex(tools);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

/**
 * GET /api/tools — the same registry data the site itself renders, as
 * JSON, filterable with the same query shape the UI uses internally
 * (applyFilters/searchTools), so this route and the on-page filter bar
 * can never quietly drift apart.
 *
 * Query params: q, function (comma-separated ids), phase (comma-separated
 * ids), badge (comma-separated Free/Freemium/Paid), maxPrice, enterpriseOnly.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filters: ToolFilters = {
    q: params.get("q") ?? defaultFilters.q,
    functions: parseList(params.get("function")),
    phases: parseList(params.get("phase")),
    badges: parseList(params.get("badge")),
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : null,
    enterpriseOnly:
      params.get("enterpriseOnly") === "1" ||
      params.get("enterpriseOnly") === "true",
  };

  const matchedIds = searchTools(searchIndex, filters.q);
  const results = applyFilters(tools, filters, matchedIds);

  return NextResponse.json(
    { count: results.length, tools: results },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
