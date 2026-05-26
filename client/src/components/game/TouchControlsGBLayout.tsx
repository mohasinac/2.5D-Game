// Phase E — GameBoy-style touch controls (GBLayout).
// Portrait  (width < 600px): controls bar below the canvas.
// Landscape (width ≥ 600px): D-pad panel on left side of canvas, action buttons on right side, space bar at bottom strip.
// Each zone is independently draggable via DraggableZone.
// Only rendered on coarse-pointer (touch) devices.
//
// Usage A — wraps canvas (full GBA layout):
//   <TouchControlsGBLayout><div ref={canvasRef} /></TouchControlsGBLayout>
//
// Usage B — standalone overlay (backwards-compat, no children needed):
//   <TouchControlsGBLayout />
//   (Portrait: fixed bar at bottom; Landscape: fixed panels on sides + bottom strip)

import { useRef, useState } from "react";
import { DraggableZone } from "@/components/ui/DraggableZone";
import { touchInputState } from "@/game/hooks/useGameInput";
import { useWindowWidth } from "@/game/hooks/useWindowWidth";
import { cn } from "@/lib/cn";

// ─── Constants ────────────────────────────────────────────────────────────────

const DPAD_SIZE = 120;
const DPAD_DEAD = 18;
const SPACE_TAP_MS = 200;

// ─── D-pad ────────────────────────────────────────────────────────────────────

function DPad() {
  const originRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [knobPos, setKnobPos] = useState({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });

  const applyDelta = (dx: number, dy: number) => {
    const clamp = DPAD_SIZE * 0.35;
    const kx = Math.min(clamp, Math.max(-clamp, dx));
    const ky = Math.min(clamp, Math.max(-clamp, dy));
    setKnobPos({ x: DPAD_SIZE / 2 + kx, y: DPAD_SIZE / 2 + ky });

    const dirs: string[] = [];
    if (Math.abs(dx) > DPAD_DEAD || Math.abs(dy) > DPAD_DEAD) {
      if (dx < -DPAD_DEAD) dirs.push("moveLeft");
      if (dx >  DPAD_DEAD) dirs.push("moveRight");
      if (dy < -DPAD_DEAD) dirs.push("moveUp");
      if (dy >  DPAD_DEAD) dirs.push("moveDown");
    }
    touchInputState.moveLeft  = dirs.includes("moveLeft");
    touchInputState.moveRight = dirs.includes("moveRight");
    touchInputState.moveUp    = dirs.includes("moveUp");
    touchInputState.moveDown  = dirs.includes("moveDown");
  };

  const resetDpad = () => {
    originRef.current = null;
    setKnobPos({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });
    touchInputState.moveLeft  = false;
    touchInputState.moveRight = false;
    touchInputState.moveUp    = false;
    touchInputState.moveDown  = false;
  };

  const handleStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    originRef.current = { x: t.clientX, y: t.clientY, id: t.identifier };
    setKnobPos({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });
  };

  const handleMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== origin.id) continue;
      applyDelta(t.clientX - origin.x, t.clientY - origin.y);
    }
  };

  const handleEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const origin = originRef.current;
    if (!origin) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === origin.id) resetDpad();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    originRef.current = { x: e.clientX, y: e.clientY, id: -1 };
    setKnobPos({ x: DPAD_SIZE / 2, y: DPAD_SIZE / 2 });
    const onMove = (ev: MouseEvent) => {
      if (!originRef.current) return;
      applyDelta(ev.clientX - originRef.current.x, ev.clientY - originRef.current.y);
    };
    const onUp = () => {
      resetDpad();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className="w-[120px] h-[120px] rounded-full bg-[rgba(20,30,50,0.6)] border-2 border-[rgba(120,160,220,0.4)] relative select-none touch-none"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Knob — left/top are runtime pixel positions */}
      <div
        className="absolute w-9 h-9 rounded-full bg-[rgba(100,160,240,0.7)] border-2 border-[rgba(180,210,255,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: knobPos.x, top: knobPos.y }}
      />
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

