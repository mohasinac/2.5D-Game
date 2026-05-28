// TouchControlsGBLayout — Game Boy Color (portrait) / Game Boy Advance (landscape) shell.
//
// Portrait  → GBC layout: screen centred, controls below (D-pad left, B/A right, SELECT/START centre)
// Landscape → GBA layout: screen centred, D-pad left gutter, B/A right gutter, L/R shoulder tabs
//
// Button mapping:
//   D-pad  → moveLeft/Right/Up/Down
//   A      → ATK (attack)
//   B      → DEF (defense)
//   L tab  → CHARGE (hold)
//   R tab  → SPECIAL (tap)
//   SELECT → JUMP
//   START  → DODGE
//
// The exit button lives near the SELECT/START row — same position on both orientations.

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { touchInputState } from "@/game/hooks/useGameInput";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

// ─── Canvas geometry (mirrors CSS min(100vw,100vh) centred square) ────────────

interface CanvInfo { cl: number; ct: number; cr: number; cb: number; vw: number; vh: number; size: number }

function getCanvas(): CanvInfo {
  const vw = window.innerWidth, vh = window.innerHeight;
  const size = Math.min(vw, vh);
  const cl = (vw - size) / 2;
  const ct = (vh - size) / 2;
  return { cl, ct, cr: cl + size, cb: ct + size, vw, vh, size };
}

function currentOrient(): 'pt' | 'ls' {
  return window.innerWidth > window.innerHeight + 50 ? 'ls' : 'pt';
}

// ─── Sizing helpers ────────────────────────────────────────────────────────────

function vmin(): number { return Math.min(window.innerWidth, window.innerHeight) / 100; }
function dpSize():  number { return Math.max(88,  Math.min(112, Math.round(23 * vmin()))); }
function aSize():   number { return Math.max(56,  Math.min(72,  Math.round(15 * vmin()))); }
function bSize():   number { return Math.max(44,  Math.min(58,  Math.round(12 * vmin()))); }
function selH():    number { return Math.max(22,  Math.min(28,  Math.round(6  * vmin()))); }
function selW():    number { return Math.max(46,  Math.min(56,  Math.round(12 * vmin()))); }
function shH():     number { return Math.max(26,  Math.min(34,  Math.round(7  * vmin()))); }

// ─── Theme ────────────────────────────────────────────────────────────────────

const BODY   = '#14142a';   // device body
const BEZEL  = '#07070e';   // screen bezel
const BEZEL_W = 12;         // bezel thickness px

// ─── D-pad ────────────────────────────────────────────────────────────────────

const DPAD_DEAD = 0.18;

interface DirState { up: boolean; down: boolean; left: boolean; right: boolean }
const NO_DIRS: DirState = { up: false, down: false, left: false, right: false };

function dirsFrom(dx: number, dy: number, dead: number): DirState {
  return { up: dy < -dead, down: dy > dead, left: dx < -dead, right: dx > dead };
}
function clearDpad() {
  touchInputState.moveUp = touchInputState.moveDown =
  touchInputState.moveLeft = touchInputState.moveRight = false;
}

function CrossDpad({ size }: { size: number }) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ cx: number; cy: number; id: number } | null>(null);
  const [dirs, setDirs] = useState<DirState>(NO_DIRS);

  const center = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2 } : { cx: 0, cy: 0 };
  };
  const dead = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? r.width * DPAD_DEAD : 16;
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

  const arm   = (on: boolean) => `${on ? 'bg-[#3a5aff] border-white/30' : 'bg-[#1c1c38] border-white/8'} border flex items-center justify-center transition-colors duration-75 select-none touch-none`;
  const third  = Math.round(size / 3);
  const center_ = Math.round(size * 1.4 / 3);

  return (
    <div
      ref={rootRef}
      style={{ width: size, height: size, display: 'grid', gridTemplateColumns: `${third}px ${center_}px ${third}px`, gridTemplateRows: `${third}px ${center_}px ${third}px`, gap: 2 }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
      onMouseDown={onMouseDown}
      className="select-none touch-none"
    >
      <div />
      <div className={`${arm(dirs.up)} rounded-t-lg`} />
      <div />
      <div className={`${arm(dirs.left)} rounded-l-lg`} />
      <div className="bg-[#10103a] border border-white/6 rounded-sm" />
      <div className={`${arm(dirs.right)} rounded-r-lg`} />
      <div />
      <div className={`${arm(dirs.down)} rounded-b-lg`} />
      <div />
    </div>
  );
}

