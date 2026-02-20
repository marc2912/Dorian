import { NextRequest, NextResponse } from "next/server";

const host = () => process.env.TRAFFIC_LIGHT_HOST;
const token = () => process.env.TRAFFIC_LIGHT_TOKEN;

export async function GET() {
  const h = host();
  if (!h) {
    return NextResponse.json(
      { error: "TRAFFIC_LIGHT_HOST not configured" },
      { status: 500 }
    );
  }

  const wsUrl = h.replace(/^http/, "ws") + ":81";

  console.log("[traffic] GET /getLight");

  try {
    const res = await fetch(`${h}/getLight`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    console.log("[traffic] GET response:", JSON.stringify(data));
    return NextResponse.json({ ...data, wsUrl });
  } catch (err) {
    console.error("[traffic] GET error:", err);
    return NextResponse.json(
      { wsUrl, error: "Failed to reach traffic light" },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  const h = host();
  const t = token();

  if (!h || !t) {
    return NextResponse.json(
      { error: "TRAFFIC_LIGHT_HOST/TOKEN not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  console.log("[traffic] POST /setLight payload:", JSON.stringify(body));

  try {
    const res = await fetch(`${h}/setLight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    console.log("[traffic] POST response:", res.status, JSON.stringify(data));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[traffic] POST error:", err);
    return NextResponse.json(
      { error: "Failed to reach traffic light" },
      { status: 502 }
    );
  }
}
