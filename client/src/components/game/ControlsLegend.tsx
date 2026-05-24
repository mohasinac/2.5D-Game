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
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1.2rem" }}>
      <span style={{ color: "#9bb", fontFamily: "monospace" }}>{k}</span>
      <span style={{ color: "#dde" }}>{v}</span>
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
          padding: "0.35rem 0.7rem",
          fontSize: "0.7rem",
          fontFamily: "monospace",
          background: "rgba(20,25,40,0.75)",
          color: "#9bb",
          border: "1px solid rgba(120,160,200,0.3)",
          borderRadius: "0.4rem",
          cursor: "pointer",
          pointerEvents: "auto",
          zIndex: 40,
        }}
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
        padding: "0.6rem 0.8rem",
        fontSize: "0.7rem",
        fontFamily: "monospace",
        background: "rgba(20,25,40,0.8)",
        color: "#dde",
        border: "1px solid rgba(120,160,200,0.3)",
        borderRadius: "0.5rem",
        backdropFilter: "blur(4px)",
        zIndex: 40,
        minWidth: "11rem",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", alignItems: "center" }}>
        <strong style={{ fontSize: "0.7rem", color: "#cfe" }}>CONTROLS</strong>
        {locked && (
          <span
            title={lockSource === "combo" ? "Combo executing" : "Special move executing"}
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "#ffcc44",
              background: "rgba(255, 80, 40, 0.25)",
              border: "1px solid rgba(255, 80, 40, 0.6)",
              borderRadius: "0.25rem",
              padding: "0.1rem 0.35rem",
              letterSpacing: "0.05em",
            }}
          >LOCKED</span>
        )}
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="Hide controls"
          title="Hide controls"
          style={{ background: "transparent", color: "#9bb", border: "none", cursor: "pointer", fontSize: "0.75rem" }}
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
        <div style={{ marginTop: "0.3rem", fontSize: "0.6rem", color: "#889", fontStyle: "italic" }}>
          Combat keys (IJKL) available in battle mode
        </div>
      )}
    </div>
  );
}
