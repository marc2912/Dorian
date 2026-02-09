"use client";

import { useEffect, useState } from "react";
import WeatherIcon, { getWeatherLabel } from "@/components/icons/WeatherIcon";

interface TodayWeather {
  currentTemp: number;
  weatherCode: number;
  high: number;
  low: number;
  dailyWeatherCode: number;
}

interface TomorrowWeather {
  high: number;
  low: number;
  weatherCode: number;
}

interface WeatherData {
  today: TodayWeather;
  tomorrow: TomorrowWeather;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setWeather)
      .catch(console.error);
  }, []);

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
              <span className="text-4xl font-bold">{weather.today.currentTemp}°F</span>
              <span className="text-sm text-gray-400">
                {getWeatherLabel(weather.today.weatherCode)}
              </span>
              <span className="text-sm text-gray-500">
                H:{weather.today.high}° L:{weather.today.low}°
              </span>
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
                {weather.tomorrow.high}°F
              </span>
              <span className="text-sm text-gray-400">
                {getWeatherLabel(weather.tomorrow.weatherCode)}
              </span>
              <span className="text-sm text-gray-500">
                H:{weather.tomorrow.high}° L:{weather.tomorrow.low}°
              </span>
            </>
          ) : (
            <span className="text-gray-500">Loading…</span>
          )}
        </div>
      </div>

      {/* Bottom row — back button right-aligned */}
      <div className="grid grid-cols-2 gap-3" style={{ height: 80 }}>
        <div className="rounded-2xl bg-[var(--tile-bg)] border border-[var(--tile-border)]" />
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
