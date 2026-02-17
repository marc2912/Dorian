"use client";

import { useState } from "react";

type Mode = "off" | "auto" | "traffic" | "party";
type LightColor = "red" | "yellow" | "green";

export default function TrafficPage() {
  const [mode, setMode] = useState<Mode>("off");
  const [lights, setLights] = useState({ red: false, yellow: false, green: false });
  const [partyNumber, setPartyNumber] = useState<number | null>(null);

  function clickLight(color: LightColor) {
    setMode("traffic");
    setPartyNumber(null);
    setLights((prev) => ({ ...prev, [color]: !prev[color] }));
  }

  function clickMode(m: "off" | "auto" | "party") {
    setMode(m);
    setLights({ red: false, yellow: false, green: false });
    setPartyNumber(null);
  }

  function clickNumber(n: number) {
    if (mode !== "party") return;
    setPartyNumber(n);
  }

  const isBlinking = mode === "party" && partyNumber === null;

  const lightColors: LightColor[] = ["red", "yellow", "green"];

  const lightStyles: Record<LightColor, { on: string; off: string }> = {
    red: {
      on: "bg-red-500 shadow-[0_0_24px_4px_rgba(239,68,68,0.5)]",
      off: "bg-red-500/15",
    },
    yellow: {
      on: "bg-yellow-400 shadow-[0_0_24px_4px_rgba(250,204,21,0.5)]",
      off: "bg-yellow-400/15",
    },
    green: {
      on: "bg-green-500 shadow-[0_0_24px_4px_rgba(34,197,94,0.5)]",
      off: "bg-green-500/15",
    },
  };

  return (
    <div className="flex gap-3 p-3 w-full h-full">
      {/* Left half — traffic light + back button */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex-1 flex items-center justify-center rounded-2xl bg-[var(--tile-bg)] border border-[var(--tile-border)]">
          <div className="flex flex-col items-center gap-5 bg-gray-800 rounded-2xl px-7 py-6">
            {lightColors.map((color) => {
              const on = mode === "traffic" && lights[color];
              return (
                <button
                  key={color}
                  onClick={() => clickLight(color)}
                  className={`w-20 h-20 rounded-full transition-all duration-200 cursor-pointer active:scale-90
                    ${on ? lightStyles[color].on : lightStyles[color].off}
                  `}
                />
              );
            })}
          </div>
        </div>
        <a href="/" className="block" style={{ height: 56 }}>
          <div className="flex items-center justify-center gap-2 rounded-2xl w-full h-full bg-[var(--tile-bg)] border border-[var(--tile-border)] hover:brightness-125 active:scale-95 cursor-pointer transition-all duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-400"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium text-gray-400">Back</span>
          </div>
        </a>
      </div>

      {/* Right half — controls */}
      <div className="flex-1 flex flex-col gap-3">
        {/* OFF / auto / party buttons */}
        {(["off", "auto", "party"] as const).map((m) => (
          <button
            key={m}
            onClick={() => clickMode(m)}
            className={`flex-1 flex items-center justify-center rounded-2xl text-lg font-semibold
              border transition-all duration-150 cursor-pointer active:scale-95
              ${mode === m
                ? "bg-blue-600/30 border-blue-500 text-blue-300"
                : "bg-[var(--tile-bg)] border-[var(--tile-border)] text-gray-400 hover:brightness-125"
              }
            `}
          >
            {m === "off" ? "OFF" : m === "auto" ? "auto" : "party"}
          </button>
        ))}

        {/* Number buttons row */}
        <div className="flex-1 flex items-center justify-center gap-4">
          {[1, 2, 3, 4].map((n) => {
            const disabled = mode !== "party";
            const active = mode === "party" && partyNumber === n;

            return (
              <button
                key={n}
                onClick={() => clickNumber(n)}
                disabled={disabled}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold
                  border transition-all duration-150
                  ${disabled
                    ? "bg-[var(--tile-bg)] border-[var(--tile-border)] text-gray-700 cursor-not-allowed opacity-40"
                    : active
                      ? "bg-blue-600/30 border-blue-500 text-blue-300 cursor-pointer active:scale-95"
                      : isBlinking
                        ? "bg-[var(--tile-bg)] border-[var(--tile-border)] text-gray-400 cursor-pointer animate-pulse active:scale-95"
                        : "bg-[var(--tile-bg)] border-[var(--tile-border)] text-gray-400 cursor-pointer hover:brightness-125 active:scale-95"
                  }
                `}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