const actionBase =
  "w-14 h-14 flex items-center justify-center rounded-full border-2 border-white/25 text-white font-bold font-mono text-[0.65rem] tracking-[0.05em] select-none touch-none cursor-pointer";

type TouchField = keyof typeof touchInputState;

function ActionBtn({
  field, label, sub, colorClass,
}: { field: TouchField; label: string; sub: string; colorClass: string }) {
  const btnDown = (e: React.TouchEvent) => { e.preventDefault(); (touchInputState[field] as boolean) = true; };
  const btnUp   = (e: React.TouchEvent) => { e.preventDefault(); (touchInputState[field] as boolean) = false; };
  const mouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    (touchInputState[field] as boolean) = true;
    const onUp = () => { (touchInputState[field] as boolean) = false; window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mouseup", onUp);
  };
  return (
    <div
      className={cn(actionBase, colorClass)}
      onTouchStart={btnDown}
      onTouchEnd={btnUp}
      onTouchCancel={btnUp}
      onMouseDown={mouseDown}
    >
      {label}<br /><span className="text-[0.5rem]">{sub}</span>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-col items-center gap-[0.4rem]">
      {/* Top: Jump (I) */}
      <div className="flex justify-center">
        <ActionBtn field="jump"    label="I" sub="JUMP"  colorClass="bg-[rgba(60,80,200,0.8)]" />
      </div>
      {/* Middle: Attack (J) + Defense (K) */}
      <div className="flex gap-2">
        <ActionBtn field="attack"  label="J" sub="ATK"   colorClass="bg-[rgba(200,50,50,0.8)]" />
        <ActionBtn field="defense" label="K" sub="DEF"   colorClass="bg-[rgba(50,80,200,0.8)]" />
      </div>
      {/* Bottom: Dodge (L) */}
      <div className="flex justify-center">
        <ActionBtn field="dodge"   label="L" sub="DODGE" colorClass="bg-[rgba(50,160,100,0.8)]" />
      </div>
    </div>
  );
}

// ─── Space bar ────────────────────────────────────────────────────────────────

function SpaceBar() {
  const pressTimeRef = useRef<number>(0);

  const release = () => {
    const held = Date.now() - pressTimeRef.current;
    touchInputState.chargeHeld = false;
    if (held < SPACE_TAP_MS) {
      touchInputState.specialTap = true;
      requestAnimationFrame(() => { touchInputState.specialTap = false; });
    }
  };

  const handleStart = (e: React.TouchEvent) => {
    e.preventDefault();
    pressTimeRef.current = Date.now();
    touchInputState.chargeHeld = true;
  };

  const handleEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    release();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    pressTimeRef.current = Date.now();
    touchInputState.chargeHeld = true;
    const onUp = () => { release(); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className="max-w-[200px] h-10 rounded-full bg-[rgba(40,50,70,0.8)] border border-white/20 text-xs text-white/60 font-mono tracking-widest flex items-center justify-center px-6 select-none touch-none cursor-pointer"
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleMouseDown}
    >
      SPACE
    </div>
  );
}

// ─── Portrait overlay (no children) ──────────────────────────────────────────

function PortraitOverlay() {
  return (
    <div className="fixed bottom-0 left-0 right-0 shrink-0 bg-[rgba(5,8,20,0.95)] border-t border-white/10 flex items-end justify-between px-5 pb-5 pt-3 h-[190px] z-[60] pointer-events-none">
      <div className="pointer-events-auto">
        <DraggableZone storageKey="tc-dpad"><DPad /></DraggableZone>
      </div>
      <div className="pointer-events-auto">
        <DraggableZone storageKey="tc-space"><SpaceBar /></DraggableZone>
      </div>
      <div className="pointer-events-auto">
        <DraggableZone storageKey="tc-actions"><ActionButtons /></DraggableZone>
      </div>
    </div>
  );
}

