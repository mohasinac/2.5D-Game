import { useEffect, useRef, useState } from "react";

const DPAD_SIZE = 120;
const DPAD_DEAD = 18;

type Dir = "up" | "down" | "left" | "right";

function resolveDirs(dx: number, dy: number): Dir[] {
  const dirs: Dir[] = [];
  if (Math.abs(dx) > DPAD_DEAD || Math.abs(dy) > DPAD_DEAD) {
    if (dx < -DPAD_DEAD) dirs.push("left");
    if (dx > DPAD_DEAD) dirs.push("right");
    if (dy < -DPAD_DEAD) dirs.push("up");
    if (dy > DPAD_DEAD) dirs.push("down");
  }
  return dirs;
}

export interface RPGTouchInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  confirm: boolean;
  cancel: boolean;
  menu: boolean;
}

export const rpgTouchState: RPGTouchInputState = {
  up: false, down: false, left: false, right: false,
  confirm: false, cancel: false, menu: false,
};

const ACTION_BTN =
  "flex items-center justify-center rounded-full border-2 select-none touch-none cursor-pointer font-bold text-white";

export function RPGTouchControls() {
  const [visible, setVisible] = useState(false);
  const dpadOriginRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [knobPos, setKnobPos] = useState({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setVisible(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setVisible(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleDpadStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    dpadOriginRef.current = { x: t.clientX, y: t.clientY, id: t.identifier };
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

      const dirs = resolveDirs(dx, dy);
      rpgTouchState.left = dirs.includes("left");
      rpgTouchState.right = dirs.includes("right");
      rpgTouchState.up = dirs.includes("up");
      rpgTouchState.down = dirs.includes("down");
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
        rpgTouchState.left = false;
        rpgTouchState.right = false;
        rpgTouchState.up = false;
        rpgTouchState.down = false;
      }
    }
  };

  const btnDown = (field: keyof RPGTouchInputState) => (e: React.TouchEvent) => {
    e.preventDefault();
    rpgTouchState[field] = true;
  };
  const btnUp = (field: keyof RPGTouchInputState) => (e: React.TouchEvent) => {
    e.preventDefault();
    rpgTouchState[field] = false;
  };

  if (!visible) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[55] flex items-end justify-between px-4 pb-4 sm:px-6 sm:pb-6">
      {/* Left: D-pad (same style as battle TouchControls) */}
      <div
        className="w-[120px] h-[120px] bg-[rgba(20,30,50,0.6)] rounded-full border-2 border-[rgba(120,160,220,0.4)] relative pointer-events-auto touch-none"
        onTouchStart={handleDpadStart}
        onTouchMove={handleDpadMove}
        onTouchEnd={handleDpadEnd}
        onTouchCancel={handleDpadEnd}
      >
        {/* Direction indicators */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-white/20 text-xs">▲</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/20 text-xs">▼</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-white/20 text-xs">◀</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 text-xs">▶</span>

        <div
          style={{ left: knobPos.x, top: knobPos.y }}
          className="absolute w-9 h-9 rounded-full bg-[rgba(100,160,240,0.7)] border-2 border-[rgba(180,210,255,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>

      {/* Center: START / SELECT (GBA-style) */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto mb-2">
        <button
          className="px-4 py-1.5 bg-[rgba(80,80,80,0.7)] rounded-full text-[10px] text-white/70 font-bold tracking-widest uppercase border border-white/10 touch-none select-none"
          onTouchStart={btnDown("menu")}
          onTouchEnd={btnUp("menu")}
          onTouchCancel={btnUp("menu")}
        >
          START
        </button>
      </div>

      {/* Right: A + B buttons (GBA layout — A right, B left, angled) */}
      <div className="flex items-end gap-2 pointer-events-auto">
        {/* B button (cancel) — slightly lower-left */}
        <div
          className={`${ACTION_BTN} w-14 h-14 bg-[rgba(200,50,50,0.8)] border-white/25 mb-4`}
          onTouchStart={btnDown("cancel")}
          onTouchEnd={btnUp("cancel")}
          onTouchCancel={btnUp("cancel")}
        >
          <span className="text-sm">B</span>
        </div>
        {/* A button (confirm) — slightly higher-right */}
        <div
          className={`${ACTION_BTN} w-14 h-14 bg-[rgba(50,160,100,0.8)] border-white/25`}
          onTouchStart={btnDown("confirm")}
          onTouchEnd={btnUp("confirm")}
          onTouchCancel={btnUp("confirm")}
        >
          <span className="text-sm">A</span>
        </div>
      </div>
    </div>
  );
}
