import { useEffect, useRef, useState } from "react";

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
  const dpadRef = useRef<HTMLDivElement>(null);
  const dpadOriginRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0.5, y: 0.5 });

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
    setKnobPos({ x: 0.5, y: 0.5 });
  };

  const handleDpadMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = dpadOriginRef.current;
    if (!origin) return;
    const dpadSize = dpadRef.current?.clientWidth ?? 100;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== origin.id) continue;
      const dx = t.clientX - origin.x;
      const dy = t.clientY - origin.y;
      const clamp = dpadSize * 0.35;
      const kx = Math.min(clamp, Math.max(-clamp, dx));
      const ky = Math.min(clamp, Math.max(-clamp, dy));
      setKnobPos({ x: 0.5 + kx / dpadSize, y: 0.5 + ky / dpadSize });

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
        setKnobPos({ x: 0.5, y: 0.5 });
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
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[55] flex items-end justify-between px-3 pb-3 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
      <div
        ref={dpadRef}
        className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[140px] lg:h-[140px] bg-[rgba(20,30,50,0.6)] rounded-full border-2 border-[rgba(120,160,220,0.4)] relative pointer-events-auto touch-none"
        onTouchStart={handleDpadStart}
        onTouchMove={handleDpadMove}
        onTouchEnd={handleDpadEnd}
        onTouchCancel={handleDpadEnd}
      >
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-white/20 text-[10px] sm:text-xs">▲</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/20 text-[10px] sm:text-xs">▼</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-white/20 text-[10px] sm:text-xs">◀</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 text-[10px] sm:text-xs">▶</span>

        <div
          className="absolute w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[rgba(100,160,240,0.7)] border-2 border-[rgba(180,210,255,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${knobPos.x * 100}%`, top: `${knobPos.y * 100}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-2 pointer-events-auto mb-2">
        <button
          className="px-3 py-1 sm:px-4 sm:py-1.5 bg-[rgba(80,80,80,0.7)] rounded-full text-[9px] sm:text-[10px] text-white/70 font-bold tracking-widest uppercase border border-white/10 touch-none select-none"
          onTouchStart={btnDown("menu")}
          onTouchEnd={btnUp("menu")}
          onTouchCancel={btnUp("menu")}
        >
          START
        </button>
      </div>

      <div className="flex items-end gap-1.5 sm:gap-2 pointer-events-auto">
        <div
          className={`${ACTION_BTN} w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[rgba(200,50,50,0.8)] border-white/25 mb-4`}
          onTouchStart={btnDown("cancel")}
          onTouchEnd={btnUp("cancel")}
          onTouchCancel={btnUp("cancel")}
        >
          <span className="text-xs sm:text-sm">B</span>
        </div>
        <div
          className={`${ACTION_BTN} w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[rgba(50,160,100,0.8)] border-white/25`}
          onTouchStart={btnDown("confirm")}
          onTouchEnd={btnUp("confirm")}
          onTouchCancel={btnUp("confirm")}
        >
          <span className="text-xs sm:text-sm">A</span>
        </div>
      </div>
    </div>
  );
}
