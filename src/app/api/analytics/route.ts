import { NextResponse } from "next/server";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";

const allowedEvents = new Set(["website_view", "product_view", "whatsapp_cta_click"]);

export async function POST(request: Request) {
  const apiUrl = normalizeApiUrl(process.env.API_URL);
  if (!apiUrl) return new NextResponse(null, { status: 204 });

  const body = await request.json().catch(() => null);
  if (!body || !allowedEvents.has(body.event_type)) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  await fetch(`${apiUrl}/analytics/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: request.headers.get("referer") ?? "",
      "User-Agent": request.headers.get("user-agent") ?? "",
    },
    body: JSON.stringify({
      event_type: body.event_type,
      product_slug: body.product_slug,
      source_path: body.source_path,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  }).catch(() => null);

  return new NextResponse(null, { status: 204 });
}
