// Minimap — top-left overlay. Three tabs: Top (bird's-eye), Side (floor stack), Perspective (isometric).
// Phase 27: ALL beyblade rendering reads ONLY from beyGhosts (never state.beyblades).
// Toggle visibility with the M key.

import React, { useState, useEffect } from "react";
import type { ServerBeyGhost, ServerGameState } from "@/types/game";
import { PX_PER_CM_BASE } from "@/constants/units";
import type { FloorInfo } from "@/components/game/FloorHUD";

const LINK_ICONS: Record<string, string> = {
  corridor: "🚪", portal: "🌀", ramp: "📐", pit: "⬇️", trampoline: "⬆️",
};

// Tier colour: 2=full (yellow/blue), 1=faded gray, 0=dim dot
function tierColor(ghost: ServerBeyGhost, selfId?: string | null): string {
  if (ghost.id === selfId) return "#ffcc44";
  if (ghost.tier === 0) return "rgba(120,140,160,0.4)";
  if (ghost.tier === 1) return "rgba(100,120,180,0.55)";
  return ghost.beyType === "attack" ? "#ff6655"
    : ghost.beyType === "defense" ? "#4488ff"
    : ghost.beyType === "stamina" ? "#44dd88"
    : "#88ccff";
}

interface MinimapProps {
  gameState: ServerGameState | null;
  /** Phase 27: all bey rendering reads ONLY from beyGhosts. */
  beyGhosts?: Map<string, ServerBeyGhost>;
  selfId?: string | null;
  sizeRem?: number;
  viewportCm?: { x: number; y: number; w: number; h: number } | null;
  floorInfo?: FloorInfo[];
  myFloorIndex?: number;
}

export function Minimap({ gameState, beyGhosts, selfId, sizeRem = 12, viewportCm, floorInfo = [], myFloorIndex = 0 }: MinimapProps) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<"top" | "side" | "perspective">("top");

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

  const ghosts = beyGhosts ?? new Map<string, ServerBeyGhost>();

  if (!visible) {
    return (
      <div
        aria-label="Press M to open minimap"
        title="Press M — minimap"
        className="absolute top-4 left-4 text-[10px] text-[rgba(180,200,220,0.5)] pointer-events-none z-40 select-none"
      >
        M — minimap
      </div>
    );
  }

  const hasFloors = floorInfo.length > 1;
  const px = sizeRem * 16;
  const tabs: Array<"top" | "side" | "perspective"> = [
    "top",
    ...(hasFloors ? ["side" as const] : []),
    "perspective",
  ];

  return (
    <div
      aria-label="Arena minimap"
      className="absolute top-4 left-4 bg-[rgba(10,14,28,0.92)] border border-[rgba(120,160,200,0.4)] rounded-lg backdrop-blur z-40 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)] w-[--mpx]"
      style={{ "--mpx": `${px}px` } as React.CSSProperties}
    >
      {/* Tab bar */}
      <div className="flex border-b border-[rgba(120,160,200,0.2)]">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "flex-1 py-1 text-[10px] font-semibold border-none cursor-pointer uppercase tracking-[0.04em] " +
              (tab === t
                ? "bg-[rgba(68,136,204,0.25)] text-[#7ab8f5]"
                : "bg-transparent text-[rgba(120,160,200,0.6)]")
            }
          >
            {t === "top" ? "Top" : t === "side" ? "Side" : "3D"}
          </button>
        ))}
        <button
          onClick={() => setVisible(false)}
          className="px-2 py-1 bg-transparent border-none text-[rgba(120,160,200,0.5)] cursor-pointer text-[11px]"
          title="Close minimap (M)"
        >×</button>
      </div>

      {tab === "top" && <TopView arena={arena} ghosts={ghosts} selfId={selfId} viewportCm={viewportCm} sizeRem={sizeRem} myFloorIndex={myFloorIndex} floorInfo={floorInfo} />}
      {tab === "side" && hasFloors && <SideView floorInfo={floorInfo} myFloorIndex={myFloorIndex} ghosts={ghosts} selfId={selfId} px={px} arenaWidthCm={arena.width / PX_PER_CM_BASE} />}
      {tab === "perspective" && <PerspectiveView arena={arena} ghosts={ghosts} selfId={selfId} sizeRem={sizeRem} />}
    </div>
  );
}

// ─── Top View ─────────────────────────────────────────────────────────────────

