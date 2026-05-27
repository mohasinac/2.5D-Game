/**
 * MapTilePainter
 * Click-to-paint visual tile editor for a map's ground layer.
 * Outputs TileLayer[] (always at least the "ground" layer).
 * The painter edits only the "ground" layer; other layers pass through unchanged.
 */

import { useState, useCallback, useRef } from "react";
import type { TileLayer } from "@/rpg/data/schemas";

interface Props {
  width: number;
  height: number;
  layers: TileLayer[];
  onChange: (next: TileLayer[]) => void;
}

// Tile palette — ID → display info
const TILES: { id: number; label: string; color: string; emoji?: string }[] = [
  { id:  0, label: "Void",     color: "#111111" },
  { id:  1, label: "Floor",    color: "#4a7c59" },
  { id:  2, label: "Wall",     color: "#5a5a5a" },
  { id:  3, label: "Path",     color: "#b5956a" },
  { id:  4, label: "Door",     color: "#8b5e3c" },
  { id:  5, label: "Grass",    color: "#6aaa64" },
  { id:  6, label: "Sand",     color: "#d4b896" },
  { id:  7, label: "Rock",     color: "#7a7a6a" },
  { id:  8, label: "Wood",     color: "#a0704a" },
  { id:  9, label: "Rug",      color: "#8e44ad" },
  // Animated tiles
  { id: 10, label: "Water 🌊", color: "#1a6ea8" },
  { id: 14, label: "Lava 🌋",  color: "#c0392b" },
  { id: 15, label: "Ice ❄",   color: "#aee6f7" },
  { id: 16, label: "Fan 🌀",   color: "#95a5a6" },
  { id: 17, label: "Torch 🔥", color: "#e67e22" },
  { id: 18, label: "Portal ✨",color: "#8e44ad" },
  // Emoji / special
  { id: 100, label: "🌲 Tree",   color: "#2d6a2d", emoji: "🌲" },
  { id: 101, label: "💎 Chest",  color: "#1a1a4a", emoji: "💎" },
  { id: 102, label: "🪑 Chair",  color: "#6b4226", emoji: "🪑" },
  { id: 103, label: "🪴 Plant",  color: "#2d5a2d", emoji: "🪴" },
  { id: 104, label: "🛏 Bed",   color: "#3a3a6a", emoji: "🛏" },
  { id: 105, label: "📦 Box",   color: "#8b6a3a", emoji: "📦" },
  { id: 106, label: "⛲ Fount", color: "#2a5a8a", emoji: "⛲" },
  { id: 107, label: "⭐ Star",  color: "#6a5a1a", emoji: "⭐" },
];

const TILE_MAP = new Map(TILES.map(t => [t.id, t]));

function getGroundLayer(layers: TileLayer[], w: number, h: number): TileLayer {
  return layers.find(l => l.name === "ground") ?? {
    name: "ground",
    width: w,
    height: h,
    data: new Array(w * h).fill(0),
    visible: true,
  };
}

function setGroundLayer(layers: TileLayer[], next: TileLayer): TileLayer[] {
  const others = layers.filter(l => l.name !== "ground");
  return [next, ...others];
}

export function MapTilePainter({ width, height, layers, onChange }: Props) {
  const [selectedTile, setSelectedTile] = useState(1);
  const [open, setOpen] = useState(true);
  const [isPainting, setIsPainting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const ground = getGroundLayer(layers, width, height);

  // Ensure data array matches w×h
  const data = ground.data.length === width * height
    ? ground.data
    : new Array(width * height).fill(0).map((_, i) => ground.data[i] ?? 0);

  const paintTile = useCallback((x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (data[idx] === selectedTile) return;
    const nextData = [...data];
    nextData[idx] = selectedTile;
    onChange(setGroundLayer(layers, { ...ground, data: nextData }));
  }, [data, selectedTile, width, height, ground, layers, onChange]);

  const getCellFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const cellW = rect.width  / width;
    const cellH = rect.height / height;
    const x = Math.floor((e.clientX - rect.left)  / cellW);
    const y = Math.floor((e.clientY - rect.top)   / cellH);
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPainting(true);
    const cell = getCellFromEvent(e);
    if (cell) paintTile(cell.x, cell.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPainting) return;
    const cell = getCellFromEvent(e);
    if (cell) paintTile(cell.x, cell.y);
  };

  const handleMouseUp = () => setIsPainting(false);

  const fillAll = () => {
    const nextData = new Array(width * height).fill(selectedTile);
    onChange(setGroundLayer(layers, { ...ground, data: nextData }));
  };

  const clearAll = () => {
    const nextData = new Array(width * height).fill(0);
    onChange(setGroundLayer(layers, { ...ground, data: nextData }));
  };

  // Max render size: 480px wide
  const CELL_PX = Math.min(24, Math.floor(480 / Math.max(width, 1)));
  const gridW = CELL_PX * width;
  const gridH = CELL_PX * height;

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>🎨 Tile Painter ({width}×{height})</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 bg-gray-900 space-y-3">
          {/* Tile palette */}
          <div>
            <div className="text-[9px] text-gray-500 uppercase mb-2">Tile Palette — click to select, then paint on grid</div>
            <div className="flex flex-wrap gap-1">
              {TILES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTile(t.id)}
                  title={`${t.label} (id: ${t.id})`}
                  className={`flex flex-col items-center justify-center w-14 h-12 rounded text-[9px] transition-all border-2 ${
                    selectedTile === t.id
                      ? "border-white scale-105"
                      : "border-transparent hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: t.color + "99" }}
                >
                  {t.emoji ? (
                    <span className="text-base leading-none">{t.emoji}</span>
                  ) : (
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: t.color }} />
                  )}
                  <span className="text-gray-300 mt-0.5 truncate w-full text-center px-0.5">
                    {t.label.replace(/ [🌊🌋❄🌀🔥✨]/, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={fillAll}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">
              Fill All
            </button>
            <button type="button" onClick={clearAll}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">
              Clear All
            </button>
            <span className="text-[10px] text-gray-500 ml-auto">
              Selected: <span className="text-white font-mono">{TILE_MAP.get(selectedTile)?.label ?? selectedTile}</span>
            </span>
          </div>

          {/* Grid */}
          <div className="overflow-auto">
            <div
              ref={gridRef}
              className="relative select-none cursor-crosshair border border-gray-700 rounded"
              style={{ width: gridW, height: gridH }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {data.map((tileId, idx) => {
                const cx = idx % width;
                const cy = Math.floor(idx / width);
                const tile = TILE_MAP.get(tileId);
                return (
                  <div
                    key={idx}
                    style={{
                      position:  "absolute",
                      left:  cx * CELL_PX,
                      top:   cy * CELL_PX,
                      width:  CELL_PX,
                      height: CELL_PX,
                      backgroundColor: tile?.color ?? "#111",
                      boxSizing: "border-box",
                      border: "0.5px solid rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: CELL_PX * 0.65,
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {tile?.emoji ?? null}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[9px] text-gray-600">Click or drag to paint. Grid size: {width}×{height} = {width * height} tiles. Only the ground layer is painted here — other layers saved as-is.</p>
        </div>
      )}
    </div>
  );
}
