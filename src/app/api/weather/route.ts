import { NextResponse } from "next/server";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

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

  const today = {
    currentTemp: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    dailyWeatherCode: data.daily.weather_code[0],
  };

  const tomorrow = {
    high: Math.round(data.daily.temperature_2m_max[1]),
    low: Math.round(data.daily.temperature_2m_min[1]),
    weatherCode: data.daily.weather_code[1],
  };

  return NextResponse.json({ today, tomorrow });
}
