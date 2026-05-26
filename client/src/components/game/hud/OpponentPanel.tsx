import React, { useEffect, useRef, useState } from "react";
import type { ServerBeyGhost } from "@/types/game";
import { TYPE_HEX, TYPE_LABEL, SpinWheel } from "./PlayerPanel";
import { SPBar } from "./SPBar";

interface OpponentPanelProps {
  myId: string;
  myTeamId?: string;
  beyGhosts?: Map<string, ServerBeyGhost>;
  maxVisible?: number;
}

interface OpponentEntry {
  id: string;
  username: string;
  beyType: string;
  spinPct: number;
  tier: number;
  dist: number;
  isAlly: boolean;
}

function spinBarClass(pct: number): string {
  if (pct >= 75) return "bg-theme-green";
  if (pct >= 40) return "bg-theme-yellow";
  return "bg-theme-red";
}

function spinTextClass(pct: number): string {
  if (pct >= 75) return "text-theme-green";
  if (pct >= 40) return "text-theme-yellow";
  return "text-theme-red";
}

// ── Full corner card (mirror of player — for 1v1 opponent) ───────────────────
function FeaturedOpponentCard({ op }: { op: OpponentEntry }) {
  const hex = TYPE_HEX[op.beyType] ?? "#aabbcc";
  const label = TYPE_LABEL[op.beyType] ?? "—";

  return (
    <div
      className="hud-type-border border-l border-b rounded-bl-2xl backdrop-blur-md bg-[rgba(5,8,20,0.90)] flex flex-col items-end gap-1.5 pt-2 pb-3 pr-2 pl-4"
      style={{ "--tc": hex } as React.CSSProperties}
    >
      {/* Arc wheel — mirrored for right side */}
      <SpinWheel spinPct={op.spinPct} side="right" />

      {/* Name + type badge */}
      <div className="flex items-center gap-2 w-full px-1 flex-row-reverse">
        <span className="text-white font-bold text-[0.72rem] font-mono tracking-wider truncate flex-1 uppercase text-right">
          {op.username}
        </span>
        <span
          className="hud-type-text text-[0.5rem] font-black tracking-[0.15em] shrink-0 border hud-type-border rounded px-1 py-px"
        >
          {label}
        </span>
      </div>

      {/* Stamina bar — reversed fill direction */}
      <div className="w-full px-1">
        <div className="flex flex-col gap-1 w-full font-mono">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[0.5rem] tracking-widest text-white/40 uppercase">STAMINA</span>
            <span className={`text-[0.55rem] font-bold ${spinTextClass(op.spinPct)}`}>
              {op.spinPct}%
            </span>
          </div>
          {/* Bar fills from right to left */}
          <div className="h-[8px] rounded-full bg-white/10 overflow-hidden flex flex-row-reverse">
            <div
              className={`w-pct h-full rounded-full transition-[width] duration-150 ${spinBarClass(op.spinPct)}`}
              style={{ "--pct": `${op.spinPct}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Compact card (2-3 opponents) ─────────────────────────────────────────────
function CompactOpponentCard({ op }: { op: OpponentEntry }) {
  const hex = TYPE_HEX[op.beyType] ?? "#aabbcc";
  const label = TYPE_LABEL[op.beyType] ?? "—";

  return (
    <div
      className={`hud-type-border rounded-lg px-2.5 py-2 backdrop-blur-md flex items-center gap-2 border ${op.isAlly ? "bg-[rgba(8,28,20,0.82)]" : "bg-[rgba(8,12,26,0.85)]"}`}
      style={{ "--tc": hex } as React.CSSProperties}
    >
      {/* Type badge */}
      <span className="hud-type-text text-[0.46rem] font-black tracking-wide shrink-0">{label}</span>

      {/* Spin bar */}
      <div className="flex-1 min-w-0">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`w-pct h-full rounded-full ${spinBarClass(op.spinPct)}`}
            style={{ "--pct": `${op.spinPct}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Name */}
      <span className="text-white/80 text-[0.6rem] font-mono truncate max-w-[72px] shrink-0">
        {op.username}
      </span>

      {/* Pct */}
      <span className={`text-[0.5rem] font-bold font-mono shrink-0 ${spinTextClass(op.spinPct)}`}>
        {op.spinPct}%
      </span>
    </div>
  );
}

// ── Ultra-compact single-line row (4+ opponents / royale) ────────────────────
function UltraCompactRow({ op }: { op: OpponentEntry }) {
  const hex = TYPE_HEX[op.beyType] ?? "#aabbcc";

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(5,8,20,0.78)] rounded-md border hud-type-border"
      style={{ "--tc": hex } as React.CSSProperties}
    >
      <span className="hud-type-dot w-1.5 h-1.5 rounded-full shrink-0" />
      <span className="text-white/70 text-[0.55rem] font-mono truncate flex-1 min-w-0">{op.username}</span>
      <div className="w-10 h-1 rounded-full bg-white/10 overflow-hidden shrink-0">
        <div
          className={`w-pct h-full rounded-full ${spinBarClass(op.spinPct)}`}
          style={{ "--pct": `${op.spinPct}%` } as React.CSSProperties}
        />
      </div>
      <span className={`text-[0.48rem] font-mono font-bold shrink-0 ${spinTextClass(op.spinPct)}`}>
        {op.spinPct}%
      </span>
    </div>
  );
}