// ─── Landscape overlay (no children) ─────────────────────────────────────────

function LandscapeOverlay() {
  return (
    <>
      {/* Left D-pad panel */}
      <div className="fixed left-0 top-0 bottom-[64px] w-[130px] bg-[rgba(5,8,20,0.95)] border-r border-white/10 flex items-center justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto">
          <DraggableZone storageKey="tc-dpad"><DPad /></DraggableZone>
        </div>
      </div>

      {/* Right action buttons panel */}
      <div className="fixed right-0 top-0 bottom-[64px] w-[130px] bg-[rgba(5,8,20,0.95)] border-l border-white/10 flex items-center justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto">
          <DraggableZone storageKey="tc-actions"><ActionButtons /></DraggableZone>
        </div>
      </div>

      {/* Bottom space bar strip */}
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-[rgba(5,8,20,0.95)] border-t border-white/10 flex justify-center items-center z-[60] pointer-events-none">
        <div className="pointer-events-auto">
          <DraggableZone storageKey="tc-space"><SpaceBar /></DraggableZone>
        </div>
      </div>
    </>
  );
}

// ─── Portrait with children ───────────────────────────────────────────────────

function PortraitWithChildren({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Canvas area fills remaining space */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {children}
      </div>

      {/* Controls bar below canvas */}
      <div className="shrink-0 bg-[rgba(5,8,20,0.95)] border-t border-white/10 flex items-end justify-between px-5 pb-5 pt-3 h-[190px]">
        <DraggableZone storageKey="tc-dpad"><DPad /></DraggableZone>
        <DraggableZone storageKey="tc-space"><SpaceBar /></DraggableZone>
        <DraggableZone storageKey="tc-actions"><ActionButtons /></DraggableZone>
      </div>
    </div>
  );
}

// ─── Landscape with children ──────────────────────────────────────────────────

function LandscapeWithChildren({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: D-pad panel */}
        <DraggableZone
          storageKey="tc-dpad"
          className="w-[130px] shrink-0 bg-[rgba(5,8,20,0.95)] border-r border-white/10 flex items-center justify-center"
        >
          <DPad />
        </DraggableZone>

        {/* Center: canvas slot */}
        <div className="flex-1 relative overflow-hidden min-w-0">
          {children}
        </div>

        {/* Right: action buttons panel */}
        <DraggableZone
          storageKey="tc-actions"
          className="w-[130px] shrink-0 bg-[rgba(5,8,20,0.95)] border-l border-white/10 flex items-center justify-center"
        >
          <ActionButtons />
        </DraggableZone>
      </div>

      {/* Bottom: space bar strip */}
      <DraggableZone
        storageKey="tc-space"
        className="shrink-0 h-[64px] bg-[rgba(5,8,20,0.95)] border-t border-white/10 flex justify-center items-center"
      >
        <SpaceBar />
      </DraggableZone>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface TouchControlsGBLayoutProps {
  /** The canvas/renderer element — wraps it in GBA layout when provided. */
  children?: React.ReactNode;
}

export function TouchControlsGBLayout({ children }: TouchControlsGBLayoutProps) {
  return <TouchControlsGBLayoutInner>{children}</TouchControlsGBLayoutInner>;
}

function TouchControlsGBLayoutInner({ children }: { children?: React.ReactNode }) {
  const width = useWindowWidth();
  const isPortrait = width < 600;

  if (!children) {
    // Standalone overlay mode (backwards-compat drop-in for old TouchControls usage)
    return isPortrait ? <PortraitOverlay /> : <LandscapeOverlay />;
  }

  // Canvas-wrapping mode
  return isPortrait
    ? <PortraitWithChildren>{children}</PortraitWithChildren>
    : <LandscapeWithChildren>{children}</LandscapeWithChildren>;
}
