// ControlOverlay — floating repositionable touch controls.
// Buttons start in default GBA-style positions (percentages of screen area).
// Hold any button for 1.5s to enter drag mode, then drag to reposition.
// Positions are saved to localStorage under "bey.controlLayout.v1".
// Tap the "DRAG MODE" badge that appears to reset all positions to default.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { touchInputState } from "../../game/hooks/useGameInput";

const STORAGE_KEY = "bey.controlLayout.v1";

type ButtonId =
  | "dpad-up" | "dpad-down" | "dpad-left" | "dpad-right"
  | "btn-a" | "btn-b" | "btn-x" | "btn-y"
  | "shoulder-l" | "shoulder-r"
  | "select" | "start";

interface ButtonPos { x: number; y: number }  // percent of container
type Layout = Record<ButtonId, ButtonPos>;

const DEFAULT_LAYOUT: Layout = {
  "dpad-up":    { x: 10, y: 55 },
  "dpad-down":  { x: 10, y: 77 },
  "dpad-left":  { x: 4,  y: 66 },
  "dpad-right": { x: 17, y: 66 },
  "btn-a":      { x: 90, y: 60 },
  "btn-b":      { x: 83, y: 72 },
  "btn-x":      { x: 83, y: 50 },
  "btn-y":      { x: 76, y: 60 },
  "shoulder-l": { x: 4,  y: 42 },
  "shoulder-r": { x: 96, y: 42 },
  "select":     { x: 42, y: 88 },
  "start":      { x: 58, y: 88 },
};

function loadLayout(): Layout {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_LAYOUT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_LAYOUT };
}

function saveLayout(l: Layout) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(l)); } catch { /* ignore */ }
}

function vibrate(ms: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}

const ACTION_MAP: Record<ButtonId, { action: string; tap?: boolean }> = {
  "dpad-up":    { action: "moveUp"    },
  "dpad-down":  { action: "moveDown"  },
  "dpad-left":  { action: "moveLeft"  },
  "dpad-right": { action: "moveRight" },
  "btn-a":      { action: "attack"    },
  "btn-b":      { action: "defense"   },
  "btn-x":      { action: "dodge"     },
  "btn-y":      { action: "jump"      },
  "shoulder-l": { action: "chargeHeld" },
  "shoulder-r": { action: "specialTap", tap: true },
  "select":     { action: "specialTap", tap: true },
  "start":      { action: "_noop"     },
};

function applyAction(id: ButtonId, active: boolean) {
  const { action, tap } = ACTION_MAP[id];
  if (action === "_noop") return;
  if (action === "chargeHeld") { touchInputState.chargeHeld = active; return; }
  if (action === "specialTap") { if (active && tap) touchInputState.specialTap = true; return; }
  (touchInputState as Record<string, boolean>)[action] = active;
}

interface BtnConfig {
  id: ButtonId;
  label: string;
  color: string;
  size: number;
  shape: "circle" | "oval" | "shoulder";
}

const BUTTONS: BtnConfig[] = [
  { id: "dpad-up",    label: "▲", color: "#374151", size: 44, shape: "circle" },
  { id: "dpad-down",  label: "▼", color: "#374151", size: 44, shape: "circle" },
  { id: "dpad-left",  label: "◀", color: "#374151", size: 44, shape: "circle" },
  { id: "dpad-right", label: "▶", color: "#374151", size: 44, shape: "circle" },
  { id: "btn-a",      label: "A", color: "#dc2626", size: 46, shape: "circle" },
  { id: "btn-b",      label: "B", color: "#2563eb", size: 46, shape: "circle" },
  { id: "btn-x",      label: "X", color: "#b45309", size: 46, shape: "circle" },
  { id: "btn-y",      label: "Y", color: "#16a34a", size: 46, shape: "circle" },
  { id: "shoulder-l", label: "L", color: "#6b7280", size: 0, shape: "shoulder" },
  { id: "shoulder-r", label: "R", color: "#6b7280", size: 0, shape: "shoulder" },
  { id: "select",     label: "SELECT", color: "#1f2937", size: 0, shape: "oval" },
  { id: "start",      label: "START",  color: "#1f2937", size: 0, shape: "oval" },
];

interface OverlayButtonProps {
  cfg: BtnConfig;
  pos: ButtonPos;
  isDragging: boolean;
  unlocked: boolean;
  onHoldStart: (id: ButtonId, e: React.PointerEvent) => void;
  onDragMove: (id: ButtonId, e: React.PointerEvent) => void;
  onDragEnd: (id: ButtonId) => void;
  onActionPress: (id: ButtonId) => void;
  onActionRelease: (id: ButtonId) => void;
  onExitPress?: () => void;
}

