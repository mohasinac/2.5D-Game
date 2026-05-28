// TouchControlsGBLayout — individually draggable, orientation-aware touch controls.
//
// Seven controls (D-pad, JUMP, ATK, DEF, DODGE, CHARGE, SPECIAL) are fixed-position
// panels that can be dragged anywhere on-screen; positions persist in localStorage.
//
// – Portrait (phone):   controls default to the bottom strip below the square canvas.
// – Landscape (desktop/ultrawide): D-pad+CHARGE in left gutter, actions in right gutter,
//   both just outside the canvas edges (not at the viewport edge).
// – Edit mode: ⠿ drag-handle + ⌂ snap-back float above each control.  Play mode is clean.
// – ToggleBar (fixed bottom-centre): Hide / ✏ Edit / ✓ Done / ⌨ Keys.

import React, { useRef, useState, useCallback, useEffect } from "react";
import { touchInputState } from "@/game/hooks/useGameInput";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

// ─── Persistence ──────────────────────────────────────────────────────────────

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

// ─── Responsive sizing ────────────────────────────────────────────────────────
// CSS uses: clamp(min, Nvmin, max). JS mirrors those values for layout calc.

function vminPx(): number { return Math.min(window.innerWidth, window.innerHeight) / 100; }
function dpSize():  number { return Math.max(100, Math.min(120, 26 * vminPx())); }
function btnSize(): number { return Math.max(48,  Math.min(64,  13 * vminPx())); }
function barW():    number { return Math.max(72,  Math.min(96,  19 * vminPx())); }
function barH():    number { return Math.max(36,  Math.min(44,   9 * vminPx())); }

// ─── Canvas geometry (mirrors CSS min(100vw,100vh) centred square) ────────────

function getCanvas() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const size = Math.min(vw, vh);
  const cl = (vw - size) / 2;
  const ct = (vh - size) / 2;
  return { cl, ct, cr: cl + size, cb: ct + size, vw, vh };
}

// ─── Orientation helper ───────────────────────────────────────────────────────

/** Returns 'ls' when landscape (width > height + 50px threshold), else 'pt'. */
function currentOrient(): 'pt' | 'ls' {
  return window.innerWidth > window.innerHeight + 50 ? 'ls' : 'pt';
}

// ─── Default position — canvas-relative, orientation-aware ───────────────────
//
// Portrait (phone): controls in the horizontal strip below the canvas.
// Landscape:        D-pad + CHARGE just outside canvas left edge;
//                   action buttons + SPECIAL just outside canvas right edge.
//   This keeps controls next to the canvas on any screen width — including
//   ultrawide monitors where the gutters are 1000 px wide.

function computeDefaultPos(key: string): Pos {
  const { cl, cr, cb, vw, vh } = getCanvas();
  const portrait = vh > vw + 50;
  const pad = 12;
  const dp = dpSize(), btn = btnSize(), bW = barW(), bH = barH();

  if (portrait) {
    // Row 1 (bars): CHARGE left, SPECIAL right — just below canvas
    const r1y = cb + pad;
    // Row 2 (squares): DPAD left; JUMP + DEF right; ATK + DODGE below them
    const r2y = r1y + bH + 8;
    switch (key) {
      case "charge":  return { x: pad,                        y: r1y };
      case "special": return { x: vw - pad - bW,              y: r1y };
      case "dpad":    return { x: pad,                        y: r2y };
      case "jump":    return { x: vw - pad - btn,             y: r2y };
      case "def":     return { x: vw - pad - btn * 2 - 6,    y: r2y };
      case "atk":     return { x: vw - pad - btn,             y: r2y + btn + 6 };
      case "dodge":   return { x: vw - pad - btn * 2 - 6,    y: r2y + btn + 6 };
    }
  } else {
    const midY = vh / 2;
    // On narrow-gutter landscape phones the left gutter may overlap the notch area.
    // Push controls 44 px inward when the gutter is < 160 px (typical of landscape phones,
    // e.g. iPhone SE 375 px wide → cl ≈ 2 px). Desktop/tablet (cl ≥ 160) is unchanged.
    const notchBuf = cl < 160 ? 44 : 0;
    // Left gutter — flush to canvas left edge (with notch buffer)
    const lx = Math.max(pad + notchBuf, cl - dp - pad);
    // Right gutter — flush to canvas right edge (with notch buffer)
    const rx = cr + pad + notchBuf;
    switch (key) {
      case "dpad":    return { x: lx,                     y: midY - dp / 2 };
      case "charge":  return { x: lx + (dp - bW) / 2,    y: midY + dp / 2 + 8 };
      case "jump":    return { x: rx,                     y: midY - btn * 1.5 - 6 };
      case "special": return { x: rx + btn + 6,           y: midY - btn * 1.5 - 6 };
      case "def":     return { x: rx,                     y: midY - btn / 2 };
      case "atk":     return { x: rx + btn + 6,           y: midY - btn / 2 };
      case "dodge":   return { x: rx,                     y: midY + btn / 2 + 6 };
    }
  }
  return { x: pad, y: vh / 2 };
}

