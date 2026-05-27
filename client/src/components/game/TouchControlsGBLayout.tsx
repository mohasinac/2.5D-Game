// TouchControlsGBLayout — individually draggable touch controls.
//
// Every control element (D-pad, JUMP, ATK, DEF, DODGE, CHARGE, SPECIAL) is
// a separate floating panel that can be dragged anywhere on screen and its
// position is saved per-device in localStorage.
//
// A single ToggleBar (fixed bottom-centre) shows/hides all controls.
// A ⌂ snap-back button inside each panel resets it to its default position.
// A ⌨ Keys button opens the KeyBindingsPanel for keyboard remapping.

import React, { useRef, useState, useCallback, useEffect } from "react";
import { touchInputState } from "@/game/hooks/useGameInput";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

// ─── Persistence helpers ──────────────────────────────────────────────────────

interface Pos { x: number; y: number }

function loadPos(key: string): Pos | null {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as Pos : null; }
  catch { return null; }
}
function savePos(key: string, pos: Pos) {
  try { localStorage.setItem(key, JSON.stringify(pos)); } catch { /* ignore */ }
}
function clearPos(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

// ─── Default positions ────────────────────────────────────────────────────────
// Expressed as { right?, bottom?, left?, top? } fractions of viewport so they
// scale across screen sizes. Resolved lazily in useEffect (after mount).

type Anchor = { right?: number; left?: number; bottom?: number; top?: number };

function anchorToPos(anchor: Anchor): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: anchor.left !== undefined ? anchor.left
       : anchor.right !== undefined ? vw - anchor.right : 20,
    y: anchor.top !== undefined ? anchor.top
       : anchor.bottom !== undefined ? vh - anchor.bottom : 20,
  };
}

// ─── FloatingControl ─────────────────────────────────────────────────────────
// A fixed-position panel that can be dragged. A small drag handle (⠿) sits in
// the top-right corner; the snap-back (⌂) is next to it.

