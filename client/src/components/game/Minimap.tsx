// Minimap — top-left overlay showing full arena + bey positions + optional side view.
// Toggle visibility with the M key. Always rendered when arena config is available.
// Two tabs: "Top" (bird's-eye SVG) and "Side" (floor-stack side view for multi-floor arenas).

import { useState, useEffect } from "react";
import type { ServerBeyblade, ServerGameState } from "@/types/game";
import { PX_PER_CM_BASE } from "@/constants/units";
import type { FloorInfo, FloorLinkInfo } from "@/components/game/FloorHUD";

const LINK_ICONS: Record<string, string> = {
  corridor: "🚪", portal: "🌀", ramp: "📐", pit: "⬇️", trampoline: "⬆️",
};

interface MinimapProps {
  gameState: ServerGameState | null;
  beyblades: Map<string, ServerBeyblade>;
  selfId?: string | null;
  sizeRem?: number;
  viewportCm?: { x: number; y: number; w: number; h: number } | null;
  floorInfo?: FloorInfo[];
  myFloorIndex?: number;
}

export function Minimap({ gameState, beyblades, selfId, sizeRem = 12, viewportCm, floorInfo = [], myFloorIndex = 0 }: MinimapProps) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<"top" | "side">("top");

  // M key toggles minimap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "m" || e.key === "M") && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        setVisible(v => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const arena = gameState?.arena;
  if (!arena) return null;
  if (!visible) {
    return (
      <div
        aria-label="Press M to open minimap"
        title="Press M — minimap"
        style={{
          position: "absolute", top: "1rem", left: "1rem",
          fontSize: 10, color: "rgba(180,200,220,0.5)",
          pointerEvents: "none", zIndex: 40, userSelect: "none",
        }}
      >
        M — minimap
      </div>
    );
  }

  const hasFloors = floorInfo.length > 1;
  const px = sizeRem * 16;

  return (
    <div
      aria-label="Arena minimap"
      style={{
        position: "absolute", top: "1rem", left: "1rem",
        width: px, background: "rgba(10,14,28,0.92)",
        border: "1px solid rgba(120,160,200,0.4)",
        borderRadius: 8, backdropFilter: "blur(4px)",
        zIndex: 40, overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(120,160,200,0.2)" }}>
        {(["top", ...(hasFloors ? ["side"] : [])] as ("top" | "side")[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "4px 0", fontSize: 10, fontWeight: 600,
              background: tab === t ? "rgba(68,136,204,0.25)" : "transparent",
              color: tab === t ? "#7ab8f5" : "rgba(120,160,200,0.6)",
              border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em",
            }}
          >
            {t === "top" ? "Top" : "Side"}
          </button>
        ))}
        <button
          onClick={() => setVisible(false)}
          style={{ padding: "4px 8px", background: "transparent", border: "none", color: "rgba(120,160,200,0.5)", cursor: "pointer", fontSize: 11 }}
          title="Close minimap (M)"
        >×</button>
      </div>

      {tab === "top" && <TopView arena={arena} beyblades={beyblades} selfId={selfId} viewportCm={viewportCm} sizeRem={sizeRem} myFloorIndex={myFloorIndex} floorInfo={floorInfo} />}
      {tab === "side" && hasFloors && <SideView floorInfo={floorInfo} myFloorIndex={myFloorIndex} beyblades={beyblades} selfId={selfId} px={px} arenaWidthPx={arena.width} />}
    </div>
  );
}

// ─── Top View ─────────────────────────────────────────────────────────────────

function TopView({ arena, beyblades, selfId, viewportCm, sizeRem, myFloorIndex, floorInfo }: {
  arena: NonNullable<ServerGameState["arena"]>;
  beyblades: Map<string, ServerBeyblade>;
  selfId?: string | null;
  viewportCm?: { x: number; y: number; w: number; h: number } | null;
  sizeRem: number;
  myFloorIndex: number;
  floorInfo: FloorInfo[];
}) {
  const widthCm = arena.width / PX_PER_CM_BASE;
  const heightCm = arena.height / PX_PER_CM_BASE;
  const PHYSICS = 16;
  const physCenterX = (arena.width * PHYSICS) / 2;
  const physCenterY = (arena.height * PHYSICS) / 2;
  const cmFromPhys = (p: number, half: number) => (p - half) / (PX_PER_CM_BASE * PHYSICS);

  const vbX = -widthCm / 2, vbY = -heightCm / 2;

  const beyDots: Array<{ id: string; cx: number; cy: number; color: string; alive: boolean }> = [];
  beyblades.forEach((b, id) => {
    beyDots.push({
      id,
      cx: cmFromPhys(b.x, physCenterX),
      cy: cmFromPhys(b.y, physCenterY),
      color: id === selfId ? "#ffcc44" : (b.isAI ? "#ff5555" : "#55aaff"),
      alive: b.isActive,
    });
  });

  // Rotation indicator for current floor
  const myFloor = floorInfo[myFloorIndex];
  const rotDir = myFloor?.rotationDirection;
  const rotSpeed = myFloor?.rotationSpeedDegPerSec ?? 0;

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`${vbX} ${vbY} ${widthCm} ${heightCm}`}
        width="100%"
        height={`${sizeRem}rem`}
        preserveAspectRatio="xMidYMid meet"
      >
        {arena.shape === "circle" ? (
          <circle cx={0} cy={0} r={Math.min(widthCm, heightCm) / 2 - 1} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, widthCm / 200)} />
        ) : (
          <rect x={vbX} y={vbY} width={widthCm} height={heightCm} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, widthCm / 200)} />
        )}

        {beyDots.map((d) => (
          <circle key={d.id} cx={d.cx} cy={d.cy} r={Math.max(1.5, widthCm / 60)} fill={d.color} opacity={d.alive ? 1 : 0.3} />
        ))}

        {viewportCm && (
          <rect x={viewportCm.x} y={viewportCm.y} width={viewportCm.w} height={viewportCm.h}
            fill="none" stroke="#ffcc44" strokeWidth={Math.max(0.6, widthCm / 150)}
            strokeDasharray={`${widthCm / 80} ${widthCm / 160}`} opacity={0.85} />
        )}
      </svg>
      {rotDir && rotSpeed > 0 && (
        <div style={{ textAlign: "center", fontSize: 10, color: "rgba(120,160,200,0.7)", paddingBottom: 4 }}>
          {rotDir === "cw" ? "↻" : "↺"} {rotSpeed}°/s
        </div>
      )}
    </div>
  );
}

