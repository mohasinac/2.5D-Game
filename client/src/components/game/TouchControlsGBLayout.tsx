// TouchControlsGBLayout — GBA-style virtual controller.
//
// Layout:
//   Left:   Cross D-pad  (proper + shape, touch + mouse drag, diagonal support)
//   Right:  Diamond action buttons (JUMP/ATK/DEF/DODGE — no keyboard letters)
//           + L (CHARGE, hold) and R (SPECIAL, tap) shoulder buttons above
//   Center: START button
//
// Both touch AND mouse work on every element.
// Always visible (no pointer:coarse gate); toggle button hides/shows.
// All panels individually draggable via DraggableZone.
//
// Usage:
//   <TouchControlsGBLayout />          — overlay (fixed position)
//   <TouchControlsGBLayout>{canvas}</> — wraps canvas in GBA frame

import { useRef, useState, useCallback } from "react";
import { DraggableZone } from "@/components/ui/DraggableZone";
import { touchInputState } from "@/game/hooks/useGameInput";
import { useWindowWidth } from "@/game/hooks/useWindowWidth";
import { cn } from "@/lib/cn";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

// ─── Cross D-pad ──────────────────────────────────────────────────────────────

const DPAD_DEAD = 18;

interface DirState { up: boolean; down: boolean; left: boolean; right: boolean }
const NO_DIRS: DirState = { up: false, down: false, left: false, right: false };

function applyDpadDirs(up: boolean, down: boolean, left: boolean, right: boolean) {
  touchInputState.moveUp    = up;
  touchInputState.moveDown  = down;
  touchInputState.moveLeft  = left;
  touchInputState.moveRight = right;
}

function clearDpad() {
  touchInputState.moveUp = touchInputState.moveDown =
  touchInputState.moveLeft = touchInputState.moveRight = false;
}

function dirsFromCenter(dx: number, dy: number): DirState {
  return {
    up:    dy < -DPAD_DEAD,
    down:  dy >  DPAD_DEAD,
    left:  dx < -DPAD_DEAD,
    right: dx >  DPAD_DEAD,
  };
}

// Arm class helpers
const armBase =
  "flex items-center justify-center transition-colors duration-75 select-none touch-none";
const armOff  = "bg-[rgba(30,45,80,0.85)] border-2 border-white/10 text-white/40";
const armOn   = "bg-[rgba(80,140,255,0.90)] border-2 border-white/55 text-white/95";

function CrossDpad() {
  const rootRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ cx: number; cy: number; id: number } | null>(null);
  const [dirs, setDirs] = useState<DirState>(NO_DIRS);

  const getCenterFromRoot = (): { cx: number; cy: number } => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return { cx: 0, cy: 0 };
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  };

  const applyAndSet = useCallback((dx: number, dy: number) => {
    const d = dirsFromCenter(dx, dy);
    applyDpadDirs(d.up, d.down, d.left, d.right);
    setDirs(d);
  }, []);

  const release = useCallback(() => {
    originRef.current = null;
    clearDpad();
    setDirs(NO_DIRS);
  }, []);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const { cx, cy } = getCenterFromRoot();
    originRef.current = { cx, cy, id: t.identifier };
    applyAndSet(t.clientX - cx, t.clientY - cy);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== origin.id) continue;
      applyAndSet(t.clientX - origin.cx, t.clientY - origin.cy);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === origin.id) release();
    }
  };

  // ── Mouse handlers (also works on desktop) ───────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const { cx, cy } = getCenterFromRoot();
    originRef.current = { cx, cy, id: -1 };
    applyAndSet(e.clientX - cx, e.clientY - cy);

    const onMove = (ev: MouseEvent) => {
      const o = originRef.current;
      if (!o) return;
      applyAndSet(ev.clientX - o.cx, ev.clientY - o.cy);
    };
    const onUp = () => {
      release();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  };

  return (
    <div
      ref={rootRef}
      className="inline-grid grid-cols-[1fr_1.4fr_1fr] grid-rows-[1fr_1.4fr_1fr] w-[108px] h-[108px] sm:w-[126px] sm:h-[126px] select-none touch-none gap-[2px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* Row 1 */}
      <div className="rounded-tl-md bg-transparent" />
      <div className={cn(armBase, "rounded-t-xl text-sm", dirs.up ? armOn : armOff)}>▲</div>
      <div className="rounded-tr-md bg-transparent" />

      {/* Row 2 */}
      <div className={cn(armBase, "rounded-l-xl text-sm", dirs.left ? armOn : armOff)}>◀</div>
      <div className="bg-[rgba(10,18,36,0.9)] border border-white/8 rounded-sm" />
      <div className={cn(armBase, "rounded-r-xl text-sm", dirs.right ? armOn : armOff)}>▶</div>

      {/* Row 3 */}
      <div className="rounded-bl-md bg-transparent" />
      <div className={cn(armBase, "rounded-b-xl text-sm", dirs.down ? armOn : armOff)}>▼</div>
      <div className="rounded-br-md bg-transparent" />
    </div>
  );
}