function OverlayButton({
  cfg, pos, isDragging, unlocked,
  onHoldStart, onDragMove, onDragEnd,
  onActionPress, onActionRelease, onExitPress,
}: OverlayButtonProps) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingRef = useRef(false);
  const ptrId = useRef<number | null>(null);

  function clearHold() {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
    ptrId.current = e.pointerId;
    draggingRef.current = false;
    vibrate(15);

    if (unlocked) {
      draggingRef.current = true;
      onHoldStart(cfg.id, e);
      return;
    }

    onActionPress(cfg.id);

    holdTimer.current = setTimeout(() => {
      vibrate(40);
      draggingRef.current = true;
      onHoldStart(cfg.id, e);
    }, 1500);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerId !== ptrId.current) return;
    if (draggingRef.current) onDragMove(cfg.id, e);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerId !== ptrId.current) return;
    clearHold();
    ptrId.current = null;
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    if (!wasDragging) {
      onActionRelease(cfg.id);
      if (cfg.id === "start") onExitPress?.();
    }
    onDragEnd(cfg.id);
  }

  const ringStyle: React.CSSProperties = unlocked
    ? { outline: "2px solid rgba(139,92,246,0.75)", outlineOffset: 2 }
    : {};

  const shakeAnim: React.CSSProperties = isDragging
    ? { animation: "ctlovShake 0.15s ease-in-out infinite alternate" }
    : {};

  const base: React.CSSProperties = {
    position: "absolute",
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: "translate(-50%, -50%)",
    zIndex: isDragging ? 200 : 100,
    cursor: isDragging ? "grabbing" : unlocked ? "grab" : "pointer",
    touchAction: "none",
    userSelect: "none",
    pointerEvents: "auto",
    ...ringStyle,
    ...shakeAnim,
  };

  if (cfg.shape === "shoulder") {
    return (
      <div
        style={{
          ...base,
          width: 72, height: 24,
          background: `linear-gradient(180deg, ${cfg.color}cc 0%, ${cfg.color} 100%)`,
          borderRadius: cfg.id === "shoulder-l" ? "6px 6px 0 10px" : "6px 6px 10px 0",
          boxShadow: "0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
          border: "1px solid rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 800,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >{cfg.label}</div>
    );
  }

  if (cfg.shape === "oval") {
    return (
      <div
        style={{
          ...base,
          width: 52, height: 14, borderRadius: 7,
          background: "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
          border: "1px solid rgba(0,0,0,0.45)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.4)", fontSize: 7, fontWeight: 800,
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >{cfg.label}</div>
    );
  }

  // circle
  return (
    <div
      style={{
        ...base,
        width: cfg.size, height: cfg.size, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 35%, ${cfg.color}ee, ${cfg.color}99)`,
        border: `2px solid ${cfg.color}cc`,
        boxShadow: `0 4px 10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 900, fontSize: Math.round(cfg.size * 0.33),
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >{cfg.label}</div>
  );
}

export interface ControlOverlayProps {
  show25DRotate?: boolean;
  onExit?: () => void;
}

export function ControlOverlay({ onExit }: ControlOverlayProps) {
  const [layout, setLayout] = useState<Layout>(loadLayout);
  const [draggingId, setDraggingId] = useState<ButtonId | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{ ptrX: number; ptrY: number; btnX: number; btnY: number } | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const resetLayout = useCallback(() => {
    const fresh = { ...DEFAULT_LAYOUT };
    setLayout(fresh);
    saveLayout(fresh);
    setUnlocked(false);
    vibrate(30);
  }, []);

  // Auto-lock after 8s of no activity in drag mode
  useEffect(() => {
    if (!unlocked) return;
    const t = setTimeout(() => setUnlocked(false), 8000);
    return () => clearTimeout(t);
  }, [unlocked, draggingId]);

  function handleHoldStart(id: ButtonId, e: React.PointerEvent) {
    if (!containerRef.current) return;
    setUnlocked(true);
    setDraggingId(id);
    const rect = containerRef.current.getBoundingClientRect();
    dragOrigin.current = {
      ptrX: e.clientX,
      ptrY: e.clientY,
      btnX: layoutRef.current[id].x,
      btnY: layoutRef.current[id].y,
    };
    void rect; // accessed via getBoundingClientRect above
  }

  function handleDragMove(id: ButtonId, e: React.PointerEvent) {
    if (id !== draggingId || !dragOrigin.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragOrigin.current.ptrX) / rect.width)  * 100;
    const dy = ((e.clientY - dragOrigin.current.ptrY) / rect.height) * 100;
    const nx = Math.max(2, Math.min(98, dragOrigin.current.btnX + dx));
    const ny = Math.max(2, Math.min(98, dragOrigin.current.btnY + dy));
    setLayout(prev => ({ ...prev, [id]: { x: nx, y: ny } }));
  }

  function handleDragEnd(id: ButtonId) {
    if (id !== draggingId) return;
    setDraggingId(null);
    dragOrigin.current = null;
    saveLayout(layoutRef.current);
  }

  return (
    <>
      <style>{`
        @keyframes ctlovShake {
          from { transform: translate(-50%, -50%) rotate(-4deg) scale(1.05); }
          to   { transform: translate(-50%, -50%) rotate(4deg)  scale(1.05); }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          position: "fixed", inset: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {BUTTONS.map(cfg => (
          <OverlayButton
            key={cfg.id}
            cfg={cfg}
            pos={layout[cfg.id]}
            isDragging={draggingId === cfg.id}
            unlocked={unlocked}
            onHoldStart={handleHoldStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onActionPress={(id) => applyAction(id, true)}
            onActionRelease={(id) => applyAction(id, false)}
            onExitPress={onExit}
          />
        ))}

        {unlocked && (
          <div
            style={{
              position: "absolute", bottom: "2%", left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(109,40,217,0.88)",
              border: "1px solid rgba(139,92,246,0.65)",
              borderRadius: 8, padding: "5px 14px",
              color: "#ede9fe", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.06em", whiteSpace: "nowrap",
              pointerEvents: "auto", cursor: "pointer",
            }}
            onPointerUp={() => resetLayout()}
          >
            DRAG MODE · tap to reset all positions
          </div>
        )}
      </div>
    </>
  );
}
