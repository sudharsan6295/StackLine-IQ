import { NextResponse } from "next/server";
import { toolById } from "@/lib/data";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

/** GET /api/tools/[id] — a single tool record, or 404 if the id isn't real. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const tool = toolById.get(id);
  if (!tool) {
    return NextResponse.json(
      { error: `No tool with id "${id}"` },
      { status: 404, headers: CORS_HEADERS },
    );
  }
  return NextResponse.json(tool, {
    headers: { ...CORS_HEADERS, ...CACHE_HEADERS },
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