function FloatingControl({
  storageKey,
  defaultAnchor,
  label,
  children,
}: {
  storageKey: string;
  /** Default position relative to a viewport edge (px). */
  defaultAnchor: Anchor;
  label: string;
  children: React.ReactNode;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startPointer: Pos; startEl: Pos } | null>(null);

  const getDefault = () => anchorToPos(defaultAnchor);

  const [pos, setPos] = useState<Pos>(() => loadPos(storageKey) ?? { x: 0, y: 0 });
  const [initialized, setInitialized] = useState(() => loadPos(storageKey) !== null);

  // On first mount (no stored pos): compute the anchor-based default
  useEffect(() => {
    if (!initialized) {
      const p = getDefault();
      setPos(p);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clamp to viewport on resize
  useEffect(() => {
    const clamp = () => {
      const el = elRef.current;
      if (!el) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { width, height } = el.getBoundingClientRect();
      setPos(prev => ({
        x: Math.max(0, Math.min(prev.x, vw - width)),
        y: Math.max(0, Math.min(prev.y, vh - height)),
      }));
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  const onDragDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = elRef.current?.getBoundingClientRect();
    dragRef.current = {
      startPointer: { x: e.clientX, y: e.clientY },
      startEl: rect ? { x: rect.left, y: rect.top } : { x: pos.x, y: pos.y },
    };
  };
  const onDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startPointer.x;
    const dy = e.clientY - dragRef.current.startPointer.y;
    const newPos = {
      x: dragRef.current.startEl.x + dx,
      y: dragRef.current.startEl.y + dy,
    };
    setPos(newPos);
    savePos(storageKey, newPos);
  };
  const onDragUp = () => { dragRef.current = null; };

  const snapBack = () => {
    const p = getDefault();
    setPos(p);
    clearPos(storageKey);
  };

  return (
    <div
      ref={elRef}
      className="fixed z-[60] select-none touch-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag / snap toolbar */}
      <div className="flex justify-end items-center gap-[3px] mb-[3px]">
        <span className="text-[9px] text-white/30 font-mono mr-1">{label}</span>
        <button
          className="w-[18px] h-[18px] rounded-full bg-[rgba(20,30,50,0.9)] border border-white/20 text-white/50 hover:text-white text-[10px] flex items-center justify-center cursor-pointer active:scale-90"
          title="Snap back to default"
          onClick={snapBack}
        >⌂</button>
        <button
          className="w-[18px] h-[18px] rounded-full bg-[rgba(20,30,50,0.9)] border border-white/20 text-white/50 hover:text-white text-[10px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Drag to move"
          onPointerDown={onDragDown}
          onPointerMove={onDragMove}
          onPointerUp={onDragUp}
          onPointerCancel={onDragUp}
        >⠿</button>
      </div>
      {children}
    </div>
  );
}

// ─── Cross D-pad ──────────────────────────────────────────────────────────────

const DPAD_DEAD = 18;
interface DirState { up: boolean; down: boolean; left: boolean; right: boolean }
const NO_DIRS: DirState = { up: false, down: false, left: false, right: false };

function dirsFromCenter(dx: number, dy: number): DirState {
  return {
    up:    dy < -DPAD_DEAD,
    down:  dy >  DPAD_DEAD,
    left:  dx < -DPAD_DEAD,
    right: dx >  DPAD_DEAD,
  };
}
function clearDpad() {
  touchInputState.moveUp = touchInputState.moveDown =
  touchInputState.moveLeft = touchInputState.moveRight = false;
}

const armBase = "flex items-center justify-center transition-colors duration-75 select-none touch-none";
const armOff  = "bg-[rgba(30,45,80,0.85)] border-2 border-white/10 text-white/40";
const armOn   = "bg-[rgba(80,140,255,0.90)] border-2 border-white/55 text-white/95";

function CrossDpad() {
  const rootRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ cx: number; cy: number; id: number } | null>(null);
  const [dirs, setDirs] = useState<DirState>(NO_DIRS);

  const getCenter = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2 } : { cx: 0, cy: 0 };
  };
  const applyAndSet = useCallback((dx: number, dy: number) => {
    const d = dirsFromCenter(dx, dy);
    touchInputState.moveUp = d.up; touchInputState.moveDown = d.down;
    touchInputState.moveLeft = d.left; touchInputState.moveRight = d.right;
    setDirs(d);
  }, []);
  const release = useCallback(() => { originRef.current = null; clearDpad(); setDirs(NO_DIRS); }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const { cx, cy } = getCenter();
    originRef.current = { cx, cy, id: t.identifier };
    applyAndSet(t.clientX - cx, t.clientY - cy);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const o = originRef.current;
    if (!o) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== o.id) continue;
      applyAndSet(t.clientX - o.cx, t.clientY - o.cy);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const o = originRef.current;
    if (!o) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === o.id) release();
    }
  };
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const { cx, cy } = getCenter();
    originRef.current = { cx, cy, id: -1 };
    applyAndSet(e.clientX - cx, e.clientY - cy);
    const move = (ev: MouseEvent) => { if (originRef.current) applyAndSet(ev.clientX - originRef.current.cx, ev.clientY - originRef.current.cy); };
    const up   = () => { release(); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",   up);
  };

  return (
    <div
      ref={rootRef}
      className="inline-grid grid-cols-[1fr_1.4fr_1fr] grid-rows-[1fr_1.4fr_1fr] w-[110px] h-[110px] select-none touch-none gap-[2px]"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      <div className="rounded-tl-md bg-transparent" />
      <div className={`${armBase} rounded-t-xl text-sm ${dirs.up ? armOn : armOff}`}>▲</div>
      <div className="rounded-tr-md bg-transparent" />
      <div className={`${armBase} rounded-l-xl text-sm ${dirs.left ? armOn : armOff}`}>◀</div>
      <div className="bg-[rgba(10,18,36,0.9)] border border-white/8 rounded-sm" />
      <div className={`${armBase} rounded-r-xl text-sm ${dirs.right ? armOn : armOff}`}>▶</div>
      <div className="rounded-bl-md bg-transparent" />
      <div className={`${armBase} rounded-b-xl text-sm ${dirs.down ? armOn : armOff}`}>▼</div>
      <div className="rounded-br-md bg-transparent" />
    </div>
  );
}

// ─── Single action button ─────────────────────────────────────────────────────

type TouchField = keyof typeof touchInputState;

