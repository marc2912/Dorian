"use client";

import TileGrid from "@/components/TileGrid";

async function controlLights(value: number) {
  const res = await fetch("/api/lights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  if (!res.ok) {
    console.error("Failed to control lights:", await res.text());
  }
}

export default function LightsPage() {
  const tiles = [
    {
      onClick: () => controlLights(0),
      content: (
        <div className="flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16 text-gray-500"
          >
            <path d="M9 21h6" />
            <path d="M10 17h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
          </svg>
          <span className="text-sm font-medium text-gray-400">Lights Off</span>
        </div>
      ),
    },
    {
      onClick: () => controlLights(1),
      content: (
        <div className="flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16 text-yellow-400"
          >
            <path d="M9 21h6" />
            <path d="M10 17h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
          <span className="text-sm font-medium text-yellow-400">Lights On</span>
        </div>
      ),
    },
  ];

  return <TileGrid tiles={tiles} />;
}
