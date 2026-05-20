import { C } from "@/styles/theme";
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
  if (!wall) return <div style={{ color: C.faint }}>No wall config loaded.</div>;

  const edgeCount = getEdgeCount(config.shape);
  const edgeNames = EDGE_NAMES(config.shape, edgeCount);
  const setWallProp = (key: keyof WallConfig, value: any) =>
    onChange({ wall: setWall(wall, key, value) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Enable toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Wall System</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => onChange({ wall: generateRandomWalls(config.shape) })}
            style={{ padding: "4px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.muted, cursor: "pointer" }}
          >
            Randomize
          </button>
          <button
            onClick={() => setWallProp("enabled", !wall.enabled)}
            style={{
              padding: "4px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12,
              background: wall.enabled ? C.green : C.bg3,
              color: wall.enabled ? C.white : C.muted,
            }}
          >
            {wall.enabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {wall.enabled && (
        <>
          {/* Style + Collision */}
          <div style={{ background: C.bg3, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Wall Style</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {WALL_STYLES.map(s => (
                    <button key={s} onClick={() => setWallProp("wallStyle", s)} style={{
                      padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer", textTransform: "capitalize",
                      background: wall.wallStyle === s ? C.blue : C.bg2,
                      color: wall.wallStyle === s ? C.white : C.muted,
                      border: `1px solid ${wall.wallStyle === s ? C.blue : C.border}`,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Exit Style</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {EXIT_STYLES.map(s => (
                    <button key={s} onClick={() => setWallProp("exitStyle", s)} style={{
                      padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer", textTransform: "capitalize",
                      background: wall.exitStyle === s ? C.red : C.bg2,
                      color: wall.exitStyle === s ? C.white : C.muted,
                      border: `1px solid ${wall.exitStyle === s ? C.red : C.border}`,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
              {([
                { field: "baseDamage" as const, label: "Base Damage", min: 0, max: 30, step: 1 },
                { field: "recoilDistance" as const, label: "Recoil (em)", min: 0, max: 10, step: 0.5 },
              ]).map(({ field, label, min, max, step }) => (
                <div key={field}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                    <span>{label}</span>
                    <span style={{ color: C.text, fontFamily: "monospace" }}>{wall[field]}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step}
                    value={wall[field] as number}
                    onChange={e => setWallProp(field, +e.target.value)}
                    style={{ width: "100%", accentColor: C.blue }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 14 }}>
                <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                  <input type="checkbox" checked={wall.hasSpikes ?? false} onChange={e => setWallProp("hasSpikes", e.target.checked)} />
                  Spikes ({wall.spikeDamageMultiplier ?? 1.5}x)
                </label>
              </div>
            </div>
          </div>

          {/* Per-edge configuration */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
              Per-Edge Walls ({edgeCount} edge{edgeCount !== 1 ? "s" : ""})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {wall.edges.map((edge, ei) => (
                <div key={ei} style={{ background: C.bg3, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{edgeNames[ei] ?? `Edge ${ei + 1}`}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.faint }}>
                        {edge.walls.length === 0 ? "All exit" : `${edge.walls.length} wall${edge.walls.length > 1 ? "s" : ""}`}
                      </span>
                      {edge.walls.length < 3 && (
                        <button
                          onClick={() => onChange({ wall: addWallSegment(wall, ei) })}
                          style={{ padding: "2px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 10, color: C.muted, cursor: "pointer" }}
                        >
                          + Wall
                        </button>
                      )}
                    </div>
                  </div>
                  {edge.walls.length === 0 && (
                    <p style={{ fontSize: 11, color: C.red, textAlign: "center" }}>No walls — full exit (red)</p>
                  )}
                  {edge.walls.map((w, wi) => (
                    <div key={wi} style={{ background: C.bg2, borderRadius: 8, padding: 8, marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Wall {wi + 1}</span>
                        <button onClick={() => onChange({ wall: removeWallSegment(wall, ei, wi) })} style={{ fontSize: 10, color: C.red, background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {(["position", "width", "thickness"] as const).map(field => (
                          <div key={field}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginBottom: 2 }}>
                              <span style={{ textTransform: "capitalize" }}>{field} {field !== "thickness" ? "%" : "em"}</span>
                              <span style={{ color: C.text }}>{w[field]}</span>
                            </div>
                            <input type="range"
                              min={field === "thickness" ? 0.5 : 0}
                              max={field === "thickness" ? 4 : field === "width" ? 100 : 100}
                              step={field === "thickness" ? 0.5 : 5}
                              value={w[field]}
                              onChange={e => onChange({ wall: updateEdgeWall(wall, ei, wi, field, +e.target.value) })}
                              style={{ width: "100%", accentColor: C.blue }}
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
  );
}