function TopView({ arena, ghosts, selfId, viewportCm, sizeRem, myFloorIndex, floorInfo }: {
  arena: NonNullable<ServerGameState["arena"]>;
  ghosts: Map<string, ServerBeyGhost>;
  selfId?: string | null;
  viewportCm?: { x: number; y: number; w: number; h: number } | null;
  sizeRem: number;
  myFloorIndex: number;
  floorInfo: FloorInfo[];
}) {
  const widthCm  = arena.width  / PX_PER_CM_BASE;
  const heightCm = arena.height / PX_PER_CM_BASE;
  const vbX = -widthCm / 2, vbY = -heightCm / 2;

  // x_cm / y_cm from BeyGhostState are already cm relative to physics centre
  const dotR = Math.max(1.5, widthCm / 60);

  const myFloor = floorInfo[myFloorIndex];
  const rotDir   = myFloor?.rotationDirection;
  const rotSpeed = myFloor?.rotationSpeedDegPerSec ?? 0;

  return (
    <div className="w-full">
      <svg viewBox={`${vbX} ${vbY} ${widthCm} ${heightCm}`} width="100%" height={`${sizeRem}rem`} preserveAspectRatio="xMidYMid meet">
        {arena.shape === "circle" ? (
          <circle cx={0} cy={0} r={Math.min(widthCm, heightCm) / 2 - 1} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, widthCm / 200)} />
        ) : (
          <rect x={vbX} y={vbY} width={widthCm} height={heightCm} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, widthCm / 200)} />
        )}

        {Array.from(ghosts.values()).map(g => (
          <circle
            key={g.id}
            cx={g.x_cm}
            cy={g.y_cm}
            r={g.tier === 0 ? dotR * 0.5 : dotR}
            fill={tierColor(g, selfId)}
            opacity={g.tier === 0 ? 0.4 : 1}
          />
        ))}

        {viewportCm && (
          <rect x={viewportCm.x} y={viewportCm.y} width={viewportCm.w} height={viewportCm.h}
            fill="none" stroke="#ffcc44" strokeWidth={Math.max(0.6, widthCm / 150)}
            strokeDasharray={`${widthCm / 80} ${widthCm / 160}`} opacity={0.85} />
        )}
      </svg>
      {rotDir && rotSpeed > 0 && (
        <div className="text-center text-[10px] text-[rgba(120,160,200,0.7)] pb-1">
          {rotDir === "cw" ? "↻" : "↺"} {rotSpeed}°/s
        </div>
      )}
    </div>
  );
}

// ─── Side View ────────────────────────────────────────────────────────────────