// ─── FloatingControl ─────────────────────────────────────────────────────────
// Fixed-position wrapper. The drag toolbar floats ABOVE the control element via
// `absolute bottom-full` so pos.x/pos.y always refers to the CONTENT position,
// regardless of whether editMode is active.

function FloatingControl({
  storageKey,
  label,
  editMode,
  children,
}: {
  storageKey: string;
  label: string;
  editMode: boolean;
  children: React.ReactNode;
}) {
  const elRef   = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ sp: Pos; se: Pos } | null>(null);
  const ctrlKey = storageKey.replace("tc2-", "");

  // ── Orientation-specific keys ────────────────────────────────────────────────
  // Each orientation gets its own localStorage key (e.g. "tc2-dpad-pt" / "tc2-dpad-ls").
  // Old unoriented keys are ignored; fresh defaults are computed per orientation on first use.
  const orientRef = useRef<'pt' | 'ls'>(currentOrient());
  const [orient, setOrient] = useState<'pt' | 'ls'>(currentOrient);
  const activeKey = `${storageKey}-${orient}`;

  const [pos, setPos] = useState<Pos>(() => {
    const o = currentOrient();
    return loadPos(`${storageKey}-${o}`) ?? { x: 0, y: 0 };
  });
  const [ready, setReady] = useState(() =>
    loadPos(`${storageKey}-${currentOrient()}`) !== null
  );

  // First mount: compute anchor-based default if no stored position.
  useEffect(() => {
    if (!ready) { setPos(computeDefaultPos(ctrlKey)); setReady(true); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resize / orientation-change handler.
  // Uses orientRef so the closure is never stale, while setOrient triggers a re-render
  // so activeKey updates and subsequent saves/clears use the correct key.
  useEffect(() => {
    const handleResize = () => {
      const newOrient = currentOrient();
      if (newOrient !== orientRef.current) {
        // Orientation flipped — switch to new orientation's key and restore position.
        orientRef.current = newOrient;
        setOrient(newOrient);
        const stored = loadPos(`${storageKey}-${newOrient}`);
        if (stored) {
          setPos(stored);
        } else {
          // rAF: give the browser one frame to settle viewport dims after rotation.
          requestAnimationFrame(() => setPos(computeDefaultPos(ctrlKey)));
        }
      } else {
        // Same orientation — clamp current position to the (possibly resized) viewport.
        const el = elRef.current;
        if (!el) return;
        const { vw, vh } = getCanvas();
        setPos(p => ({
          x: Math.max(0, Math.min(p.x, vw - el.offsetWidth)),
          y: Math.max(0, Math.min(p.y, vh - el.offsetHeight)),
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentional: uses orientRef

  const onDragDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = elRef.current?.getBoundingClientRect();
    dragRef.current = {
      sp: { x: e.clientX, y: e.clientY },
      se: r ? { x: r.left, y: r.top } : { x: pos.x, y: pos.y },
    };
  };
  const onDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const np = {
      x: dragRef.current.se.x + (e.clientX - dragRef.current.sp.x),
      y: dragRef.current.se.y + (e.clientY - dragRef.current.sp.y),
    };
    setPos(np);
    savePos(activeKey, np);  // save to orientation-specific key
  };
  const onDragUp = () => { dragRef.current = null; };

  const snapBack = () => {
    const p = computeDefaultPos(ctrlKey);
    setPos(p);
    clearPos(activeKey);  // clear orientation-specific key
  };

  return (
    <div ref={elRef} className="fixed z-[60] select-none touch-none" style={{ left: pos.x, top: pos.y }}>
      {/* Edit-mode toolbar — floats ABOVE the control so content position is unchanged */}
      {editMode && (
        <div className="absolute bottom-full left-0 mb-[3px] flex items-center gap-1 whitespace-nowrap pointer-events-auto">
          <span className="text-[8px] text-white/25 font-mono leading-none">{label}</span>
          <button
            className="w-5 h-5 rounded-full bg-[rgba(8,16,36,0.95)] border border-white/15 text-white/50 hover:text-white text-[11px] flex items-center justify-center cursor-pointer active:scale-90"
            title="Snap back to default"
            onClick={snapBack}
          >⌂</button>
          <button
            className="w-5 h-5 rounded-full bg-[rgba(8,16,36,0.95)] border border-white/15 text-white/50 hover:text-white text-[11px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            title="Drag to reposition"
            onPointerDown={onDragDown}
            onPointerMove={onDragMove}
            onPointerUp={onDragUp}
            onPointerCancel={onDragUp}
          >⠿</button>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── D-pad ────────────────────────────────────────────────────────────────────

const DPAD_DEAD_FRAC = 0.15; // fraction of element size that counts as dead zone

interface DirState { up: boolean; down: boolean; left: boolean; right: boolean }
const NO_DIRS: DirState = { up: false, down: false, left: false, right: false };

function dirsFrom(dx: number, dy: number, dead: number): DirState {
  return { up: dy < -dead, down: dy > dead, left: dx < -dead, right: dx > dead };
}
function clearDpad() {
  touchInputState.moveUp = touchInputState.moveDown =
  touchInputState.moveLeft = touchInputState.moveRight = false;
}

const armBase = "flex items-center justify-center select-none touch-none text-sm";
const armOff  = "bg-[rgba(16,28,60,0.88)] border-2 border-white/10 text-white/30 transition-colors duration-75";
const armOn   = "bg-[rgba(55,115,255,0.93)] border-2 border-white/50 text-white/95 transition-colors duration-75";

function CrossDpad() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ cx: number; cy: number; id: number } | null>(null);
  const [dirs, setDirs] = useState<DirState>(NO_DIRS);

  const center = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2 } : { cx: 0, cy: 0 };
  };
  const dead = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? r.width * DPAD_DEAD_FRAC : 16;
  };

  const apply = useCallback((dx: number, dy: number) => {
    const d = dirsFrom(dx, dy, dead());
    touchInputState.moveUp = d.up; touchInputState.moveDown = d.down;
    touchInputState.moveLeft = d.left; touchInputState.moveRight = d.right;
    setDirs(d);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const release = useCallback(() => {
    originRef.current = null; clearDpad(); setDirs(NO_DIRS);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const { cx, cy } = center();
    originRef.current = { cx, cy, id: t.identifier };
    apply(t.clientX - cx, t.clientY - cy);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const o = originRef.current; if (!o) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === o.id) apply(t.clientX - o.cx, t.clientY - o.cy);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const o = originRef.current; if (!o) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === o.id) release();
    }
  };
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const { cx, cy } = center();
    originRef.current = { cx, cy, id: -1 };
    apply(e.clientX - cx, e.clientY - cy);
    const move = (ev: MouseEvent) => {
      if (originRef.current) apply(ev.clientX - originRef.current.cx, ev.clientY - originRef.current.cy);
    };
    const up = () => { release(); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",   up);
  };

  return (
    <div
      ref={rootRef}
      style={{ width: "clamp(100px,26vmin,120px)", height: "clamp(100px,26vmin,120px)" }}
      className="inline-grid grid-cols-[1fr_1.4fr_1fr] grid-rows-[1fr_1.4fr_1fr] gap-[2px] select-none touch-none"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      <div className="bg-transparent" />
      <div className={`${armBase} rounded-t-xl ${dirs.up ? armOn : armOff}`}>▲</div>
      <div className="bg-transparent" />
      <div className={`${armBase} rounded-l-xl ${dirs.left ? armOn : armOff}`}>◀</div>
      <div className="bg-[rgba(6,12,28,0.9)] border border-white/8 rounded-sm" />
      <div className={`${armBase} rounded-r-xl ${dirs.right ? armOn : armOff}`}>▶</div>
      <div className="bg-transparent" />
      <div className={`${armBase} rounded-b-xl ${dirs.down ? armOn : armOff}`}>▼</div>
      <div className="bg-transparent" />
    </div>
  );
}

// ─── Single action button ─────────────────────────────────────────────────────

type TouchField = keyof typeof touchInputState;

function ActionBtn({
  field,
  label,
  colorClass,
  onTapOverride,
}: {
  field: TouchField;
  label: string;
  colorClass: string;
  onTapOverride?: () => void;
}) {
  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (onTapOverride) { onTapOverride(); return; }
    (touchInputState[field] as boolean) = true;
  };
  const rel = () => {
    if (!onTapOverride) (touchInputState[field] as boolean) = false;
  };
  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    if (!onTapOverride) {
      const up = () => { rel(); window.removeEventListener("mouseup", up); };
      window.addEventListener("mouseup", up);
    }
  };
  return (
    <div
      style={{ width: "clamp(48px,13vmin,64px)", height: "clamp(48px,13vmin,64px)" }}
      className={`flex items-center justify-center rounded-full border-2 border-white/25 text-white font-bold text-[10px] tracking-[0.05em] select-none touch-none cursor-pointer active:brightness-125 active:scale-95 transition-transform duration-75 ${colorClass}`}
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >{label}</div>
  );
}

// ─── CHARGE button (hold) ─────────────────────────────────────────────────────

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
      style={{ width: "clamp(72px,19vmin,96px)", height: "clamp(36px,9vmin,44px)" }}
      className="rounded-xl bg-[rgba(75,55,6,0.90)] border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-[10px] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(130,100,15,0.95)] transition-colors"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >CHARGE</div>
  );
}

// ─── SPECIAL button (tap) ─────────────────────────────────────────────────────

function SpecialBtn() {
  const fire = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    touchInputState.specialTap = true;
    requestAnimationFrame(() => { touchInputState.specialTap = false; });
  };
  const mouseDown = (e: React.MouseEvent) => fire(e);
  return (
    <div
      style={{ width: "clamp(72px,19vmin,96px)", height: "clamp(36px,9vmin,44px)" }}
      className="rounded-xl bg-[rgba(18,56,118,0.90)] border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-[10px] tracking-widest select-none touch-none cursor-pointer active:bg-[rgba(28,88,170,0.95)] transition-colors"
      onTouchStart={fire} onTouchEnd={() => {}} onTouchCancel={() => {}} onMouseDown={mouseDown}
    >SPECIAL</div>
  );
}

// ─── ToggleBar ────────────────────────────────────────────────────────────────

const TB_BTN = "h-7 px-3 rounded-full bg-[rgba(8,16,38,0.92)] border border-white/15 text-white/55 text-[10px] font-bold select-none cursor-pointer hover:bg-[rgba(25,45,95,0.95)] hover:text-white/85 active:scale-95 transition-all duration-100";

function ToggleBar({ hidden, editMode, onToggle, onEdit, onKeys }: {
  hidden: boolean; editMode: boolean;
  onToggle: () => void; onEdit: () => void; onKeys: () => void;
}) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1.5 pointer-events-auto"
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
    >
      {hidden ? (
        <button onClick={onToggle} className={TB_BTN}>🕹 Controls</button>
      ) : editMode ? (
        <>
          <button onClick={onEdit}   className={`${TB_BTN} border-blue-500/35 text-blue-300/80`}>✓ Done</button>
          <button onClick={onKeys}   className={TB_BTN}>⌨ Keys</button>
          <button onClick={onToggle} className={TB_BTN}>Hide</button>
        </>
      ) : (
        <>
          <button onClick={onEdit}   className={TB_BTN}>✏ Edit</button>
          <button onClick={onKeys}   className={TB_BTN}>⌨ Keys</button>
          <button onClick={onToggle} className={TB_BTN}>Hide</button>
        </>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  /** @deprecated — overlay-only mode; children are not wrapped */
  children?: React.ReactNode;
}

export function TouchControlsGBLayout({ children }: Props) {
  void children;

  const [hidden,   setHidden]   = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);

  const toggleHidden = useCallback(() => setHidden(h => !h), []);
  const toggleEdit   = useCallback(() => setEditMode(e => !e), []);
  const openKeys     = useCallback(() => setKeysOpen(true),  []);
  const closeKeys    = useCallback(() => setKeysOpen(false), []);

  return (
    <>
      {keysOpen && <KeyBindingsPanel onClose={closeKeys} />}

      <ToggleBar
        hidden={hidden}
        editMode={editMode}
        onToggle={toggleHidden}
        onEdit={toggleEdit}
        onKeys={openKeys}
      />

      {!hidden && (
        <>
          {/* D-pad — move */}
          <FloatingControl storageKey="tc2-dpad" label="D-PAD" editMode={editMode}>
            <CrossDpad />
          </FloatingControl>

          {/* CHARGE — hold to charge spin/power */}
          <FloatingControl storageKey="tc2-charge" label="CHARGE" editMode={editMode}>
            <ChargeBtn />
          </FloatingControl>

          {/* SPECIAL — tap to fire special move */}
          <FloatingControl storageKey="tc2-special" label="SPECIAL" editMode={editMode}>
            <SpecialBtn />
          </FloatingControl>

          {/* JUMP */}
          <FloatingControl storageKey="tc2-jump" label="JUMP" editMode={editMode}>
            <ActionBtn field="jump"    label="JUMP"  colorClass="bg-[rgba(75,45,200,0.90)]" />
          </FloatingControl>

          {/* ATK */}
          <FloatingControl storageKey="tc2-atk" label="ATK" editMode={editMode}>
            <ActionBtn field="attack"  label="ATK"   colorClass="bg-[rgba(195,40,40,0.90)]" />
          </FloatingControl>

          {/* DEF */}
          <FloatingControl storageKey="tc2-def" label="DEF" editMode={editMode}>
            <ActionBtn field="defense" label="DEF"   colorClass="bg-[rgba(28,78,210,0.90)]" />
          </FloatingControl>

          {/* DODGE */}
          <FloatingControl storageKey="tc2-dodge" label="DODGE" editMode={editMode}>
            <ActionBtn field="dodge"   label="DODGE" colorClass="bg-[rgba(22,140,80,0.90)]" />
          </FloatingControl>
        </>
      )}
    </>
  );
}