export function OpponentPanel({ myId, myTeamId = "", beyGhosts, maxVisible = 8 }: OpponentPanelProps) {
  const [entries, setEntries] = useState<OpponentEntry[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!beyGhosts) return;
    tickRef.current += 1;
    if (tickRef.current < 10) return;
    tickRef.current = 0;

    const me = beyGhosts.get(myId) ?? null;
    const list: OpponentEntry[] = [];

    beyGhosts.forEach((ghost, id) => {
      if (id === myId) return;
      const dx = me ? ghost.x_cm - me.x_cm : 0;
      const dy = me ? ghost.y_cm - me.y_cm : 0;
      list.push({
        id,
        username: ghost.username,
        beyType: ghost.beyType,
        spinPct: ghost.spin_pct,
        tier: ghost.tier,
        dist: me ? Math.sqrt(dx * dx + dy * dy) : 0,
        isAlly: myTeamId !== "" && ghost.teamId === myTeamId,
      });
    });

    list.sort((a, b) => {
      if (a.isAlly !== b.isAlly) return a.isAlly ? -1 : 1;
      return a.dist - b.dist;
    });

    setEntries(list.slice(0, maxVisible));
  });

  if (entries.length === 0) return null;

  const allies = entries.filter(e => e.isAlly);
  const enemies = entries.filter(e => !e.isAlly);
  const hasTeams = allies.length > 0;
  const totalCount = entries.length;

  // Render strategy based on count
  const renderEnemy = (op: OpponentEntry) => {
    if (totalCount === 1) return <FeaturedOpponentCard key={op.id} op={op} />;
    if (totalCount <= 3) return <CompactOpponentCard key={op.id} op={op} />;
    return <UltraCompactRow key={op.id} op={op} />;
  };

  const renderAlly = (op: OpponentEntry) => {
    if (totalCount <= 3) return <CompactOpponentCard key={op.id} op={op} />;
    return <UltraCompactRow key={op.id} op={op} />;
  };

  // For 1v1: the featured card fills the top-right corner (no padding/gap wrapper)
  if (totalCount === 1 && enemies.length === 1) {
    return (
      <div className="absolute top-0 right-0 z-50 pointer-events-none">
        <FeaturedOpponentCard op={enemies[0]} />
      </div>
    );
  }

  return (
    <div
      className="absolute top-3 right-3 z-50 pointer-events-none flex flex-col gap-1 min-w-[170px] max-w-[220px]"
    >
      {hasTeams && enemies.length > 0 && (
        <span className="text-[0.44rem] tracking-[0.18em] text-white/30 uppercase px-0.5">Enemies</span>
      )}
      {enemies.map(renderEnemy)}

      {hasTeams && allies.length > 0 && (
        <>
          <span className="text-[0.44rem] tracking-[0.18em] text-white/30 uppercase px-0.5 mt-1">Allies</span>
          {allies.map(renderAlly)}
        </>
      )}
    </div>
  );
}
