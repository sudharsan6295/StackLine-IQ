import { NextResponse } from "next/server";
import { functions } from "@/lib/data";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

/** GET /api/functions — the 14 business functions (id, name, subtypes, etc). */
export function GET() {
  return NextResponse.json(
    { count: functions.length, functions },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
