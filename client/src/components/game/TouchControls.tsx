// Phase 24 — TouchControls: virtual D-pad + action buttons for mobile/tablet.
// Writes directly into `touchInputState` exported by useGameInput.ts.
// Visible only when `window.matchMedia("(pointer: coarse)")` is true.

import { useEffect, useRef, useState } from "react";
import { touchInputState } from "@/game/hooks/useGameInput";

const BTN_SIZE = 56;
const DPAD_SIZE = 120;
const DPAD_DEAD = 18; // px from centre before registering a direction

type Dir = "moveLeft" | "moveRight" | "moveUp" | "moveDown";

function resolveDirs(dx: number, dy: number): Dir[] {
  const dirs: Dir[] = [];
  if (Math.abs(dx) > DPAD_DEAD || Math.abs(dy) > DPAD_DEAD) {
    if (dx < -DPAD_DEAD) dirs.push("moveLeft");
    if (dx >  DPAD_DEAD) dirs.push("moveRight");
    if (dy < -DPAD_DEAD) dirs.push("moveUp");
    if (dy >  DPAD_DEAD) dirs.push("moveDown");
  }
  return dirs;
}

export function TouchControls() {
  const [visible, setVisible] = useState(false);
  const dpadOriginRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const dpadCenterRef = useRef<{ cx: number; cy: number }>({ cx: DPAD_SIZE / 2, cy: DPAD_SIZE / 2 });
  const [knobPos, setKnobPos] = useState({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });

  // Check if touch device
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setVisible(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setVisible(e.matches);
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  // D-pad touch handlers
  const handleDpadStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dpadOriginRef.current = { x: t.clientX, y: t.clientY, id: t.identifier };
    dpadCenterRef.current = { cx: rect.left + DPAD_SIZE / 2, cy: rect.top + DPAD_SIZE / 2 };
    setKnobPos({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });
  };

  const handleDpadMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = dpadOriginRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== origin.id) continue;
      const dx = t.clientX - origin.x;
      const dy = t.clientY - origin.y;
      const clamp = DPAD_SIZE * 0.35;
      const kx = Math.min(clamp, Math.max(-clamp, dx));
      const ky = Math.min(clamp, Math.max(-clamp, dy));
      setKnobPos({ x: DPAD_SIZE / 2 + kx, y: DPAD_SIZE / 2 + ky });

      // Write directions into shared state
      const dirs = resolveDirs(dx, dy);
      touchInputState.moveLeft  = dirs.includes("moveLeft");
      touchInputState.moveRight = dirs.includes("moveRight");
      touchInputState.moveUp    = dirs.includes("moveUp");
      touchInputState.moveDown  = dirs.includes("moveDown");
    }
  };

  const handleDpadEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = dpadOriginRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === origin.id) {
        dpadOriginRef.current = null;
        setKnobPos({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });
        touchInputState.moveLeft  = false;
        touchInputState.moveRight = false;
        touchInputState.moveUp    = false;
        touchInputState.moveDown  = false;
      }
    }
  };

  // Action button helpers
  const btnDown = (field: keyof typeof touchInputState) => (e: React.TouchEvent) => {
    e.preventDefault();
    touchInputState[field] = true as never;
  };
  const btnUp = (field: keyof typeof touchInputState) => (e: React.TouchEvent) => {
    e.preventDefault();
    touchInputState[field] = false as never;
  };

  if (!visible) return null;

  const actionBtnStyle = (color: string): React.CSSProperties => ({
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: "50%",
    background: color,
    border: "2px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "0.65rem",
    fontFamily: "monospace",
    fontWeight: 700,
    userSelect: "none",
    touchAction: "none",
    cursor: "pointer",
    letterSpacing: "0.05em",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "220px",
        pointerEvents: "none",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "0 1.5rem 1.5rem",
      }}
    >
      {/* Left: D-pad */}
      <div
        style={{
          width: DPAD_SIZE,
          height: DPAD_SIZE,
          background: "rgba(20,30,50,0.6)",
          borderRadius: "50%",
          border: "2px solid rgba(120,160,220,0.4)",
          position: "relative",
          pointerEvents: "auto",
          touchAction: "none",
        }}
        onTouchStart={handleDpadStart}
        onTouchMove={handleDpadMove}
        onTouchEnd={handleDpadEnd}
        onTouchCancel={handleDpadEnd}
      >
        {/* Knob */}
        <div
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(100,160,240,0.7)",
            border: "2px solid rgba(180,210,255,0.6)",
            transform: "translate(-50%, -50%)",
            left: knobPos.x,
            top: knobPos.y,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Right: Action buttons in diamond layout */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", pointerEvents: "auto" }}>
        {/* Top row: Jump */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={actionBtnStyle("rgba(60,80,200,0.8)")}
            onTouchStart={btnDown("jump")} onTouchEnd={btnUp("jump")} onTouchCancel={btnUp("jump")}>
            I<br/><span style={{ fontSize: "0.5rem" }}>JUMP</span>
          </div>
        </div>
        {/* Middle row: Attack + Defense */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={actionBtnStyle("rgba(200,50,50,0.8)")}
            onTouchStart={btnDown("attack")} onTouchEnd={btnUp("attack")} onTouchCancel={btnUp("attack")}>
            J<br/><span style={{ fontSize: "0.5rem" }}>ATK</span>
          </div>
          <div style={actionBtnStyle("rgba(50,80,200,0.8)")}
            onTouchStart={btnDown("defense")} onTouchEnd={btnUp("defense")} onTouchCancel={btnUp("defense")}>
            K<br/><span style={{ fontSize: "0.5rem" }}>DEF</span>
          </div>
        </div>
        {/* Bottom row: Dodge + Special */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={actionBtnStyle("rgba(50,160,100,0.8)")}
            onTouchStart={btnDown("dodge")} onTouchEnd={btnUp("dodge")} onTouchCancel={btnUp("dodge")}>
            L<br/><span style={{ fontSize: "0.5rem" }}>DODGE</span>
          </div>
          <div style={actionBtnStyle("rgba(180,130,0,0.8)")}
            onTouchStart={btnDown("specialTap")} onTouchEnd={btnUp("specialTap")} onTouchCancel={btnUp("specialTap")}>
            SPC
          </div>
        </div>
      </div>
    </div>
  );
}
