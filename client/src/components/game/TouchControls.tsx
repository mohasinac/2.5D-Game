// Phase 24 — TouchControls: virtual D-pad + action buttons for mobile/tablet.
// Writes directly into `touchInputState` exported by useGameInput.ts.
// Visible only when `window.matchMedia("(pointer: coarse)")` is true.

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { touchInputState } from "@/game/hooks/useGameInput";

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

// Action button base classes — color background applied per-button
const actionBtnBase =
  "w-14 h-14 flex items-center justify-center rounded-full border-2 border-white/25 text-white font-bold font-mono text-[0.65rem] tracking-[0.05em] select-none touch-none cursor-pointer";

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

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[220px] pointer-events-none z-[60] flex items-end justify-between px-6 pb-6">
      {/* Left: D-pad */}
      <div
        className="w-[120px] h-[120px] bg-[rgba(20,30,50,0.6)] rounded-full border-2 border-[rgba(120,160,220,0.4)] relative pointer-events-auto touch-none"
        onTouchStart={handleDpadStart}
        onTouchMove={handleDpadMove}
        onTouchEnd={handleDpadEnd}
        onTouchCancel={handleDpadEnd}
      >
        {/* Knob — left/top are runtime pixel positions and must stay as inline styles */}
        <div
          style={{ left: knobPos.x, top: knobPos.y }}
          className="absolute w-9 h-9 rounded-full bg-[rgba(100,160,240,0.7)] border-2 border-[rgba(180,210,255,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>

      {/* Right: Action buttons in diamond layout */}
      <div className="flex flex-col items-center gap-[0.4rem] pointer-events-auto">
        {/* Top row: Jump */}
        <div className="flex justify-center">
          <div
            className={cn(actionBtnBase, "bg-[rgba(60,80,200,0.8)]")}
            onTouchStart={btnDown("jump")} onTouchEnd={btnUp("jump")} onTouchCancel={btnUp("jump")}
          >
            I<br/><span className="text-[0.5rem]">JUMP</span>
          </div>
        </div>
        {/* Middle row: Attack + Defense */}
        <div className="flex gap-2">
          <div
            className={cn(actionBtnBase, "bg-[rgba(200,50,50,0.8)]")}
            onTouchStart={btnDown("attack")} onTouchEnd={btnUp("attack")} onTouchCancel={btnUp("attack")}
          >
            J<br/><span className="text-[0.5rem]">ATK</span>
          </div>
          <div
            className={cn(actionBtnBase, "bg-[rgba(50,80,200,0.8)]")}
            onTouchStart={btnDown("defense")} onTouchEnd={btnUp("defense")} onTouchCancel={btnUp("defense")}
          >
            K<br/><span className="text-[0.5rem]">DEF</span>
          </div>
        </div>
        {/* Bottom row: Dodge + Special */}
        <div className="flex gap-2">
          <div
            className={cn(actionBtnBase, "bg-[rgba(50,160,100,0.8)]")}
            onTouchStart={btnDown("dodge")} onTouchEnd={btnUp("dodge")} onTouchCancel={btnUp("dodge")}
          >
            L<br/><span className="text-[0.5rem]">DODGE</span>
          </div>
          <div
            className={cn(actionBtnBase, "bg-[rgba(180,130,0,0.8)]")}
            onTouchStart={btnDown("specialTap")} onTouchEnd={btnUp("specialTap")} onTouchCancel={btnUp("specialTap")}
          >
            SPC
          </div>
        </div>
      </div>
    </div>
  );
}
