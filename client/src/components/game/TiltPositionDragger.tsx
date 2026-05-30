// TiltPositionDragger — 2D drag zone for mobile launch control.
// Horizontal drag → tilt (replaces A/D keys).
// Vertical drag → position (replaces W/S keys).
// Shows the current server-synced tilt/position as visual indicators.

import React, { useRef, useCallback, useEffect, useState } from "react";

// Input bitmask constants (match server decodeBitmask)
const MOVE_LEFT  = 0x001; // tilt left
const MOVE_RIGHT = 0x002; // tilt right
const MOVE_UP    = 0x004; // position forward
const MOVE_DOWN  = 0x008; // position backward

const DEAD_ZONE = 0.08; // fraction of zone size before registering

interface TiltPositionDraggerProps {
  /** Server-synced tilt (−45 to +45 deg) — drives display only */
  tilt: number;
  /** Server-synced position (0=fwd, 1=back) — drives display only */
  position: number;
  /** True once charging has started (locks controls) */
  locked: boolean;
  /** Called with bitmask whenever drag state changes; 0 = all released */
  onMaskChange: (mask: number) => void;
}

// Position zone definitions (0–1 normalized)
const ZONES = [
  { lo: 0.0, hi: 0.2, label: "BAD",     color: "#FF3333" },
  { lo: 0.2, hi: 0.4, label: "GOOD",    color: "#FFCC00" },
  { lo: 0.4, hi: 0.6, label: "PERFECT", color: "#00FF88" },
  { lo: 0.6, hi: 0.8, label: "GOOD",    color: "#FFCC00" },
  { lo: 0.8, hi: 1.0, label: "BAD",     color: "#FF3333" },
];

function zoneColorFor(pos: number): string {
  const z = ZONES.find(z => pos >= z.lo && pos <= z.hi) ?? ZONES[2];
  return z.color;
}

export function TiltPositionDragger({
  tilt, position, locked, onMaskChange,
}: TiltPositionDraggerProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // normalized −1 to +1

  const computeMask = useCallback((nx: number, ny: number): number => {
    let mask = 0;
    if (nx > DEAD_ZONE)  mask |= MOVE_RIGHT;
    if (nx < -DEAD_ZONE) mask |= MOVE_LEFT;
    if (ny > DEAD_ZONE)  mask |= MOVE_DOWN;
    if (ny < -DEAD_ZONE) mask |= MOVE_UP;
    return mask;
  }, []);

  const onPointerMove = useCallback((cx: number, cy: number) => {
    const el = zoneRef.current;
    if (!el || !dragOriginRef.current) return;
    const rect = el.getBoundingClientRect();
    const dx = (cx - dragOriginRef.current.x) / (rect.width  * 0.45);
    const dy = (cy - dragOriginRef.current.y) / (rect.height * 0.45);
    const nx = Math.max(-1, Math.min(1, dx));
    const ny = Math.max(-1, Math.min(1, dy));
    setDragOffset({ x: nx, y: ny });
    onMaskChange(computeMask(nx, ny));
  }, [computeMask, onMaskChange]);

  const onPointerEnd = useCallback(() => {
    dragOriginRef.current = null;
    setDragOffset({ x: 0, y: 0 });
    onMaskChange(0);
  }, [onMaskChange]);

  useEffect(() => {
    if (locked) {
      onPointerEnd();
    }
  }, [locked, onPointerEnd]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (locked) return;
    e.preventDefault();
    const t = e.touches[0];
    dragOriginRef.current = { x: t.clientX, y: t.clientY };
    setDragOffset({ x: 0, y: 0 });
  }, [locked]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragOriginRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  }, [onPointerMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onPointerEnd();
  }, [onPointerEnd]);

  // Mouse handlers (desktop fallback)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (locked) return;
    dragOriginRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
  }, [locked]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragOriginRef.current) return;
      onPointerMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      if (dragOriginRef.current) onPointerEnd();
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onPointerMove, onPointerEnd]);

  const posColor = zoneColorFor(position);
  const tiltPct = 50 + (tilt / 45) * 45; // 5%–95% range mapped from −45°–+45°

  // Thumb circle position driven by live drag offset
  const thumbX = 50 + dragOffset.x * 40;
  const thumbY = 50 + dragOffset.y * 40;

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* 2D drag zone */}
      <div
        ref={zoneRef}
        className="relative w-full rounded-xl overflow-hidden touch-none"
        style={{
          height: 100,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          cursor: locked ? "not-allowed" : "grab",
          opacity: locked ? 0.4 : 1,
          transition: "opacity 200ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Crosshair guides */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/8 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/8 pointer-events-none" />

        {/* Draggable thumb */}
        <div
          className="absolute w-10 h-10 rounded-full pointer-events-none"
          style={{
            left: `${thumbX}%`,
            top: `${thumbY}%`,
            transform: "translate(-50%,-50%)",
            background: "rgba(255,255,255,0.15)",
            border: `2px solid ${dragOriginRef.current ? "#FFD700" : "rgba(255,255,255,0.3)"}`,
            boxShadow: dragOriginRef.current ? "0 0 12px rgba(255,215,0,0.5)" : "none",
            transition: dragOriginRef.current ? "none" : "left 80ms, top 80ms",
          }}
        />

        {/* Zone hint text */}
        {!dragOriginRef.current && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              DRAG TO CONTROL
            </span>
          </div>
        )}

        {/* Axis labels */}
        <div className="absolute bottom-1 left-2 text-[9px] text-white/25 font-mono pointer-events-none">← TILT →</div>
        <div className="absolute top-1 right-2 text-[9px] text-white/25 font-mono pointer-events-none">↑ FWD</div>
        <div className="absolute bottom-1 right-2 text-[9px] text-white/25 font-mono pointer-events-none">↓ BCK</div>
      </div>

      {/* Tilt indicator bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/40 font-mono mb-1 px-0.5">
          <span>TILT ← {tilt > 0 ? "+" : ""}{tilt.toFixed(0)}°</span>
          <span className="text-[9px] text-white/25">A / D</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15" style={{ transform: "translateX(-50%)" }} />
          <div
            className="absolute top-0.5 bottom-0.5 w-3 rounded-full"
            style={{
              left: `calc(${tiltPct}% - 6px)`,
              background: Math.abs(tilt) > 30 ? "#FF3333" : "#4D9FFF",
              transition: "left 50ms linear, background 200ms",
            }}
          />
        </div>
      </div>

      {/* Position zone bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/40 font-mono mb-1 px-0.5">
          <span>POSITION</span>
          <span className="text-[9px] text-white/25">W / S</span>
        </div>
        <div className="relative h-4 rounded-full overflow-hidden flex">
          {ZONES.map((z, i) => (
            <div
              key={i}
              className="flex-1 flex items-center justify-center"
              style={{ background: z.color + "22" }}
            >
              <span className="text-[7px] font-bold" style={{ color: z.color + "99" }}>
                {z.label}
              </span>
            </div>
          ))}
          {/* Position dot */}
          <div
            className="absolute top-0.5 bottom-0.5 w-3 rounded-full"
            style={{
              left: `calc(${position * 100}% - 6px)`,
              background: posColor,
              boxShadow: `0 0 6px ${posColor}88`,
              transition: "left 80ms linear, background 200ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}
