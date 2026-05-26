import { useNavigate } from "react-router-dom";
import { RegionNode } from "./RegionNode";
import type { RegionDef } from "../../data/schemas";
import { useRPGStore } from "../../stores/rpgStore";

interface WorldMapCanvasProps {
  regions: RegionDef[];
  unlockedRegionIds: string[];
  connectionReasons: Record<string, string | null>;
  onRegionSelect: (regionId: string) => void;
}

export function WorldMapCanvas({
  regions,
  unlockedRegionIds,
  connectionReasons,
  onRegionSelect,
}: WorldMapCanvasProps) {
  const currentRegionId = useRPGStore((s) => s.currentRegionId);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* World map background lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {regions.map((r) =>
          r.connections.map((conn) => {
            const target = regions.find((r2) => r2.id === conn.targetRegionId);
            if (!target) return null;
            return (
              <line
                key={`${r.id}-${conn.targetRegionId}`}
                x1={`${r.worldMapTile.x}%`}
                y1={`${r.worldMapTile.y}%`}
                x2={`${target.worldMapTile.x}%`}
                y2={`${target.worldMapTile.y}%`}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            );
          })
        )}
      </svg>

      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-10">
        <h2 className="text-amber-400 text-base sm:text-xl font-bold tracking-wider">WORLD MAP</h2>
      </div>

      {/* Region nodes */}
      {regions.map((r) => (
        <RegionNode
          key={r.id}
          id={r.id}
          displayName={r.displayName}
          country={r.country}
          x={r.worldMapTile.x}
          y={r.worldMapTile.y}
          unlocked={unlockedRegionIds.includes(r.id)}
          current={r.id === currentRegionId}
          lockedReason={connectionReasons[r.id]}
          onClick={() => onRegionSelect(r.id)}
        />
      ))}

      <button
        onClick={() => window.history.back()}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