// ─── Side View ────────────────────────────────────────────────────────────────

function SideView({ floorInfo, myFloorIndex, beyblades, selfId, px, arenaWidthPx }: {
  floorInfo: FloorInfo[];
  myFloorIndex: number;
  beyblades: Map<string, ServerBeyblade>;
  selfId?: string | null;
  px: number;
  arenaWidthPx: number;
}) {
  const floorH = 32;
  const gap = 16;
  const padV = 8;
  const totalH = padV * 2 + floorInfo.length * floorH + (floorInfo.length - 1) * gap;
  const W = px - 4;

  // Bey x comes from Matter.js physics which scales pixels by 16x
  const PHYSICS = 16;
  const physWidth = arenaWidthPx * PHYSICS;
  const physCenterX = physWidth / 2;

  const beysByFloor = new Map<number, Array<{ id: string; xFrac: number; color: string; alive: boolean }>>();
  beyblades.forEach((b, id) => {
    const fi = (b as any).floorIndex ?? 0;
    if (!beysByFloor.has(fi)) beysByFloor.set(fi, []);
    const xFrac = Math.max(0, Math.min(1, (b.x - physCenterX) / physWidth + 0.5));
    beysByFloor.get(fi)!.push({
      id,
      xFrac,
      color: id === selfId ? "#ffcc44" : (b.isAI ? "#ff5555" : "#55aaff"),
      alive: b.isActive,
    });
  });

  return (
    <svg width="100%" height={totalH} viewBox={`0 0 ${W} ${totalH}`}>
      {floorInfo.slice().reverse().map((floor, revIdx) => {
        const fi = floorInfo.length - 1 - revIdx; // actual floor index (ground=0 at bottom)
        const y = padV + revIdx * (floorH + gap);
        const isActive = fi === myFloorIndex;

        const upLinks = floor.links.filter(l => l.direction === "up");
        const downLinks = floor.links.filter(l => l.direction === "down");

        return (
          <g key={fi}>
            {/* Floor bar */}
            <rect x={0} y={y} width={W} height={floorH}
              fill={isActive ? "rgba(68,136,204,0.25)" : "rgba(40,55,80,0.4)"}
              stroke={isActive ? "#4488cc" : "rgba(80,100,130,0.5)"}
              strokeWidth={isActive ? 1.5 : 0.8}
              rx={4}
            />
            {/* Floor label */}
            <text x={6} y={y + floorH / 2 + 1} fontSize={9} fill={isActive ? "#7ab8f5" : "rgba(120,160,200,0.7)"} dominantBaseline="middle">
              {floor.arenaName ?? `Floor ${fi}`}
            </text>
            {/* Rotation badge */}
            {floor.rotationDirection && (
              <text x={W - 6} y={y + floorH / 2 + 1} fontSize={10} fill="rgba(180,200,220,0.6)" dominantBaseline="middle" textAnchor="end">
                {floor.rotationDirection === "cw" ? "↻" : "↺"}
              </text>
            )}
            {/* Bey dots */}
            {(beysByFloor.get(fi) ?? []).map((d) => (
              <circle key={d.id}
                cx={Math.max(8, Math.min(W - 8, d.xFrac * W))}
                cy={y + floorH / 2}
                r={4}
                fill={d.color}
                opacity={d.alive ? 1 : 0.35}
              />
            ))}
            {/* Up-links: shown in the gap ABOVE this floor bar (between revIdx-1 and revIdx) */}
            {upLinks.length > 0 && revIdx > 0 && upLinks.map((lk, li) => {
              const gapTop = y - gap;
              const lx = 12 + li * 18;
              const statusColor = lk.status === "aligned" ? "#4ade80" : lk.status === "near" ? "#facc15" : lk.status === "severed" ? "#475569" : "#f87171";
              return (
                <g key={li}>
                  <line x1={W / 2} y1={gapTop} x2={W / 2} y2={gapTop + gap} stroke={statusColor} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                  <text x={lx} y={gapTop + gap / 2} fontSize={9} dominantBaseline="middle" textAnchor="middle">{LINK_ICONS[lk.linkType] ?? "?"}</text>
                </g>
              );
            })}
            {/* Down-links: shown in the gap BELOW this floor bar (between revIdx and revIdx+1) */}
            {downLinks.length > 0 && revIdx < floorInfo.length - 1 && downLinks.map((lk, li) => {
              const gapTop = y + floorH;
              const lx = W - 12 - li * 18;
              const statusColor = lk.status === "aligned" ? "#4ade80" : lk.status === "near" ? "#facc15" : lk.status === "severed" ? "#475569" : "#f87171";
              return (
                <g key={`d${li}`}>
                  <line x1={W / 2} y1={gapTop} x2={W / 2} y2={gapTop + gap} stroke={statusColor} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                  <text x={lx} y={gapTop + gap / 2} fontSize={9} dominantBaseline="middle" textAnchor="middle">{LINK_ICONS[lk.linkType] ?? "?"}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
