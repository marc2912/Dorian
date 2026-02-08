import React from "react";

export interface Tile {
  content?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

interface TileGridProps {
  tiles: Tile[];
}

export default function TileGrid({ tiles }: TileGridProps) {
  const cells = Array.from({ length: 8 }, (_, i) => tiles[i] || {});

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-3 p-3 w-full h-full">
      {cells.map((tile, i) => {
        const inner = (
          <div
            className={`
              flex items-center justify-center rounded-2xl
              w-full h-full
              bg-[var(--tile-bg)] border border-[var(--tile-border)]
              ${tile.content ? "hover:brightness-125 active:scale-95 cursor-pointer" : ""}
              transition-all duration-150
            `}
          >
            {tile.content || null}
          </div>
        );

        if (tile.href) {
          return (
            <a key={i} href={tile.href} className="block">
              {inner}
            </a>
          );
        }

        if (tile.onClick) {
          return (
            <button key={i} onClick={tile.onClick} className="block w-full h-full">
              {inner}
            </button>
          );
        }

        return (
          <div key={i}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