function ActionBtn({
  field,
  label,
  colorClass,
  size = "w-14 h-14",
  onTapOverride,
}: {
  field: TouchField;
  label: string;
  colorClass: string;
  size?: string;
  /** If provided, fires this function on tap instead of toggling the field. */
  onTapOverride?: () => void;
}) {
  const pressBtn = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (onTapOverride) { onTapOverride(); return; }
    (touchInputState[field] as boolean) = true;
  };
  const releaseBtn = () => {
    if (onTapOverride) return;
    (touchInputState[field] as boolean) = false;
  };
  const mouseDown = (e: React.MouseEvent) => {
    pressBtn(e);
    if (!onTapOverride) {
      const up = () => { releaseBtn(); window.removeEventListener("mouseup", up); };
      window.addEventListener("mouseup", up);
    }
  };

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full border-2 border-white/20 text-white font-bold text-[0.6rem] tracking-[0.04em] select-none touch-none cursor-pointer active:brightness-125 active:scale-95 transition-transform duration-75 ${colorClass}`}
      onTouchStart={pressBtn}
      onTouchEnd={releaseBtn}
      onTouchCancel={releaseBtn}
      onMouseDown={mouseDown}
    >
      {label}
    </div>
  );
}

// ─── Charge button (hold = chargeHeld) ────────────────────────────────────────

function ChargeBtn() {
  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    touchInputState.chargeHeld = true;
  };
  const rel = () => { touchInputState.chargeHeld = false; };
  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    const up = () => { rel(); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };
  return (
    <div
      className="w-20 h-10 rounded-xl bg-[rgba(80,60,10,0.85)] border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-[0.6rem] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(140,110,20,0.9)]"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      CHARGE
    </div>
  );
}

// ─── Special button (tap = specialTap) ───────────────────────────────────────

function SpecialBtn() {
  const fire = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    touchInputState.specialTap = true;
    requestAnimationFrame(() => { touchInputState.specialTap = false; });
  };
  const mouseDown = (e: React.MouseEvent) => { fire(e); };
  return (
    <div
      className="w-20 h-10 rounded-xl bg-[rgba(20,60,100,0.85)] border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-[0.6rem] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(30,90,160,0.9)]"
      onTouchStart={fire} onTouchEnd={() => {}} onTouchCancel={() => {}} onMouseDown={mouseDown}
    >
      SPECIAL
    </div>
  );
}

// ─── Toggle bar ───────────────────────────────────────────────────────────────

function ToggleBar({ hidden, onToggle, onKeys }: { hidden: boolean; onToggle: () => void; onKeys: () => void }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-2 z-[70] flex items-center gap-2">
      <button
        onClick={onKeys}
        className="h-6 px-3 rounded-full bg-[rgba(20,30,50,0.85)] border border-white/20 text-white/60 text-[10px] font-bold select-none cursor-pointer hover:bg-[rgba(40,60,100,0.9)]"
        title="Remap keys"
      >⌨ Keys</button>
      <button
        onClick={onToggle}
        className="h-6 px-3 rounded-full bg-[rgba(20,30,50,0.85)] border border-white/20 text-white/60 text-[10px] font-bold select-none cursor-pointer hover:bg-[rgba(40,60,100,0.9)]"
        title={hidden ? "Show controls" : "Hide controls"}
      >{hidden ? "Show Controls" : "Hide Controls"}</button>
    </div>
  );
}

// ─── Default anchor positions ─────────────────────────────────────────────────
// Each control has a sensible default position relative to a viewport edge.
// These scale with any screen size because they use viewport-relative px offsets.

const DEFAULTS: Record<string, Anchor> = {
  dpad:    { left: 16,  bottom: 200 },
  charge:  { left: 16,  bottom: 92  },
  jump:    { right: 30, bottom: 226 },
  atk:     { right: 96, bottom: 160 },
  def:     { right: 16, bottom: 160 },
  dodge:   { right: 58, bottom: 92  },
  special: { right: 30, bottom: 110 },
};

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  /** @deprecated — children prop kept for API compat but no longer used in overlay mode */
  children?: React.ReactNode;
}

export function TouchControlsGBLayout({ children }: Props) {
  void children; // overlay-only mode now; children not wrapped

  const [hidden, setHidden] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const openKeys  = useCallback(() => setKeysOpen(true),  []);
  const closeKeys = useCallback(() => setKeysOpen(false), []);

  return (
    <>
      {keysOpen && <KeyBindingsPanel onClose={closeKeys} />}
      <ToggleBar hidden={hidden} onToggle={() => setHidden(h => !h)} onKeys={openKeys} />

      {!hidden && (
        <>
          {/* D-pad — bottom-left */}
          <FloatingControl storageKey="tc2-dpad" defaultAnchor={DEFAULTS.dpad} label="D-PAD">
            <CrossDpad />
          </FloatingControl>

          {/* CHARGE — above d-pad */}
          <FloatingControl storageKey="tc2-charge" defaultAnchor={DEFAULTS.charge} label="CHARGE">
            <ChargeBtn />
          </FloatingControl>

          {/* SPECIAL — bottom-right area */}
          <FloatingControl storageKey="tc2-special" defaultAnchor={DEFAULTS.special} label="SPECIAL">
            <SpecialBtn />
          </FloatingControl>

          {/* JUMP — top-right */}
          <FloatingControl storageKey="tc2-jump" defaultAnchor={DEFAULTS.jump} label="JUMP">
            <ActionBtn field="jump" label="JUMP" colorClass="bg-[rgba(80,60,200,0.85)]" />
          </FloatingControl>

          {/* ATK — middle-right */}
          <FloatingControl storageKey="tc2-atk" defaultAnchor={DEFAULTS.atk} label="ATK">
            <ActionBtn field="attack" label="ATK" colorClass="bg-[rgba(200,50,50,0.85)]" />
          </FloatingControl>

          {/* DEF — right of ATK */}
          <FloatingControl storageKey="tc2-def" defaultAnchor={DEFAULTS.def} label="DEF">
            <ActionBtn field="defense" label="DEF" colorClass="bg-[rgba(40,80,200,0.85)]" />
          </FloatingControl>

          {/* DODGE — bottom-right */}
          <FloatingControl storageKey="tc2-dodge" defaultAnchor={DEFAULTS.dodge} label="DODGE">
            <ActionBtn field="dodge" label="DODGE" colorClass="bg-[rgba(30,150,90,0.85)]" />
          </FloatingControl>
        </>
      )}
    </>
  );
}