// ─── Action button (A / B) ────────────────────────────────────────────────────

type TouchField = keyof typeof touchInputState;

function GBBtn({
  field, label, size, bg, border,
  onTapOverride,
}: {
  field?: TouchField; label: string; size: number;
  bg: string; border: string;
  onTapOverride?: () => void;
}) {
  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (onTapOverride) { onTapOverride(); return; }
    if (field) (touchInputState[field] as boolean) = true;
  };
  const rel = () => {
    if (!onTapOverride && field) (touchInputState[field] as boolean) = false;
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
      style={{ width: size, height: size, borderRadius: '50%', background: bg, border: `2px solid ${border}`, boxShadow: `0 3px 0 ${border}` }}
      className="flex items-center justify-center font-black text-white select-none touch-none cursor-pointer active:scale-90 active:translate-y-[2px] active:shadow-none transition-transform duration-75"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      <span style={{ fontSize: Math.max(10, Math.round(size * 0.22)), letterSpacing: '0.04em' }}>{label}</span>
    </div>
  );
}

// ─── Charge button (hold) ─────────────────────────────────────────────────────

function ChargeBtn({ size }: { size: number }) {
  const press = (e: React.TouchEvent | React.MouseEvent) => { e.preventDefault(); touchInputState.chargeHeld = true; };
  const rel   = () => { touchInputState.chargeHeld = false; };
  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    const up = () => { rel(); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };
  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%', boxShadow: '0 3px 0 #7a5500' }}
      className="flex items-center justify-center font-black text-amber-200 text-[9px] tracking-widest select-none touch-none cursor-pointer active:scale-90 transition-transform duration-75 bg-[#3d2c00] border-2 border-amber-500/60"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      <span style={{ fontSize: Math.max(8, Math.round(size * 0.18)) }}>CHG</span>
    </div>
  );
}

// ─── Special button (tap) ─────────────────────────────────────────────────────

function SpecialBtn({ size }: { size: number }) {
  const fire = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    touchInputState.specialTap = true;
    requestAnimationFrame(() => { touchInputState.specialTap = false; });
  };
  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%', boxShadow: '0 3px 0 #1a4090' }}
      className="flex items-center justify-center font-black text-blue-200 text-[9px] tracking-widest select-none touch-none cursor-pointer active:scale-90 transition-transform duration-75 bg-[#0c2060] border-2 border-blue-400/60"
      onTouchStart={fire} onTouchEnd={() => {}} onTouchCancel={() => {}} onMouseDown={fire}
    >
      <span style={{ fontSize: Math.max(8, Math.round(size * 0.16)) }}>SPC</span>
    </div>
  );
}

// ─── Small pill button (SELECT / START / EXIT) ────────────────────────────────

function PillBtn({ label, field, onTap, w, h, accent = false }: {
  label: string; field?: TouchField; onTap?: () => void; w: number; h: number; accent?: boolean;
}) {
  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (onTap) { onTap(); return; }
    if (field) (touchInputState[field] as boolean) = true;
  };
  const rel = () => { if (field) (touchInputState[field] as boolean) = false; };
  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    if (field) {
      const up = () => { rel(); window.removeEventListener("mouseup", up); };
      window.addEventListener("mouseup", up);
    }
  };
  return (
    <div
      style={{ width: w, height: h, borderRadius: h / 2 }}
      className={`flex items-center justify-center font-bold select-none touch-none cursor-pointer active:scale-95 transition-transform duration-75 ${accent ? 'bg-[#c0392b] border border-red-400/50 text-red-100' : 'bg-[#1c1c3e] border border-white/15 text-white/55'}`}
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      <span style={{ fontSize: Math.max(7, Math.round(h * 0.45)), letterSpacing: '0.08em' }}>{label}</span>
    </div>
  );
}

// ─── Shoulder tab button ──────────────────────────────────────────────────────

