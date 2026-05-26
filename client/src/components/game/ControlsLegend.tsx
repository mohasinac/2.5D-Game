// ControlsLegend — persistent in-game key-map overlay (bottom-left).
// Replaces inaccurate "mouse supported" copy with the real keyboard map.
// See plan: Part 8.

import { useEffect, useState } from "react";

const STORAGE_KEY = "beyblade.controlsLegend.hidden";

interface ControlsLegendProps {
  /** Optional override of default show state. */
  initiallyHidden?: boolean;
  /** When non-empty, show a "LOCKED" badge with the lock source (special / combo). */
  lockSource?: string;
  /** When set, the bey is in a loss-of-control window until this Date.now() value. */
  controlLockedUntilMs?: number;
  /** Set to true in tryout/solo mode to hide battle-only action keys. */
  isTryout?: boolean;
}

export function ControlsLegend({ initiallyHidden, lockSource, controlLockedUntilMs, isTryout }: ControlsLegendProps) {
  // Recompute "is locked" without rerendering on every frame — once per 100ms is enough.
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 100);
    return () => clearInterval(id);
  }, []);
  const locked = !!controlLockedUntilMs && controlLockedUntilMs > nowMs;
  const [hidden, setHidden] = useState<boolean>(() => {
    if (typeof window === "undefined") return Boolean(initiallyHidden);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
    return Boolean(initiallyHidden);
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, hidden ? "1" : "0"); } catch { /* ignore */ }
  }, [hidden]);

  const row = (k: string, v: string) => (
    <div className="flex justify-between gap-[1.2rem]">
      <span className="text-[#9bb] font-mono">{k}</span>
      <span className="text-[#dde]">{v}</span>
    </div>
  );

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        aria-label="Show controls"
        title="Show controls"
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: 40,
        }}
        className="px-[0.7rem] py-[0.35rem] text-[0.7rem] font-mono bg-[rgba(20,25,40,0.75)] text-[#9bb] border border-[rgba(120,160,200,0.3)] rounded-[0.4rem] cursor-pointer pointer-events-auto"
      >
        Controls ▸
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        zIndex: 40,
      }}
      className="px-[0.8rem] py-[0.6rem] text-[0.7rem] font-mono bg-[rgba(20,25,40,0.8)] text-[#dde] border border-[rgba(120,160,200,0.3)] rounded-[0.5rem] backdrop-blur-sm min-w-[11rem] pointer-events-auto"
    >
      <div className="flex justify-between mb-[0.35rem] items-center">
        <strong className="text-[0.7rem] text-[#cfe]">CONTROLS</strong>
        {locked && (
          <span
            title={lockSource === "combo" ? "Combo executing" : "Special move executing"}
            className="text-[0.6rem] font-bold text-[#ffcc44] bg-[rgba(255,80,40,0.25)] border border-[rgba(255,80,40,0.6)] rounded-[0.25rem] px-[0.35rem] py-[0.1rem] tracking-[0.05em]"
          >LOCKED</span>
        )}
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="Hide controls"
          title="Hide controls"
          className="bg-transparent text-[#9bb] border-none cursor-pointer text-[0.75rem]"
        >×</button>
      </div>
      {row("WASD / ←↑↓→", "Move")}
      {row("Space (hold)", "Charge spin")}
      {row("+ / − / 0", "Zoom")}
      {!isTryout && (
        <>
          {row("I", "Jump")}
          {row("J", "Attack / Aggressive")}
          {row("K", "Defense / Defensive")}
          {row("L", "Dodge / Stamina")}
          {row("Space (tap)", "Special move")}
          {row("Right-drag", "Directional nudge")}
        </>
      )}
      {isTryout && (
        <div className="mt-[0.3rem] text-[0.6rem] text-[#889] italic">
          Combat keys (IJKL) available in battle mode
        </div>
      )}
    </div>
  );
}
