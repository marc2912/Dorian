import React from "react";

export interface Tile {
  content?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  colSpan?: number;
}

interface TileGridProps {
  tiles: Tile[];
  showBack?: boolean;
}

const backTile: Tile = {
  href: "/",
  content: (
    <div className="flex flex-col items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12 text-gray-400"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium text-gray-400">Back</span>
    </div>
  ),
};

export default function TileGrid({ tiles, showBack }: TileGridProps) {
  const cells: Tile[] = [];
  let gridPos = 0;

  for (const tile of tiles) {
    if (gridPos >= 8) break;
    cells.push(tile);
    gridPos += tile.colSpan ?? 1;
  }

  while (gridPos < 8) {
    if (showBack && gridPos === 7) {
      cells.push(backTile);
    } else {
      cells.push({});
    }
    gridPos++;
  }

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-3 p-3 w-full h-full">
      {cells.map((tile, i) => {
        const interactive = !!(tile.href || tile.onClick);
        const span = tile.colSpan ?? 1;

        const inner = (
          <div
            className={`
              flex items-center justify-center rounded-2xl
              w-full h-full
              bg-[var(--tile-bg)] border border-[var(--tile-border)]
              ${interactive ? "hover:brightness-125 active:scale-95 cursor-pointer" : ""}
              transition-all duration-150
            `}
          >
            {tile.content || null}
          </div>
        );

        const style = span > 1 ? { gridColumn: `span ${span}` } : undefined;

        if (tile.href) {
          return (
            <a key={i} href={tile.href} className="block" style={style}>
              {inner}
            </a>
          );
        }

        if (tile.onClick) {
          return (
            <button key={i} onClick={tile.onClick} className="block w-full h-full" style={style}>
              {inner}
            </button>
          );
        }

        return (
          <div key={i} style={style}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