function ShoulderTab({
  side, label, hold, onTap, w, h,
}: {
  side: 'l' | 'r'; label: string; hold?: boolean;
  onTap?: () => void; w: number; h: number;
}) {
  const press = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (hold) touchInputState.chargeHeld = true;
    else if (onTap) onTap();
  };
  const rel = () => { if (hold) touchInputState.chargeHeld = false; };
  const mouseDown = (e: React.MouseEvent) => {
    press(e);
    if (hold) {
      const up = () => { rel(); window.removeEventListener("mouseup", up); };
      window.addEventListener("mouseup", up);
    }
  };
  return (
    <div
      style={{ width: w, height: h, borderRadius: side === 'l' ? '10px 10px 0 10px' : '10px 10px 10px 0', background: '#1f1f40', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
      className="flex items-center justify-center font-bold text-white/50 select-none touch-none cursor-pointer active:brightness-125 transition-all duration-75"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      <span style={{ fontSize: Math.max(8, Math.round(h * 0.4)), letterSpacing: '0.1em' }}>{label}</span>
    </div>
  );
}

// ─── GBC Portrait frame ───────────────────────────────────────────────────────

function GBCFrame({ canv, onHide, onKeys }: { canv: CanvInfo; onHide: () => void; onKeys: () => void }) {
  const { cl, ct, cr, cb, vw, vh, size } = canv;
  const dp   = dpSize();
  const btnA = aSize();
  const btnB = bSize();
  const sW   = selW();
  const sH   = selH();
  const shh  = shH();
  const shw  = Math.min(Math.round(vw * 0.22), 88);
  const nav  = useNavigate();

  // ── Controls go into bottom strip (cb → vh)
  // Position WITHIN that strip (all y coords relative to cb):
  const stripH  = vh - cb;
  const ctrlTop = Math.round(stripH * 0.1);
  const rowMid  = Math.round(stripH * 0.18);
  const rowBot  = Math.round(stripH * 0.65);

  // D-pad: left side, vertically centred in upper half
  const dpLeft = Math.round(Math.max(10, cl + 10));
  const dpTop  = cb + ctrlTop;

  // B button: right area, above A
  const aRight = Math.round(Math.max(14, (vw - cr) + 14));
  const aTop   = cb + ctrlTop + Math.round((dp - btnA) / 2) + 6;
  const bRight = aRight + btnA + 10;
  const bTop   = cb + ctrlTop + Math.round((dp - btnB) / 2);

  // SELECT/START/EXIT row (near bottom of strip)
  const pillRowY = cb + rowBot;
  const pillCx   = vw / 2;

  return (
    <>
      {/* TOP BODY (above canvas) */}
      <div
        style={{ position: 'fixed', left: 0, top: 0, right: 0, height: Math.max(0, ct), background: BODY, borderRadius: '18px 18px 0 0', zIndex: 52, pointerEvents: 'none' }}
      >
        <div style={{ position: 'absolute', left: 14, top: 10, width: 8, height: 8, borderRadius: '50%', background: '#ff3333', boxShadow: '0 0 7px #ff3333' }} />
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', fontWeight: 800, whiteSpace: 'nowrap' }}>BEYBLADE X</div>
      </div>

      {/* SCREEN BEZEL — transparent centre, border ring only */}
      <div
        style={{ position: 'fixed', left: cl, top: ct, width: size, height: size, boxShadow: `0 0 0 ${BEZEL_W}px ${BEZEL}`, borderRadius: 6, zIndex: 51, pointerEvents: 'none', background: 'transparent' }}
      />

      {/* L SHOULDER (CHARGE) */}
      <div style={{ position: 'fixed', left: 0, top: ct - shh, zIndex: 60, pointerEvents: 'auto' }}>
        <ShoulderTab side="l" label="CHG" hold w={shw} h={shh} />
      </div>

      {/* R SHOULDER (SPECIAL) */}
      <div style={{ position: 'fixed', right: 0, top: ct - shh, zIndex: 60, pointerEvents: 'auto' }}>
        <ShoulderTab side="r" label="SPC" onTap={() => { touchInputState.specialTap = true; requestAnimationFrame(() => { touchInputState.specialTap = false; }); }} w={shw} h={shh} />
      </div>

      {/* BOTTOM BODY (below canvas) */}
      <div
        style={{ position: 'fixed', left: 0, top: cb, right: 0, bottom: 0, background: BODY, borderRadius: '0 0 36px 36px', zIndex: 52, pointerEvents: 'none' }}
      />

      {/* D-PAD */}
      <div style={{ position: 'fixed', left: dpLeft, top: dpTop, zIndex: 60, pointerEvents: 'auto' }}>
        <CrossDpad size={dp} />
      </div>

      {/* DEF BUTTON — above ATK, shifted left */}
      <div style={{ position: 'fixed', right: bRight, top: bTop, zIndex: 60, pointerEvents: 'auto' }}>
        <GBBtn field="defense" label="DEF" size={btnB} bg="#0d3380" border="#2255bb" />
      </div>

      {/* ATK BUTTON — right */}
      <div style={{ position: 'fixed', right: aRight, top: aTop, zIndex: 60, pointerEvents: 'auto' }}>
        <GBBtn field="attack" label="ATK" size={btnA} bg="#881122" border="#cc2233" />
      </div>

      {/* JMP + DGE + EXIT row (near bottom of strip) */}
      <div style={{ position: 'fixed', top: pillRowY, left: pillCx - sW * 1.8, zIndex: 60, pointerEvents: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <PillBtn label="EXIT" onTap={() => nav('/game')} w={sW} h={sH} accent />
        <PillBtn label="JMP" field="jump"  w={sW} h={sH} />
        <PillBtn label="DGE" field="dodge" w={sW} h={sH} />
      </div>

      {/* Toggle bar */}
      <div style={{ position: 'fixed', bottom: 'max(6px, env(safe-area-inset-bottom,0px))', left: '50%', transform: 'translateX(-50%)', zIndex: 70, display: 'flex', gap: 6 }}>
        <button onClick={onHide} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Hide</button>
        <button onClick={onKeys} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Keys</button>
      </div>
    </>
  );
}

// ─── GBA Landscape frame ──────────────────────────────────────────────────────

function GBAFrame({ canv, onHide, onKeys }: { canv: CanvInfo; onHide: () => void; onKeys: () => void }) {
  const { cl, ct, cr, cb, vw, vh, size } = canv;
  const dp   = dpSize();
  const btnA = aSize();
  const btnB = bSize();
  const sW   = selW();
  const sH   = selH();
  const shh  = shH();
  const nav  = useNavigate();

  // GBA: canvas fills full height (ct≈0, cb≈vh)
  // Left gutter: 0→cl  Right gutter: cr→vw
  const leftGutterW  = cl;
  const rightGutterW = vw - cr;

  // Shoulder tabs span entire gutter width at top
  const lShW = Math.min(leftGutterW,  Math.round(leftGutterW  * 0.88));
  const rShW = Math.min(rightGutterW, Math.round(rightGutterW * 0.88));

  // D-pad: centred vertically in left gutter, flush right (near canvas edge)
  const dpLeft  = Math.max(4, cl - dp - 16);
  const dpTop   = (vh - dp) / 2;

  // A (ATK): near canvas right edge, vertically centred
  const aLeft = cr + 16;
  const aTop  = (vh - btnA) / 2 + 8;
  // B (DEF): to the upper-left of A — proper GBA diagonal offset, no overlap
  const bLeft = aLeft - Math.round(btnA * 0.5);
  const bTop  = aTop - Math.round(btnA * 0.55 + btnB * 0.5);

  // SELECT/START/EXIT: below canvas centre (or within gutter if no bottom space)
  const pillY = (vh - sH) / 2 + Math.round(size * 0.35);
  const pillCx = vw / 2;

  return (
    <>
      {/* LEFT BODY */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: leftGutterW, bottom: 0, background: BODY, zIndex: 52, pointerEvents: 'none' }} />

      {/* RIGHT BODY */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: rightGutterW, bottom: 0, background: BODY, zIndex: 52, pointerEvents: 'none' }} />

      {/* TOP BODY (narrow strip above canvas if any) */}
      {ct > 0 && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, height: ct, background: BODY, zIndex: 52, pointerEvents: 'none' }} />
      )}
      {/* BOTTOM BODY (narrow strip below canvas if any) */}
      {cb < vh && (
        <div style={{ position: 'fixed', left: 0, top: cb, right: 0, bottom: 0, background: BODY, zIndex: 52, pointerEvents: 'none' }} />
      )}

      {/* SCREEN BEZEL — transparent centre, border ring only */}
      <div style={{ position: 'fixed', left: cl, top: ct, width: size, height: size, boxShadow: `0 0 0 ${BEZEL_W}px ${BEZEL}`, borderRadius: 6, zIndex: 51, pointerEvents: 'none', background: 'transparent' }} />

      {/* L SHOULDER (CHARGE) — top of left gutter */}
      <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 60, pointerEvents: 'auto' }}>
        <ShoulderTab side="l" label="CHG" hold w={lShW} h={shh} />
      </div>

      {/* R SHOULDER (SPECIAL) — top of right gutter */}
      <div style={{ position: 'fixed', right: 0, top: 0, zIndex: 60, pointerEvents: 'auto' }}>
        <ShoulderTab side="r" label="SPC" onTap={() => { touchInputState.specialTap = true; requestAnimationFrame(() => { touchInputState.specialTap = false; }); }} w={rShW} h={shh} />
      </div>

      {/* D-PAD (left gutter) */}
      <div style={{ position: 'fixed', left: dpLeft, top: dpTop, zIndex: 60, pointerEvents: 'auto' }}>
        <CrossDpad size={dp} />
      </div>

      {/* DEF BUTTON — upper-left of ATK, no overlap */}
      <div style={{ position: 'fixed', left: bLeft, top: bTop, zIndex: 60, pointerEvents: 'auto' }}>
        <GBBtn field="defense" label="DEF" size={btnB} bg="#0d3380" border="#2255bb" />
      </div>

      {/* ATK BUTTON */}
      <div style={{ position: 'fixed', left: aLeft, top: aTop, zIndex: 60, pointerEvents: 'auto' }}>
        <GBBtn field="attack" label="ATK" size={btnA} bg="#881122" border="#cc2233" />
      </div>

      {/* JMP + DGE + EXIT (centre-bottom area) */}
      <div style={{ position: 'fixed', top: pillY, left: pillCx - sW * 1.8, zIndex: 60, pointerEvents: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <PillBtn label="EXIT" onTap={() => nav('/game')} w={sW} h={sH} accent />
        <PillBtn label="JMP" field="jump"  w={sW} h={sH} />
        <PillBtn label="DGE" field="dodge" w={sW} h={sH} />
      </div>

      {/* Power LED */}
      <div style={{ position: 'fixed', left: cl + 8, top: ct + 8, width: 7, height: 7, borderRadius: '50%', background: '#ff3333', boxShadow: '0 0 6px #ff3333', zIndex: 60 }} />

      {/* Toggle bar */}
      <div style={{ position: 'fixed', bottom: 'max(6px, env(safe-area-inset-bottom,0px))', left: '50%', transform: 'translateX(-50%)', zIndex: 70, display: 'flex', gap: 6 }}>
        <button onClick={onHide} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Hide</button>
        <button onClick={onKeys} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Keys</button>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function TouchControlsGBLayout() {
  const [hidden,   setHidden]   = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [canv,     setCanv]     = useState<CanvInfo>(getCanvas);
  const [orient,   setOrient]   = useState<'pt' | 'ls'>(currentOrient);

  useEffect(() => {
    const handler = () => {
      setCanv(getCanvas());
      setOrient(currentOrient());
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const onHide = useCallback(() => setHidden(true),  []);
  const onKeys = useCallback(() => setKeysOpen(true), []);

  if (keysOpen) {
    return <KeyBindingsPanel onClose={() => setKeysOpen(false)} />;
  }

  if (hidden) {
    return (
      <div style={{ position: 'fixed', bottom: 'max(12px, env(safe-area-inset-bottom,0px))', left: '50%', transform: 'translateX(-50%)', zIndex: 70 }}>
        <button
          onClick={() => setHidden(false)}
          className="h-7 px-3 rounded-full bg-[rgba(8,16,38,0.92)] border border-white/15 text-white/55 text-[10px] font-bold"
        >
          🕹 Controls
        </button>
      </div>
    );
  }

  const props = { canv, onHide, onKeys };
  return orient === 'pt' ? <GBCFrame {...props} /> : <GBAFrame {...props} />;
}