// ─── Shoulder buttons ─────────────────────────────────────────────────────────

const SPECIAL_TAP_MS = 200;

function ShoulderL() {
  const pressRef = useRef(0);

  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    pressRef.current = Date.now();
    touchInputState.chargeHeld = true;
  };
  const rel = () => {
    touchInputState.chargeHeld = false;
    pressRef.current = 0;
  };

  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    const up = () => { rel(); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      className="flex-1 h-7 sm:h-8 rounded-tl-xl bg-[rgba(80,60,10,0.85)] border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-[0.6rem] sm:text-[0.65rem] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(140,110,20,0.9)]"
      onTouchStart={press}
      onTouchEnd={() => rel()}
      onTouchCancel={() => rel()}
      onMouseDown={mouseDown}
    >
      L · CHARGE
    </div>
  );
}

function ShoulderR() {
  const pressRef = useRef(0);

  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    pressRef.current = Date.now();
  };
  const rel = () => {
    const held = pressRef.current > 0 ? Date.now() - pressRef.current : 999;
    pressRef.current = 0;
    if (held < SPECIAL_TAP_MS) {
      touchInputState.specialTap = true;
      requestAnimationFrame(() => { touchInputState.specialTap = false; });
    }
  };

  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    const up = () => { rel(); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      className="flex-1 h-7 sm:h-8 rounded-tr-xl bg-[rgba(20,60,100,0.85)] border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-[0.6rem] sm:text-[0.65rem] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(30,90,160,0.9)]"
      onTouchStart={press}
      onTouchEnd={() => rel()}
      onTouchCancel={() => rel()}
      onMouseDown={mouseDown}
    >
      R · SPECIAL
    </div>
  );
}

// ─── Diamond action buttons ───────────────────────────────────────────────────

type TouchField = keyof typeof touchInputState;

interface ActionBtnProps {
  field: TouchField;
  label: string;
  colorClass: string;
  size?: string;
}

function ActionBtn({ field, label, colorClass, size = "w-12 h-12 sm:w-14 sm:h-14" }: ActionBtnProps) {
  const pressBtn = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    (touchInputState[field] as boolean) = true;
  };
  const releaseBtn = () => { (touchInputState[field] as boolean) = false; };

  const mouseDown = (e: React.MouseEvent) => {
    pressBtn(e);
    const up = () => { releaseBtn(); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      className={cn(
        size,
        "flex items-center justify-center rounded-full border-2 border-white/20",
        "text-white font-bold text-[0.6rem] sm:text-[0.65rem] tracking-[0.04em]",
        "select-none touch-none cursor-pointer",
        "active:brightness-125 active:scale-95 transition-transform duration-75",
        colorClass,
      )}
      onTouchStart={pressBtn}
      onTouchEnd={releaseBtn}
      onTouchCancel={releaseBtn}
      onMouseDown={mouseDown}
    >
      {label}
    </div>
  );
}

// Diamond layout: JUMP top, ATK left, DEF right, DODGE bottom
function DiamondButtons() {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Shoulder buttons — full width above diamond */}
      <div className="flex w-full gap-[2px] mb-[6px]">
        <ShoulderL />
        <ShoulderR />
      </div>

      {/* Top: JUMP */}
      <div className="flex justify-center mb-[3px]">
        <ActionBtn field="jump"    label="JUMP"  colorClass="bg-[rgba(80,60,200,0.85)]" />
      </div>

      {/* Middle: ATK · gap · DEF */}
      <div className="flex items-center gap-[6px] mb-[3px]">
        <ActionBtn field="attack"  label="ATK"   colorClass="bg-[rgba(200,50,50,0.85)]" />
        <div className="w-8 h-8 rounded-sm bg-[rgba(10,18,36,0.5)] border border-white/5" />
        <ActionBtn field="defense" label="DEF"   colorClass="bg-[rgba(40,80,200,0.85)]" />
      </div>

      {/* Bottom: DODGE */}
      <div className="flex justify-center">
        <ActionBtn field="dodge"   label="DODGE" colorClass="bg-[rgba(30,150,90,0.85)]" />
      </div>
    </div>
  );
}

// ─── START button ─────────────────────────────────────────────────────────────
// Sits between D-pad and diamond in the center strip.

// ─── Toggle + settings ───────────────────────────────────────────────────────

