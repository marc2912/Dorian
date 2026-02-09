import { NextResponse } from "next/server";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

interface PrecipWindow {
  start: string;
  end: string;
  label: string;
}

// WMO codes that indicate precipitation
function precipLabel(code: number): string | null {
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return null;
}

function formatHour(iso: string): string {
  const h = new Date(iso).getHours();
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function buildPrecipWindows(
  times: string[],
  probabilities: number[],
  codes: number[],
  dayIndex: number,
  dates: string[]
): PrecipWindow[] {
  const dayDate = dates[dayIndex];
  const windows: PrecipWindow[] = [];
  let i = 0;

  while (i < times.length) {
    // Only consider hours belonging to this day with ≥30% probability
    if (!times[i].startsWith(dayDate) || probabilities[i] < 30) {
      i++;
      continue;
    }

    const label = precipLabel(codes[i]) ?? "Precipitation";
    const startIdx = i;

    // Extend window while consecutive hours have ≥30% probability
    while (
      i < times.length &&
      times[i].startsWith(dayDate) &&
      probabilities[i] >= 30
    ) {
      i++;
    }

    windows.push({
      start: formatHour(times[startIdx]),
      end: formatHour(times[i - 1] + ":59"),
      label,
    });
  }

  return windows;
}

export async function GET() {
  const lat = process.env.WEATHER_LAT;
  const lon = process.env.WEATHER_LON;

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "WEATHER_LAT/WEATHER_LON not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    current: "temperature_2m,weather_code",
    hourly: "precipitation_probability,weather_code",
    temperature_unit: "fahrenheit",
    timezone: "America/New_York",
    forecast_days: "2",
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params}`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 502 }
    );
  }

  const data = await res.json();

  const hourlyTimes: string[] = data.hourly.time;
  const hourlyProb: number[] = data.hourly.precipitation_probability;
  const hourlyCodes: number[] = data.hourly.weather_code;
  const dates: string[] = data.daily.time;

  const today = {
    currentTemp: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    dailyWeatherCode: data.daily.weather_code[0],
    precipitation: buildPrecipWindows(hourlyTimes, hourlyProb, hourlyCodes, 0, dates),
  };

  const tomorrow = {
    high: Math.round(data.daily.temperature_2m_max[1]),
    low: Math.round(data.daily.temperature_2m_min[1]),
    weatherCode: data.daily.weather_code[1],
    precipitation: buildPrecipWindows(hourlyTimes, hourlyProb, hourlyCodes, 1, dates),
  };

  return NextResponse.json({ today, tomorrow });
}
