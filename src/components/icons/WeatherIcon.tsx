interface WeatherIconProps {
  code: number;
  className?: string;
}

// WMO Weather interpretation codes → SVG icon
// https://open-meteo.com/en/docs#weathervariables
export default function WeatherIcon({ code, className = "w-16 h-16" }: WeatherIconProps) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  // Clear sky
  if (code === 0) {
    return (
      <svg {...props} className={`${className} text-yellow-400`}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }

  // Mainly clear, partly cloudy
  if (code <= 2) {
    return (
      <svg {...props} className={`${className} text-yellow-300`}>
        <circle cx="8" cy="10" r="4" />
        <path d="M8 2v2M2 10h2M14 10h-1M4.34 5.34l1.42 1.42M11.66 5.34l-1.42 1.42" />
        <path d="M13 15.5a4 4 0 0 0-7.84 0H5a3 3 0 1 0 0 6h10a3 3 0 1 0 0-6h-2z" />
      </svg>
    );
  }

  // Overcast
  if (code === 3) {
    return (
      <svg {...props} className={`${className} text-gray-400`}>
        <path d="M17 18H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 10.5 4 4 0 0 1 17 18z" />
      </svg>
    );
  }

  // Fog / depositing rime fog
  if (code <= 48) {
    return (
      <svg {...props} className={`${className} text-gray-500`}>
        <path d="M17 18H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 10.5 4 4 0 0 1 17 18z" />
        <path d="M4 21h16M6 18h12" strokeDasharray="2 2" />
      </svg>
    );
  }

  // Drizzle (51–57)
  if (code <= 57) {
    return (
      <svg {...props} className={`${className} text-blue-300`}>
        <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
        <path d="M8 19v1M12 19v1M16 19v1" />
      </svg>
    );
  }

  // Rain (61–67)
  if (code <= 67) {
    return (
      <svg {...props} className={`${className} text-blue-400`}>
        <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
        <path d="M8 19v2M12 19v2M16 19v2" />
      </svg>
    );
  }

  // Snow (71–77)
  if (code <= 77) {
    return (
      <svg {...props} className={`${className} text-blue-100`}>
        <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
        <circle cx="8" cy="20" r="0.5" fill="currentColor" />
        <circle cx="12" cy="19" r="0.5" fill="currentColor" />
        <circle cx="16" cy="20" r="0.5" fill="currentColor" />
      </svg>
    );
  }

  // Rain showers (80–82)
  if (code <= 82) {
    return (
      <svg {...props} className={`${className} text-blue-400`}>
        <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
        <path d="M7 19l-1 2M11 19l-1 2M15 19l-1 2" />
      </svg>
    );
  }

  // Snow showers (85–86)
  if (code <= 86) {
    return (
      <svg {...props} className={`${className} text-blue-100`}>
        <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
        <circle cx="8" cy="19" r="0.5" fill="currentColor" />
        <circle cx="12" cy="20" r="0.5" fill="currentColor" />
        <circle cx="16" cy="19" r="0.5" fill="currentColor" />
        <circle cx="10" cy="21" r="0.5" fill="currentColor" />
        <circle cx="14" cy="21" r="0.5" fill="currentColor" />
      </svg>
    );
  }

  // Thunderstorm (95–99)
  return (
    <svg {...props} className={`${className} text-yellow-500`}>
      <path d="M17 16H7a5 5 0 0 1-.5-9.97A7 7 0 0 1 20 8.5 4 4 0 0 1 17 16z" />
      <path d="M13 16l-2 4h4l-2 4" />
    </svg>
  );
}

const WMO_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight showers",
  81: "Showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Heavy thunderstorm",
};

export function getWeatherLabel(code: number): string {
  return WMO_LABELS[code] ?? "Unknown";
}