function ToggleBar({
  hidden,
  onToggle,
  onKeys,
}: {
  hidden: boolean;
  onToggle: () => void;
  onKeys: () => void;
}) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-3 z-[70] flex items-center gap-2">
      <button
        onClick={onKeys}
        className="h-6 px-3 rounded-full bg-[rgba(20,30,50,0.85)] border border-white/20 text-white/60 text-[10px] font-bold select-none cursor-pointer hover:bg-[rgba(40,60,100,0.9)] active:scale-95 transition-all"
        title="Remap keys"
      >
        ⌨ Keys
      </button>
      <button
        onClick={onToggle}
        className="h-6 px-3 rounded-full bg-[rgba(20,30,50,0.85)] border border-white/20 text-white/60 text-[10px] font-bold select-none cursor-pointer hover:bg-[rgba(40,60,100,0.9)] active:scale-95 transition-all"
        title={hidden ? "Show controls" : "Hide controls"}
      >
        {hidden ? "Show Controls" : "Hide Controls"}
      </button>
    </div>
  );
}

// ─── Portrait: bar below canvas ───────────────────────────────────────────────

function PortraitOverlay({ onKeys }: { onKeys: () => void }) {
  void onKeys; // available for parent wiring
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(4,7,18,0.96)] border-t border-white/8 flex items-center justify-between px-4 pt-3 pb-4 h-[175px] z-[60] pointer-events-none">
      <div className="pointer-events-auto">
        <DraggableZone storageKey="tc-dpad"><CrossDpad /></DraggableZone>
      </div>
      <div className="pointer-events-auto">
        <DraggableZone storageKey="tc-diamond"><DiamondButtons /></DraggableZone>
      </div>
    </div>
  );
}

function PortraitWithChildren({ children, onKeys }: { children: React.ReactNode; onKeys: () => void }) {
  void onKeys;
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 relative overflow-hidden min-h-0">{children}</div>
      <div className="shrink-0 bg-[rgba(4,7,18,0.96)] border-t border-white/8 flex items-center justify-between px-4 pt-3 pb-4 h-[175px]">
        <DraggableZone storageKey="tc-dpad"><CrossDpad /></DraggableZone>
        <DraggableZone storageKey="tc-diamond"><DiamondButtons /></DraggableZone>
      </div>
    </div>
  );
}

// ─── Landscape: side panels ───────────────────────────────────────────────────

function LandscapeOverlay({ onKeys }: { onKeys: () => void }) {
  void onKeys;
  return (
    <>
      <div className="fixed left-0 top-0 bottom-0 w-[136px] bg-[rgba(4,7,18,0.96)] border-r border-white/8 flex items-center justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto">
          <DraggableZone storageKey="tc-dpad"><CrossDpad /></DraggableZone>
        </div>
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-[148px] bg-[rgba(4,7,18,0.96)] border-l border-white/8 flex items-center justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto">
          <DraggableZone storageKey="tc-diamond"><DiamondButtons /></DraggableZone>
        </div>
      </div>
    </>
  );
}

function LandscapeWithChildren({ children, onKeys }: { children: React.ReactNode; onKeys: () => void }) {
  void onKeys;
  return (
    <div className="flex h-screen">
      <DraggableZone
        storageKey="tc-dpad"
        className="w-[136px] shrink-0 bg-[rgba(4,7,18,0.96)] border-r border-white/8 flex items-center justify-center"
      >
        <CrossDpad />
      </DraggableZone>

      <div className="flex-1 relative overflow-hidden min-w-0">{children}</div>

      <DraggableZone
        storageKey="tc-diamond"
        className="w-[148px] shrink-0 bg-[rgba(4,7,18,0.96)] border-l border-white/8 flex items-center justify-center"
      >
        <DiamondButtons />
      </DraggableZone>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  children?: React.ReactNode;
  /** Override to always show regardless of pointer type (default: true) */
  alwaysShow?: boolean;
}

export function TouchControlsGBLayout({ children, alwaysShow = true }: Props) {
  const width        = useWindowWidth();
  const isPortrait   = width < 600;
  const [hidden, setHidden] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);

  const openKeyBindings  = useCallback(() => setKeysOpen(true),  []);
  const closeKeyBindings = useCallback(() => setKeysOpen(false), []);

  return (
    <>
      {keysOpen && <KeyBindingsPanel onClose={closeKeyBindings} />}

      <ToggleBar
        hidden={hidden}
        onToggle={() => setHidden((h) => !h)}
        onKeys={openKeyBindings}
      />

      {!hidden && (
        children
          ? (isPortrait
              ? <PortraitWithChildren onKeys={openKeyBindings}>{children}</PortraitWithChildren>
              : <LandscapeWithChildren onKeys={openKeyBindings}>{children}</LandscapeWithChildren>)
          : (isPortrait
              ? <PortraitOverlay onKeys={openKeyBindings} />
              : <LandscapeOverlay onKeys={openKeyBindings} />)
      )}
      {hidden && children}
    </>
  );
}