function SideView({ floorInfo, myFloorIndex, ghosts, selfId, px, arenaWidthCm }: {
  floorInfo: FloorInfo[];
  myFloorIndex: number;
  ghosts: Map<string, ServerBeyGhost>;
  selfId?: string | null;
  px: number;
  arenaWidthCm: number;
}) {
  const floorH = 32, gap = 16, padV = 8;
  const totalH = padV * 2 + floorInfo.length * floorH + (floorInfo.length - 1) * gap;
  const W = px - 4;

  const beysByFloor = new Map<number, Array<{ id: string; xFrac: number; color: string; spinPct: number }>>();
  ghosts.forEach((g, id) => {
    const fi = g.floorIndex ?? 0;
    if (!beysByFloor.has(fi)) beysByFloor.set(fi, []);
    const xFrac = Math.max(0, Math.min(1, g.x_cm / arenaWidthCm + 0.5));
    beysByFloor.get(fi)!.push({ id, xFrac, color: tierColor(g, selfId), spinPct: g.spin_pct });
  });

  return (
    <svg width="100%" height={totalH} viewBox={`0 0 ${W} ${totalH}`}>
      {floorInfo.slice().reverse().map((floor, revIdx) => {
        const fi = floorInfo.length - 1 - revIdx;
        const y = padV + revIdx * (floorH + gap);
        const isActive = fi === myFloorIndex;
        const upLinks   = floor.links.filter(l => l.direction === "up");
        const downLinks = floor.links.filter(l => l.direction === "down");
        return (
          <g key={fi}>
            <rect x={0} y={y} width={W} height={floorH}
              fill={isActive ? "rgba(68,136,204,0.25)" : "rgba(40,55,80,0.4)"}
              stroke={isActive ? "#4488cc" : "rgba(80,100,130,0.5)"}
              strokeWidth={isActive ? 1.5 : 0.8} rx={4} />
            <text x={6} y={y + floorH / 2 + 1} fontSize={9} fill={isActive ? "#7ab8f5" : "rgba(120,160,200,0.7)"} dominantBaseline="middle">
              {floor.arenaName ?? `Floor ${fi}`}
            </text>
            {floor.rotationDirection && (
              <text x={W - 6} y={y + floorH / 2 + 1} fontSize={10} fill="rgba(180,200,220,0.6)" dominantBaseline="middle" textAnchor="end">
                {floor.rotationDirection === "cw" ? "↻" : "↺"}
              </text>
            )}
            {(beysByFloor.get(fi) ?? []).map((d) => (
              <circle key={d.id}
                cx={Math.max(8, Math.min(W - 8, d.xFrac * W))}
                cy={y + floorH / 2} r={4}
                fill={d.color} opacity={d.spinPct > 0 ? 1 : 0.35} />
            ))}
            {upLinks.length > 0 && revIdx > 0 && upLinks.map((lk, li) => {
              const gapTop = y - gap;
              const lx = 12 + li * 18;
              const sc = lk.status === "aligned" ? "#4ade80" : lk.status === "near" ? "#facc15" : lk.status === "severed" ? "#475569" : "#f87171";
              return (
                <g key={li}>
                  <line x1={W / 2} y1={gapTop} x2={W / 2} y2={gapTop + gap} stroke={sc} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                  <text x={lx} y={gapTop + gap / 2} fontSize={9} dominantBaseline="middle" textAnchor="middle">{LINK_ICONS[lk.linkType] ?? "?"}</text>
                </g>
              );
            })}
            {downLinks.length > 0 && revIdx < floorInfo.length - 1 && downLinks.map((lk, li) => {
              const gapTop = y + floorH;
              const lx = W - 12 - li * 18;
              const sc = lk.status === "aligned" ? "#4ade80" : lk.status === "near" ? "#facc15" : lk.status === "severed" ? "#475569" : "#f87171";
              return (
                <g key={`d${li}`}>
                  <line x1={W / 2} y1={gapTop} x2={W / 2} y2={gapTop + gap} stroke={sc} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
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

// ─── Perspective View (isometric) ─────────────────────────────────────────────
// Simple CSS-transform isometric projection: rotate -45°, scaleY 0.5.

function PerspectiveView({ arena, ghosts, selfId, sizeRem }: {
  arena: NonNullable<ServerGameState["arena"]>;
  ghosts: Map<string, ServerBeyGhost>;
  selfId?: string | null;
  sizeRem: number;
}) {
  const widthCm  = arena.width  / PX_PER_CM_BASE;
  const heightCm = arena.height / PX_PER_CM_BASE;
  const SCALE = (sizeRem * 16) / Math.max(widthCm, heightCm) * 0.85;

  const ISO_SKEW   = "rotateX(55deg) rotateZ(-45deg)";
  const containerW = sizeRem * 16;
  const containerH = sizeRem * 16;

  return (
    <div className="overflow-hidden relative bg-[rgba(10,15,25,0.6)] w-[--pcw] h-[--pch]" style={{ "--pcw": `${containerW}px`, "--pch": `${containerH}px` } as React.CSSProperties}>
      <div className="absolute" style={{ top: "50%", left: "50%", transform: `translate(-50%,-50%) ${ISO_SKEW}` }}>
        {/* Arena floor */}
        <div
          className={`border border-[rgba(68,136,204,0.5)] relative w-[--afw] h-[--afh] ${arena.shape === "circle" ? "rounded-full bg-[radial-gradient(circle,rgba(30,50,80,0.85)_70%,transparent_100%)]" : "rounded bg-[rgba(30,50,80,0.85)]"}`}
          style={{ "--afw": `${widthCm * SCALE}px`, "--afh": `${heightCm * SCALE}px` } as React.CSSProperties}
        >
          {Array.from(ghosts.values()).map(g => {
            const cx = (g.x_cm + widthCm / 2) * SCALE;
            const cy = (g.y_cm + heightCm / 2) * SCALE;
            const dotR = g.tier === 0 ? 3 : 5;
            return (
              <div key={g.id}
                className={`absolute rounded-full bg-[color:var(--gc)] w-[--dsize] h-[--dsize] ${g.id === selfId ? "shadow-[0_0_6px_2px_rgba(255,200,50,0.7)]" : ""}`}
                style={{
                  "--gc": tierColor(g, selfId),
                  "--dsize": `${dotR * 2}px`,
                  left: cx - dotR,
                  top: cy - dotR,
                  opacity: g.tier === 0 ? 0.4 : 1,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
