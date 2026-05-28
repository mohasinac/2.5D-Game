// TouchControlsGBLayout — Game Boy Color (portrait) / Game Boy Advance (landscape) shell.
//
// Portrait  → GBC layout: screen at top, controls below (D-pad left, B/A right, SELECT/START centre)
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

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { touchInputState } from "@/game/hooks/useGameInput";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

// ─── Canvas geometry (mirrors CSS min(100vw,100vh) centred square) ────────────

interface CanvInfo { cl: number; ct: number; cr: number; cb: number; vw: number; vh: number; size: number }

function getCanvas(): CanvInfo {
  const vw = window.innerWidth, vh = window.innerHeight;
  const portrait = vh > vw + 50;
  const size = Math.min(vw, vh);
  const cl = (vw - size) / 2;
  // Portrait: canvas sits at TOP so control area is in thumb reach zone
  // Landscape: canvas centred (gutters left/right)
  const ct = portrait ? 0 : (vh - size) / 2;
  return { cl, ct, cr: cl + size, cb: ct + size, vw, vh, size };
}

function currentOrient(): 'pt' | 'ls' {
  return window.innerWidth > window.innerHeight + 50 ? 'ls' : 'pt';
}

// ─── Sizing helpers ────────────────────────────────────────────────────────────

function vmin(): number { return Math.min(window.innerWidth, window.innerHeight) / 100; }
function dpSize():  number { return Math.max(92,  Math.min(116, Math.round(24 * vmin()))); }
// All action buttons (ATK / DEF / JMP / DGE) are the same large size
function aSize():   number { return Math.max(60,  Math.min(76,  Math.round(16 * vmin()))); }
function selH():    number { return Math.max(26,  Math.min(32,  Math.round(7  * vmin()))); }
function selW():    number { return Math.max(52,  Math.min(64,  Math.round(13 * vmin()))); }
function shH():     number { return Math.max(36,  Math.min(48,  Math.round(10 * vmin()))); }

// ─── Theme ────────────────────────────────────────────────────────────────────

const GBC_BODY     = '#1a1560';  // GBC deep indigo body
const GBA_BODY     = '#4a3d8f';  // GBA purple body
const GBC_SHOULDER = '#0f0e3a';  // GBC shoulder tab (darker)
const GBA_SHOULDER = '#3a2f7a';  // GBA shoulder tab (darker)
const BEZEL        = '#07070e';  // screen bezel ring
const BEZEL_LIP    = '#2a2760';  // outer "display lip" ring (blends into body)
const BEZEL_W      = 12;         // inner bezel thickness px
const BEZEL_LIP_W  = 14;         // outer ring thickness px

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
  const arrowSz = Math.max(9, Math.round(size * 0.11));

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
      <div className={`${arm(dirs.up)} rounded-t-lg`}>
        <span style={{ fontSize: arrowSz, color: dirs.up ? '#fff' : 'rgba(255,255,255,0.5)' }}>▲</span>
      </div>
      <div />
      <div className={`${arm(dirs.left)} rounded-l-lg`}>
        <span style={{ fontSize: arrowSz, color: dirs.left ? '#fff' : 'rgba(255,255,255,0.5)' }}>◀</span>
      </div>
      {/* Centre circle */}
      <div className="bg-[#2a2760] border border-white/10 rounded-full" />
      <div className={`${arm(dirs.right)} rounded-r-lg`}>
        <span style={{ fontSize: arrowSz, color: dirs.right ? '#fff' : 'rgba(255,255,255,0.5)' }}>▶</span>
      </div>
      <div />
      <div className={`${arm(dirs.down)} rounded-b-lg`}>
        <span style={{ fontSize: arrowSz, color: dirs.down ? '#fff' : 'rgba(255,255,255,0.5)' }}>▼</span>
      </div>
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
      <span style={{ fontSize: Math.max(10, Math.round(size * 0.22)), letterSpacing: '0.04em', fontWeight: 900 }}>{label}</span>
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
  side, label, hold, onTap, w, h, bg,
}: {
  side: 'l' | 'r'; label: string; hold?: boolean;
  onTap?: () => void; w: number; h: number; bg: string;
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
      style={{ width: w, height: h, borderRadius: side === 'l' ? '10px 10px 0 10px' : '10px 10px 10px 0', background: bg, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 2px 0 rgba(0,0,0,0.4)' }}
      className="flex items-center justify-center font-bold text-white/60 select-none touch-none cursor-pointer active:brightness-125 transition-all duration-75"
      onTouchStart={press} onTouchEnd={rel} onTouchCancel={rel} onMouseDown={mouseDown}
    >
      <span style={{ fontSize: Math.max(8, Math.round(h * 0.4)), letterSpacing: '0.1em' }}>{label}</span>
    </div>
  );
}

// ─── Speaker grill decoration ─────────────────────────────────────────────────

function SpeakerGrill({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, overflow: 'hidden', opacity: 0.55 }}>
      {[0,1,2,3,4].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0, top: i * (size / 5 + 1),
            width: size, height: 1,
            background: 'rgba(255,255,255,0.35)',
            transform: 'rotate(-35deg)',
            transformOrigin: 'left center',
          }}
        />
      ))}
    </div>
  );
}

