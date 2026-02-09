"use client";

import { useEffect, useState } from "react";

export default function DateTimeTile() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className="text-3xl font-bold tabular-nums">{time}</span>
      <span className="text-sm text-gray-400">{date}</span>
    </div>
  );
}
