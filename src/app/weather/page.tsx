"use client";

import { useEffect, useState } from "react";
import WeatherIcon, { getWeatherLabel } from "@/components/icons/WeatherIcon";

interface PrecipWindow {
  start: string;
  end: string;
  label: string;
}

interface TodayWeather {
  currentTemp: number;
  weatherCode: number;
  high: number;
  low: number;
  dailyWeatherCode: number;
  precipitation: PrecipWindow[];
}

interface TomorrowWeather {
  high: number;
  low: number;
  weatherCode: number;
  precipitation: PrecipWindow[];
}

interface WeatherData {
  today: TodayWeather;
  tomorrow: TomorrowWeather;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

function toC(f: number): number {
  return Math.round((f - 32) * 5 / 9);
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<"F" | "C">("F");

  useEffect(() => {
    const saved = getCookie("temp_unit");
    if (saved === "C") setUnit("C");
  }, []);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setWeather)
      .catch(console.error);
  }, []);

  function toggleUnit() {
    const next = unit === "F" ? "C" : "F";
    setUnit(next);
    setCookie("temp_unit", next, 365);
  }

  function temp(f: number): string {
    return unit === "F" ? `${f}` : `${toC(f)}`;
  }

  return (
    <div className="flex flex-col gap-3 p-3 w-full h-full">
      {/* Forecast tiles — top ~85% */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Today */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--tile-bg)] border border-[var(--tile-border)]">
          <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            Today
          </span>
          {weather ? (
            <>
              <WeatherIcon code={weather.today.weatherCode} className="w-20 h-20" />
              <span className="text-4xl font-bold">{temp(weather.today.currentTemp)}°{unit}</span>
              <span className="text-sm text-gray-400">
                {getWeatherLabel(weather.today.weatherCode)}
              </span>
              <span className="text-sm text-gray-500">
                H:{temp(weather.today.high)}° L:{temp(weather.today.low)}°
              </span>
              {weather.today.precipitation.length > 0 ? (
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  {weather.today.precipitation.map((w, i) => (
                    <span key={i} className="text-xs text-blue-400">
                      {w.label} {w.start}–{w.end}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-600 mt-1">No precipitation</span>
              )}
            </>
          ) : (
            <span className="text-gray-500">Loading…</span>
          )}
        </div>

        {/* Tomorrow */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--tile-bg)] border border-[var(--tile-border)]">
          <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            Tomorrow
          </span>
          {weather ? (
            <>
              <WeatherIcon code={weather.tomorrow.weatherCode} className="w-20 h-20" />
              <span className="text-4xl font-bold">
                {temp(weather.tomorrow.high)}°{unit}
              </span>
              <span className="text-sm text-gray-400">
                {getWeatherLabel(weather.tomorrow.weatherCode)}
              </span>
              <span className="text-sm text-gray-500">
                H:{temp(weather.tomorrow.high)}° L:{temp(weather.tomorrow.low)}°
              </span>
              {weather.tomorrow.precipitation.length > 0 ? (
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  {weather.tomorrow.precipitation.map((w, i) => (
                    <span key={i} className="text-xs text-blue-400">
                      {w.label} {w.start}–{w.end}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-600 mt-1">No precipitation</span>
              )}
            </>
          ) : (
            <span className="text-gray-500">Loading…</span>
          )}
        </div>
      </div>

      {/* Bottom row — back button right-aligned */}
      <div className="grid grid-cols-2 gap-3" style={{ height: 80 }}>
        <button
          onClick={toggleUnit}
          className="flex items-center justify-center rounded-2xl w-full h-full bg-[var(--tile-bg)] border border-[var(--tile-border)] hover:brightness-125 active:scale-95 cursor-pointer transition-all duration-150"
        >
          <span className="text-lg font-semibold text-gray-300">
            °{unit === "F" ? "F → °C" : "C → °F"}
          </span>
        </button>
        <a href="/" className="block">
          <div className="flex items-center justify-center rounded-2xl w-full h-full bg-[var(--tile-bg)] border border-[var(--tile-border)] hover:brightness-125 active:scale-95 cursor-pointer transition-all duration-150">
            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-gray-400"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium text-gray-400">Back</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
