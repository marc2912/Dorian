import TileGrid from "@/components/TileGrid";
import LightbulbIcon from "@/components/icons/LightbulbIcon";

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
  ];

  return <TileGrid tiles={tiles} />;
}
