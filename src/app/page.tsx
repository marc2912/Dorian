import TileGrid from "@/components/TileGrid";
import DateTimeTile from "@/components/DateTimeTile";
import LightbulbIcon from "@/components/icons/LightbulbIcon";
import WeatherIcon from "@/components/icons/WeatherIcon";

export default function Home() {
  const tiles = [
    {
      href: "/lights",
      content: (
        <div className="flex flex-col items-center gap-2">
          <LightbulbIcon />
          <span className="text-sm font-medium text-gray-300">Lights</span>
        </div>
      ),
    },
    {
      colSpan: 2,
      content: <DateTimeTile />,
    },
    {
      href: "/weather",
      content: (
        <div className="flex flex-col items-center gap-2">
          <WeatherIcon code={2} />
          <span className="text-sm font-medium text-gray-300">Weather</span>
        </div>
      ),
    },
  ];

  return <TileGrid tiles={tiles} />;
}
