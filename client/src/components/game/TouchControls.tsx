import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { touchInputState } from "@/game/hooks/useGameInput";

const STICK_SIZE = 120;
const STICK_DEAD = 18;

type Dir = "moveLeft" | "moveRight" | "moveUp" | "moveDown";

function resolveDirs(dx: number, dy: number): Dir[] {
  const dirs: Dir[] = [];
  if (Math.abs(dx) > STICK_DEAD || Math.abs(dy) > STICK_DEAD) {
    if (dx < -STICK_DEAD) dirs.push("moveLeft");
    if (dx >  STICK_DEAD) dirs.push("moveRight");
    if (dy < -STICK_DEAD) dirs.push("moveUp");
    if (dy >  STICK_DEAD) dirs.push("moveDown");
  }
  return dirs;
}

const BTN = "w-14 h-14 flex flex-col items-center justify-center rounded-full border-2 select-none touch-none cursor-pointer active:scale-90 transition-transform";

interface ActionBtnProps {
  label: string;
  sub: string;
  colorClass: string;
  borderClass: string;
  field: keyof typeof touchInputState;
}

function ActionBtn({ label, sub, colorClass, borderClass, field }: ActionBtnProps) {
  const press = (e: React.TouchEvent) => {
    e.preventDefault();
    (touchInputState as Record<string, boolean>)[field as string] = true;
    if ("vibrate" in navigator) navigator.vibrate(12);
  };
  const release = (e: React.TouchEvent) => {
    e.preventDefault();
    (touchInputState as Record<string, boolean>)[field as string] = false;
  };
  return (
    <div
      className={cn(BTN, colorClass, borderClass)}
      onTouchStart={press}
      onTouchEnd={release}
      onTouchCancel={release}
    >
      <span className="text-white font-bold font-mono text-[0.75rem] leading-none">{label}</span>
      <span className="text-white/60 text-[0.45rem] mt-0.5 tracking-wider">{sub}</span>
    </div>
  );
}

export function TouchControls({ onPause }: { onPause?: () => void }) {
  const [visible, setVisible] = useState(false);
  const originRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [knobPos, setKnobPos] = useState({ x: STICK_SIZE / 2, y: STICK_SIZE / 2 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setVisible(mq.matches);
    const handler = (e: MediaQueryListEvent) => setVisible(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleStickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    originRef.current = { x: t.clientX, y: t.clientY, id: t.identifier };
    setKnobPos({ x: STICK_SIZE / 2, y: STICK_SIZE / 2 });
  };

  const handleStickMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== origin.id) continue;
      const dx = t.clientX - origin.x;
      const dy = t.clientY - origin.y;
      const clamp = STICK_SIZE * 0.35;
      setKnobPos({ x: STICK_SIZE / 2 + Math.min(clamp, Math.max(-clamp, dx)), y: STICK_SIZE / 2 + Math.min(clamp, Math.max(-clamp, dy)) });
      const dirs = resolveDirs(dx, dy);
      touchInputState.moveLeft  = dirs.includes("moveLeft");
      touchInputState.moveRight = dirs.includes("moveRight");
      touchInputState.moveUp    = dirs.includes("moveUp");
      touchInputState.moveDown  = dirs.includes("moveDown");
    }
  };

  const handleStickEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === origin.id) {
        originRef.current = null;
        setKnobPos({ x: STICK_SIZE / 2, y: STICK_SIZE / 2 });
        touchInputState.moveLeft = touchInputState.moveRight = touchInputState.moveUp = touchInputState.moveDown = false;
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-[60]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-end justify-between px-6 pb-5">
        {/* Left: analog stick */}
        <div
          className="w-[120px] h-[120px] bg-[rgba(20,30,50,0.6)] rounded-full border-2 border-[rgba(120,160,220,0.4)] relative pointer-events-auto touch-none"
          onTouchStart={handleStickStart}
          onTouchMove={handleStickMove}
          onTouchEnd={handleStickEnd}
          onTouchCancel={handleStickEnd}
        >
          {/* knob — inline style for runtime pixel position */}
          <div
            style={{ left: knobPos.x, top: knobPos.y }}
            className="absolute w-9 h-9 rounded-full bg-[rgba(100,160,240,0.7)] border-2 border-[rgba(180,210,255,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Center: pause */}
        <button
          className="pointer-events-auto w-10 h-10 rounded-full bg-[rgba(30,30,50,0.7)] border border-white/20 flex items-center justify-center text-white/70 text-sm mb-2"
          onTouchEnd={(e) => { e.preventDefault(); onPause?.(); }}
        >
          ⏸
        </button>

        {/* Right: 2×2 action grid */}
        <div className="grid grid-cols-2 gap-2 pointer-events-auto">
          <ActionBtn label="ATK" sub="J" colorClass="bg-[rgba(200,50,50,0.8)]" borderClass="border-[rgba(255,100,100,0.5)]" field="attack" />
          <ActionBtn label="DEF" sub="K" colorClass="bg-[rgba(50,80,200,0.8)]" borderClass="border-[rgba(100,130,255,0.5)]" field="defense" />
          <ActionBtn label="SP"  sub="SPC" colorClass="bg-[rgba(180,130,0,0.8)]" borderClass="border-[rgba(255,200,50,0.5)]" field="specialTap" />
          <ActionBtn label="CMB" sub="I" colorClass="bg-[rgba(50,160,100,0.8)]" borderClass="border-[rgba(80,220,140,0.5)]" field="jump" />
        </div>
      </div>
    </div>
  );
}
