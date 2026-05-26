import { cn } from "@/lib/cn";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, WallConfig, WallSegment } from "@/types/arenaConfigNew";
import { getEdgeCount, generateRandomWalls } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const WALL_STYLES: WallConfig["wallStyle"][] = ["brick", "metal", "wood", "stone"];
const EXIT_STYLES: WallConfig["exitStyle"][] = ["arrows", "glow", "dashed"];

function setWall(wall: WallConfig, key: keyof WallConfig, value: any): WallConfig {
  return { ...wall, [key]: value };
}

function updateEdgeWall(wall: WallConfig, edgeIdx: number, wallIdx: number, field: keyof WallSegment, value: number): WallConfig {
  const edges = wall.edges.map((edge, ei) => {
    if (ei !== edgeIdx) return edge;
    const walls = edge.walls.map((w, wi) => wi !== wallIdx ? w : { ...w, [field]: value });
    return { ...edge, walls };
  });
  return { ...wall, edges };
}

function addWallSegment(wall: WallConfig, edgeIdx: number): WallConfig {
  const edges = wall.edges.map((edge, ei) => {
    if (ei !== edgeIdx || edge.walls.length >= 3) return edge;
    return { ...edge, walls: [...edge.walls, { width: 30, thickness: 1, position: 0 }] };
  });
  return { ...wall, edges };
}

function removeWallSegment(wall: WallConfig, edgeIdx: number, wallIdx: number): WallConfig {
  const edges = wall.edges.map((edge, ei) => {
    if (ei !== edgeIdx) return edge;
    return { ...edge, walls: edge.walls.filter((_, wi) => wi !== wallIdx) };
  });
  return { ...wall, edges };
}

const EDGE_NAMES = (shape: string, count: number): string[] => {
  if (shape === "circle") return ["Circular Edge"];
  if (count === 3) return ["Edge 1 (Top)", "Edge 2 (Bottom-Left)", "Edge 3 (Bottom-Right)"];
  if (count === 4) return ["Top", "Right", "Bottom", "Left"];
  return Array.from({ length: count }, (_, i) => `Edge ${i + 1}`);
};

export default function WallsTab({ config, onChange }: Props) {
  const wall = config.wall;
  if (!wall) return <div className="text-faint">No wall config loaded.</div>;

  const edgeCount = getEdgeCount(config.shape);
  const edgeNames = EDGE_NAMES(config.shape, edgeCount);
  const setWallProp = (key: keyof WallConfig, value: any) =>
    onChange({ wall: setWall(wall, key, value) });

  return (
    <CollapsibleSection title="Wall System" storageKey="arena-walls-main" defaultOpen={true}>
    <div className="flex flex-col gap-5">
      {/* Enable toggle */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-text">Wall System</span>
        <div className="flex gap-2.5 items-center">
          <button
            onClick={() => onChange({ wall: generateRandomWalls(config.shape) })}
            className="py-1 px-3 bg-bg3 border border-border rounded-md text-[11px] text-muted cursor-pointer"
          >
            Randomize
          </button>
          <button
            onClick={() => setWallProp("enabled", !wall.enabled)}
            className={cn("py-1 px-[14px] rounded-md border-none cursor-pointer font-semibold text-xs transition-colors", wall.enabled ? "bg-theme-green text-white" : "bg-bg3 text-theme-muted")}
          >
            {wall.enabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {wall.enabled && (
        <>
          {/* Style + Collision */}
          <div className="bg-bg3 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-faint mb-1.5">Wall Style</label>
                <div className="flex gap-1.5 flex-wrap">
                  {WALL_STYLES.map(s => (
                    <button key={s} onClick={() => setWallProp("wallStyle", s)}
                      className={cn("py-1 px-2.5 rounded text-[11px] cursor-pointer capitalize border transition-colors", wall.wallStyle === s ? "bg-theme-blue text-white border-theme-blue" : "bg-bg2 text-theme-muted border-border-c hover:border-theme-blue")}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-faint mb-1.5">Exit Style</label>
                <div className="flex gap-1.5">
                  {EXIT_STYLES.map(s => (
                    <button key={s} onClick={() => setWallProp("exitStyle", s)}
                      className={cn("py-1 px-2.5 rounded text-[11px] cursor-pointer capitalize border transition-colors", wall.exitStyle === s ? "bg-theme-red text-white border-theme-red" : "bg-bg2 text-theme-muted border-border-c hover:border-theme-red")}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-3.5">
              {([
                { field: "baseDamage" as const, label: "Base Damage", min: 0, max: 30, step: 1 },
                { field: "recoilDistance" as const, label: "Recoil (em)", min: 0, max: 10, step: 0.5 },
              ]).map(({ field, label, min, max, step }) => (
                <div key={field}>
                  <div className="flex justify-between text-[11px] text-faint mb-0.5">
                    <span>{label}</span>
                    <span className="text-text font-mono">{wall[field]}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step}
                    value={wall[field] as number}
                    onChange={e => setWallProp(field, +e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-3.5">
                <label className="flex gap-1.5 items-center text-[11px] text-muted cursor-pointer">
                  <input type="checkbox" checked={wall.hasSpikes ?? false} onChange={e => setWallProp("hasSpikes", e.target.checked)} />
                  Spikes ({wall.spikeDamageMultiplier ?? 1.5}x)
                </label>
              </div>
            </div>
          </div>

          {/* Per-edge configuration */}
          <div>
            <div className="text-[13px] font-semibold text-text mb-3">
              Per-Edge Walls ({edgeCount} edge{edgeCount !== 1 ? "s" : ""})
            </div>
            <div className="flex flex-col gap-2.5">
              {wall.edges.map((edge, ei) => (
                <div key={ei} className="bg-bg3 rounded-[10px] p-3 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-text">{edgeNames[ei] ?? `Edge ${ei + 1}`}</span>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[11px] text-faint">
                        {edge.walls.length === 0 ? "All exit" : `${edge.walls.length} wall${edge.walls.length > 1 ? "s" : ""}`}
                      </span>
                      {edge.walls.length < 3 && (
                        <button
                          onClick={() => onChange({ wall: addWallSegment(wall, ei) })}
                          className="py-[2px] px-2 bg-bg2 border border-border rounded text-[10px] text-muted cursor-pointer"
                        >
                          + Wall
                        </button>
                      )}
                    </div>
                  </div>
                  {edge.walls.length === 0 && (
                    <p className="text-[11px] text-red text-center">No walls — full exit (red)</p>
                  )}
                  {edge.walls.map((w, wi) => (
                    <div key={wi} className="bg-bg2 rounded-lg p-2 mb-1.5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-muted">Wall {wi + 1}</span>
                        <button onClick={() => onChange({ wall: removeWallSegment(wall, ei, wi) })} className="text-[10px] text-red bg-transparent border-none cursor-pointer">Remove</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["position", "width", "thickness"] as const).map(field => (
                          <div key={field}>
                            <div className="flex justify-between text-[10px] text-faint mb-0.5">
                              <span className="capitalize">{field} {field !== "thickness" ? "%" : "em"}</span>
                              <span className="text-text">{w[field]}</span>
                            </div>
                            <input type="range"
                              min={field === "thickness" ? 0.5 : 0}
                              max={field === "thickness" ? 4 : field === "width" ? 100 : 100}
                              step={field === "thickness" ? 0.5 : 5}
                              value={w[field]}
                              onChange={e => onChange({ wall: updateEdgeWall(wall, ei, wi, field, +e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    </CollapsibleSection>
  );
}