// ─── GBC Portrait frame ───────────────────────────────────────────────────────
// Layout (thumb-reach focused, all action buttons same size):
//
//  ┌──────────────────────────────────┐ ← cb (canvas bottom)
//  │ [CHG──L shoulder──]  [──R──SPC] │ ← shoulder tabs, full width
//  │                                  │
//  │  (GBC body panel — indigo)       │
//  │                                  │
//  │  [D-pad]        [JMP]            │ ← lower strip, thumb reach
//  │                [DEF] [ATK]       │
//  │                 [DGE]            │
//  │                                  │
//  │     [EXIT]            [Hide][Keys│ ← very bottom
//  └──────────────────────────────────┘ ← vh

function GBCFrame({ canv, onHide, onKeys }: { canv: CanvInfo; onHide: () => void; onKeys: () => void }) {
  const { cl, ct, vw, vh, size, cb } = canv;
  const dp  = dpSize();
  const btn = aSize();   // all four action buttons are the same size
  const shh = shH();
  const shw = Math.round(vw * 0.32);   // shoulder tab ≈ 32% of screen width each
  const nav = useNavigate();

  const stripH = vh - cb;

  // ── D-pad: lower-left, positioned 58% down the control strip ──────────────
  const dpLeft = Math.max(14, Math.round(vw * 0.04));
  const dpTop  = cb + Math.round(stripH * 0.38);

  // ── Action diamond: lower-right, center aligned with D-pad center ─────────
  // Diamond center X: right-side, inset from screen edge
  const diamCx = vw - Math.max(Math.round(btn * 1.6), 100);
  // Diamond center Y: same as D-pad vertical center
  const diamCy = dpTop + Math.round(dp / 2);
  // Diamond radius: spacing between center and each button center
  const diamR  = Math.round(btn * 0.92);

  // Individual button positions (top-left corner of each button)
  const jmpL = diamCx - Math.round(btn / 2);
  const jmpT = diamCy - diamR - Math.round(btn / 2);
  const atkL = diamCx + diamR - Math.round(btn / 2);
  const atkT = diamCy - Math.round(btn / 2);
  const defL = diamCx - diamR - Math.round(btn / 2);
  const defT = diamCy - Math.round(btn / 2);
  const dgeL = diamCx - Math.round(btn / 2);
  const dgeT = diamCy + diamR - Math.round(btn / 2);

  return (
    <>
      {/* SCREEN BEZEL — dual ring */}
      <div style={{ position:'fixed', left:cl, top:ct, width:size, height:size,
        boxShadow:`0 0 0 ${BEZEL_W}px ${BEZEL}, 0 0 0 ${BEZEL_LIP_W}px ${BEZEL_LIP}`,
        borderRadius:6, zIndex:51, pointerEvents:'none' }} />

      {/* BOTTOM BODY */}
      <div style={{ position:'fixed', left:0, top:cb, right:0, bottom:0,
        background:GBC_BODY, borderRadius:'0 0 36px 36px', zIndex:52, pointerEvents:'none' }} />

      {/* BRANDING */}
      <div style={{ position:'fixed', left:0, right:0, top:cb+2, zIndex:53, pointerEvents:'none', display:'flex', justifyContent:'center' }}>
        <span style={{ fontSize:8, letterSpacing:'0.22em', color:'rgba(255,255,255,0.18)', fontWeight:700, textTransform:'uppercase', userSelect:'none' }}>BEYBLADE X</span>
      </div>

      {/* L SHOULDER — CHG (hold) */}
      <div style={{ position:'fixed', left:0, top:cb, zIndex:60, pointerEvents:'auto' }}>
        <ShoulderTab side="l" label="CHG" hold w={shw} h={shh} bg={GBC_SHOULDER} />
      </div>

      {/* R SHOULDER — SPC (tap) */}
      <div style={{ position:'fixed', right:0, top:cb, zIndex:60, pointerEvents:'auto' }}>
        <ShoulderTab side="r" label="SPC"
          onTap={() => { touchInputState.specialTap = true; requestAnimationFrame(() => { touchInputState.specialTap = false; }); }}
          w={shw} h={shh} bg={GBC_SHOULDER} />
      </div>

      {/* D-PAD — lower left */}
      <div style={{ position:'fixed', left:dpLeft, top:dpTop, zIndex:60, pointerEvents:'auto' }}>
        <CrossDpad size={dp} />
      </div>

      {/* Action diamond — all four buttons same size */}
      {/* JMP — top */}
      <div style={{ position:'fixed', left:jmpL, top:jmpT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="jump" label="JMP" size={btn} bg="#3b1a6e" border="#7744bb" />
      </div>
      {/* DEF — left */}
      <div style={{ position:'fixed', left:defL, top:defT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="defense" label="DEF" size={btn} bg="#0d3380" border="#2255bb" />
      </div>
      {/* ATK — right */}
      <div style={{ position:'fixed', left:atkL, top:atkT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="attack" label="ATK" size={btn} bg="#9b1926" border="#cc2233" />
      </div>
      {/* DGE — bottom */}
      <div style={{ position:'fixed', left:dgeL, top:dgeT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="dodge" label="DGE" size={btn} bg="#0d4a24" border="#1a8a3e" />
      </div>

      {/* EXIT — bottom left */}
      <div style={{ position:'fixed', bottom:'max(10px,env(safe-area-inset-bottom,0px))', left:14, zIndex:60, pointerEvents:'auto' }}>
        <PillBtn label="EXIT" onTap={() => nav('/game')} w={Math.round(btn * 1.1)} h={Math.round(btn * 0.46)} accent />
      </div>

      {/* Hide / Keys — bottom right (below action buttons) */}
      <div style={{ position:'fixed', bottom:'max(10px,env(safe-area-inset-bottom,0px))', right:10, zIndex:70, display:'flex', gap:5 }}>
        <button onClick={onHide} className="h-7 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Hide</button>
        <button onClick={onKeys} className="h-7 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Keys</button>
      </div>

      {/* Speaker grill */}
      <div style={{ position:'fixed', right:16, top:cb + Math.round(shh * 1.4), zIndex:53, pointerEvents:'none' }}>
        <SpeakerGrill size={34} />
      </div>

      {/* Power LED */}
      <div style={{ position:'fixed', left:cl+6, top:ct+6, width:7, height:7, borderRadius:'50%', background:'#ff3333', boxShadow:'0 0 6px #ff3333', zIndex:60, pointerEvents:'none' }} />
    </>
  );
}

// ─── GBA Landscape frame ──────────────────────────────────────────────────────
// Layout:
//  ┌─────────────┬──────────────────────┬─────────────┐
//  │ [CHG──L sh] │                      │  [R sh──SPC]│
//  │             │   GAME CANVAS        │             │
//  │  [D-pad]    │   [390×390]          │  [JMP]      │
//  │             │                      │ [DEF] [ATK] │
//  │             │                      │  [DGE]      │
//  │ [Hide][Keys]│                      │  [EXIT]     │
//  └─────────────┴──────────────────────┴─────────────┘

function GBAFrame({ canv, onHide, onKeys }: { canv: CanvInfo; onHide: () => void; onKeys: () => void }) {
  const { cl, ct, cr, cb, vw, vh, size } = canv;
  const dp  = dpSize();
  const btn = aSize();   // all four action buttons same size
  const shh = shH();
  const nav = useNavigate();

  const leftGutterW  = cl;
  const rightGutterW = vw - cr;

  // Shoulder tabs: full gutter width
  const lShW = leftGutterW;
  const rShW = rightGutterW;

  // D-pad: centred horizontally in left gutter, vertically centred in screen
  const dpLeft = Math.max(2, Math.round((leftGutterW - dp) / 2));
  const dpTop  = Math.round((vh - dp) / 2);

  // Action diamond: centred in right gutter, vertically centred
  const diamCx = cr + Math.round(rightGutterW / 2);
  const diamCy = Math.round(vh / 2);
  const diamR  = Math.round(btn * 0.92);

  const jmpL = diamCx - Math.round(btn / 2);
  const jmpT = diamCy - diamR - Math.round(btn / 2);
  const atkL = diamCx + diamR - Math.round(btn / 2);
  const atkT = diamCy - Math.round(btn / 2);
  const defL = diamCx - diamR - Math.round(btn / 2);
  const defT = diamCy - Math.round(btn / 2);
  const dgeL = diamCx - Math.round(btn / 2);
  const dgeT = diamCy + diamR - Math.round(btn / 2);

  return (
    <>
      {/* LEFT BODY */}
      <div style={{ position:'fixed', left:0, top:0, width:leftGutterW, bottom:0, background:GBA_BODY, zIndex:52, pointerEvents:'none' }} />
      {/* RIGHT BODY */}
      <div style={{ position:'fixed', top:0, right:0, width:rightGutterW, bottom:0, background:GBA_BODY, zIndex:52, pointerEvents:'none' }} />
      {ct > 0 && <div style={{ position:'fixed', left:0, top:0, right:0, height:ct, background:GBA_BODY, zIndex:52, pointerEvents:'none' }} />}
      {cb < vh && <div style={{ position:'fixed', left:0, top:cb, right:0, bottom:0, background:GBA_BODY, zIndex:52, pointerEvents:'none' }} />}

      {/* SCREEN BEZEL */}
      <div style={{ position:'fixed', left:cl, top:ct, width:size, height:size,
        boxShadow:`0 0 0 ${BEZEL_W}px ${BEZEL}, 0 0 0 ${BEZEL_LIP_W}px ${BEZEL_LIP}`,
        borderRadius:6, zIndex:51, pointerEvents:'none' }} />

      {/* L SHOULDER — CHG */}
      <div style={{ position:'fixed', left:0, top:0, zIndex:60, pointerEvents:'auto' }}>
        <ShoulderTab side="l" label="CHG" hold w={lShW} h={shh} bg={GBA_SHOULDER} />
      </div>
      {/* R SHOULDER — SPC */}
      <div style={{ position:'fixed', right:0, top:0, zIndex:60, pointerEvents:'auto' }}>
        <ShoulderTab side="r" label="SPC"
          onTap={() => { touchInputState.specialTap = true; requestAnimationFrame(() => { touchInputState.specialTap = false; }); }}
          w={rShW} h={shh} bg={GBA_SHOULDER} />
      </div>

      {/* D-PAD — left gutter, vertically centred */}
      <div style={{ position:'fixed', left:dpLeft, top:dpTop, zIndex:60, pointerEvents:'auto' }}>
        <CrossDpad size={dp} />
      </div>

      {/* Action diamond — right gutter, all buttons same size */}
      <div style={{ position:'fixed', left:jmpL, top:jmpT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="jump" label="JMP" size={btn} bg="#3b1a6e" border="#7744bb" />
      </div>
      <div style={{ position:'fixed', left:defL, top:defT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="defense" label="DEF" size={btn} bg="#0d3380" border="#2255bb" />
      </div>
      <div style={{ position:'fixed', left:atkL, top:atkT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="attack" label="ATK" size={btn} bg="#9b1926" border="#cc2233" />
      </div>
      <div style={{ position:'fixed', left:dgeL, top:dgeT, zIndex:60, pointerEvents:'auto' }}>
        <GBBtn field="dodge" label="DGE" size={btn} bg="#0d4a24" border="#1a8a3e" />
      </div>

      {/* EXIT — right gutter, below action diamond */}
      <div style={{ position:'fixed', left:cr + Math.round(rightGutterW / 2) - Math.round(btn * 0.55), bottom:'max(10px,env(safe-area-inset-bottom,0px))', zIndex:60, pointerEvents:'auto' }}>
        <PillBtn label="EXIT" onTap={() => nav('/game')} w={Math.round(btn * 1.1)} h={Math.round(btn * 0.46)} accent />
      </div>

      {/* Hide / Keys — left gutter bottom */}
      <div style={{ position:'fixed', bottom:'max(8px,env(safe-area-inset-bottom,0px))', left:4, zIndex:70, display:'flex', flexDirection:'column', gap:4 }}>
        <button onClick={onHide} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Hide</button>
        <button onClick={onKeys} className="h-6 px-2 rounded-full bg-black/40 border border-white/10 text-white/40 text-[9px] font-bold">Keys</button>
      </div>

      {/* Power LED */}
      <div style={{ position:'fixed', left:cl+8, top:ct+8, width:7, height:7, borderRadius:'50%', background:'#ff3333', boxShadow:'0 0 6px #ff3333', zIndex:60 }} />
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
