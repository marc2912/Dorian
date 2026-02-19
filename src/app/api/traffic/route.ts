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

  const res = await fetch(`${h}/getLight`);
  const data = await res.json();

  return NextResponse.json(data);
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

  const res = await fetch(`${h}/setLight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
