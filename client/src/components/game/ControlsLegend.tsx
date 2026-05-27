// ControlsLegend — persistent in-game key-map overlay (bottom-left).
// Shows the current remapped key bindings from keyMap.ts.
// Updates automatically when the user remaps keys via KeyBindingsPanel.

import { useEffect, useState } from "react";
import { keyMapRef, loadKeyMap, keyCodeLabel, type KeyMap } from "@/game/hooks/keyMap";

const STORAGE_KEY = "beyblade.controlsLegend.hidden";

interface ControlsLegendProps {
  initiallyHidden?: boolean;
  lockSource?: string;
  controlLockedUntilMs?: number;
  isTryout?: boolean;
}

export function ControlsLegend({
  initiallyHidden,
  lockSource,
  controlLockedUntilMs,
  isTryout,
}: ControlsLegendProps) {
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 100);
    return () => clearInterval(id);
  }, []);
  const locked = !!controlLockedUntilMs && controlLockedUntilMs > nowMs;

  const [hidden, setHidden] = useState<boolean>(() => {
    if (typeof window === "undefined") return Boolean(initiallyHidden);
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (s === "1") return true;
    if (s === "0") return false;
    return Boolean(initiallyHidden);
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, hidden ? "1" : "0"); } catch { /* ignore */ }
  }, [hidden]);

  // Reactively update when key bindings change
  const [km, setKm] = useState<KeyMap>(() => ({ ...keyMapRef.current }));
  useEffect(() => {
    const onChanged = () => setKm({ ...loadKeyMap() });
    window.addEventListener("beyblade:keymap:changed", onChanged);
    return () => window.removeEventListener("beyblade:keymap:changed", onChanged);
  }, []);

  const key = (code: string) => keyCodeLabel(code);

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
        className="absolute bottom-4 left-4 z-40 px-[0.7rem] py-[0.35rem] text-[0.7rem] font-mono bg-[rgba(20,25,40,0.75)] text-[#9bb] border border-[rgba(120,160,200,0.3)] rounded-[0.4rem] cursor-pointer pointer-events-auto"
      >
        Controls ▸
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-40 px-[0.8rem] py-[0.6rem] text-[0.7rem] font-mono bg-[rgba(20,25,40,0.8)] text-[#dde] border border-[rgba(120,160,200,0.3)] rounded-[0.5rem] backdrop-blur-sm min-w-[12rem] pointer-events-auto">
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
          className="bg-transparent text-[#9bb] border-none cursor-pointer text-[0.75rem]"
        >×</button>
      </div>

      {row(`${key(km.moveLeft)} / ${key(km.moveRight)} / ← →`, "Move")}
      {row(`${key(km.moveUp)} / ${key(km.moveDown)} / ↑ ↓`, "Move")}
      {row(key(km.charge), "Hold=Charge · Tap=Special")}
      {row("+ / − / 0", "Zoom")}

      {!isTryout && (
        <>
          {row(key(km.jump),    "Jump")}
          {row(key(km.attack),  "Attack / Aggressive")}
          {row(key(km.defense), "Defense / Defensive")}
          {row(key(km.dodge),   "Dodge / Stamina")}
          {row("Right-drag",    "Directional nudge")}
        </>
      )}

      {isTryout && (
        <div className="mt-[0.3rem] text-[0.6rem] text-[#889] italic">
          Combat keys available in battle mode
        </div>
      )}

      <div className="mt-[0.35rem] pt-[0.3rem] border-t border-white/10 text-[0.6rem] text-[#668]">
        ⌨ Touch controls · Remap: touch button
      </div>
    </div>
  );
}
