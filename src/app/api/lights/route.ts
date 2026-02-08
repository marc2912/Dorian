import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const GOVEE_API_URL =
  "https://openapi.api.govee.com/router/api/v1/device/control";

const DEVICES = {
  D_DOOR: "30:6F:98:17:3C:E3:45:CA",
  D_BED: "F6:C4:98:17:3C:E3:44:7C",
  D_CHAIR: "1C:7B:98:17:3C:CF:2C:12",
} as const;

const SKU = "H6008";

function buildPayload(device: string, value: number) {
  return {
    requestId: randomBytes(12).toString("hex"),
    payload: {
      sku: SKU,
      device,
      capability: {
        type: "devices.capabilities.on_off",
        instance: "powerSwitch",
        value,
      },
    },
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOVEE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOVEE_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const value = body.value as number;

  if (value !== 0 && value !== 1) {
    return NextResponse.json(
      { error: "value must be 0 (off) or 1 (on)" },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled(
    Object.entries(DEVICES).map(async ([name, deviceId]) => {
      const payload = buildPayload(deviceId, value);
      const res = await fetch(GOVEE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Govee-API-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return { name, deviceId, status: res.status, data };
    })
  );

  return NextResponse.json({ results });
}
