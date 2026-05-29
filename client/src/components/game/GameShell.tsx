import React, { useEffect, useRef, useState } from 'react';
import { touchInputState } from '../../game/hooks/useGameInput';

// ─── Orientation hook ─────────────────────────────────────────────────────────
function useIsPortrait() {
  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const handler = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return portrait;
}

// ─── Touch helpers ─────────────────────────────────────────────────────────────
function vibrate(ms: number) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
}

function applyAction(action: string, active: boolean) {
  if (action === 'chargeHeld') { touchInputState.chargeHeld = active; return; }
  if (action === 'specialTap') { if (active) touchInputState.specialTap = true; return; }
  (touchInputState as Record<string, boolean>)[action] = active;
}
function useTouchBtn(action: string) {
  return {
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); applyAction(action, true); vibrate(18); },
    onPointerUp:   (_e: React.PointerEvent) => { applyAction(action, false); },
    onPointerCancel: (_e: React.PointerEvent) => { applyAction(action, false); },
  };
}

// ─── Virtual joystick ─────────────────────────────────────────────────────────
function VirtualJoystick({ size = 96 }: { size?: number }) {
  const [thumbOffset, setThumbOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const baseRef   = useRef<HTMLDivElement>(null);
  const ptrRef    = useRef<number | null>(null);

  const maxTravel = size * 0.33;
  const deadZone  = 0.22;
  const thumbSz   = Math.round(size * 0.38);

  function applyAxis(clientX: number, clientY: number) {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + size / 2;
    const cy = rect.top  + size / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxTravel) {
      const scale = maxTravel / dist;
      dx *= scale; dy *= scale;
    }

    setThumbOffset({ x: dx, y: dy });

    const nx = dx / maxTravel;
    const ny = dy / maxTravel;
    touchInputState.moveLeft  = nx < -deadZone;
    touchInputState.moveRight = nx > deadZone;
    touchInputState.moveUp    = ny < -deadZone;
    touchInputState.moveDown  = ny > deadZone;
  }

  function resetAxis() {
    setThumbOffset({ x: 0, y: 0 });
    touchInputState.moveLeft = touchInputState.moveRight = touchInputState.moveUp = touchInputState.moveDown = false;
  }

  const nx = thumbOffset.x / maxTravel;
  const ny = thumbOffset.y / maxTravel;
  const arrowColor = (on: boolean) => on ? 'rgba(139,92,246,0.85)' : 'rgba(255,255,255,0.12)';
  const arrowEdge  = Math.round(size * 0.08);

  return (
    <div
      ref={baseRef}
      data-testid="virtual-joystick"
      style={{
        position: 'relative', width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #2a2a2a 0%, #111 100%)',
        border: '2px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 5px rgba(0,0,0,0.5)',
        touchAction: 'none', userSelect: 'none', cursor: 'pointer', flexShrink: 0,
      }}
      onPointerDown={(e) => {
        if (ptrRef.current !== null) return;
        ptrRef.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        setActive(true); vibrate(15);
        applyAxis(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.pointerId !== ptrRef.current) return;
        applyAxis(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.pointerId !== ptrRef.current) return;
        ptrRef.current = null; setActive(false); resetAxis();
      }}
      onPointerCancel={(e) => {
        if (e.pointerId !== ptrRef.current) return;
        ptrRef.current = null; setActive(false); resetAxis();
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '12%', right: '12%', height: 1, background: 'rgba(255,255,255,0.06)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: '50%', top: '12%', bottom: '12%', width: 1, background: 'rgba(255,255,255,0.06)', transform: 'translateX(-50%)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: size * 0.52, height: size * 0.52, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>

      <div style={{ position: 'absolute', top: arrowEdge, left: '50%', transform: 'translateX(-50%)',
        color: arrowColor(ny < -deadZone), fontSize: size * 0.13, lineHeight: 1, pointerEvents: 'none' }}>▲</div>
      <div style={{ position: 'absolute', bottom: arrowEdge, left: '50%', transform: 'translateX(-50%)',
        color: arrowColor(ny > deadZone), fontSize: size * 0.13, lineHeight: 1, pointerEvents: 'none' }}>▼</div>
      <div style={{ position: 'absolute', left: arrowEdge, top: '50%', transform: 'translateY(-50%)',
        color: arrowColor(nx < -deadZone), fontSize: size * 0.13, lineHeight: 1, pointerEvents: 'none' }}>◀</div>
      <div style={{ position: 'absolute', right: arrowEdge, top: '50%', transform: 'translateY(-50%)',
        color: arrowColor(nx > deadZone), fontSize: size * 0.13, lineHeight: 1, pointerEvents: 'none' }}>▶</div>

      <div style={{
        position: 'absolute',
        width: thumbSz, height: thumbSz, borderRadius: '50%',
        background: active
          ? 'radial-gradient(circle at 38% 35%, #7c3aed 0%, #4c1d95 100%)'
          : 'radial-gradient(circle at 38% 35%, #52525b 0%, #27272a 100%)',
        border: `2px solid ${active ? 'rgba(139,92,246,0.85)' : 'rgba(113,113,122,0.5)'}`,
        boxShadow: active
          ? '0 2px 10px rgba(0,0,0,0.7), 0 0 14px rgba(109,40,217,0.55)'
          : '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)',
        left: '50%', top: '50%',
        transform: `translate(calc(-50% + ${thumbOffset.x}px), calc(-50% + ${thumbOffset.y}px))`,
        transition: active ? 'none' : 'transform 0.13s ease-out, background 0.1s, border-color 0.1s, box-shadow 0.1s',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Two-line button label (action name + key shortcut) ───────────────────────
function BtnLabel({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, lineHeight: 1.15, textAlign: 'center' }}>
      <span>{top}</span>
      <span style={{ fontSize: '0.6em', opacity: 0.72, letterSpacing: '0.04em' }}>{bottom}</span>
    </div>
  );
}

// ─── Action buttons (diamond) ─────────────────────────────────────────────────
function ABtn({ label, action, color, style }: {
  label: React.ReactNode; action: string; color: string; style: React.CSSProperties
}) {
  const h = useTouchBtn(action);
  return (
    <div {...h} style={{
      position: 'absolute',
      borderRadius: '50%',
      background: `radial-gradient(circle at 38% 35%, ${color}ee, ${color}99)`,
      border: `2px solid ${color}cc`,
      boxShadow: `0 4px 10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.25)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 900,
      cursor: 'pointer', touchAction: 'none', userSelect: 'none',
      transform: 'translate(-50%, -50%)',
      ...style,
    }}>{label}</div>
  );
}

function ActionCluster({ btnSize = 40, containerSize = 110 }: { btnSize?: number; containerSize?: number }) {
  const fs = Math.round(btnSize * 0.22);
  return (
    <div style={{ position: 'relative', width: containerSize, height: containerSize, flexShrink: 0 }}>
      <ABtn label={<BtnLabel top="DODGE"   bottom="A · J" />} action="dodge"   color="#b45309" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '50%', top: '12%' }} />
      <ABtn label={<BtnLabel top="ATTACK"  bottom="D · L" />} action="attack"  color="#dc2626" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '85%', top: '50%' }} />
      <ABtn label={<BtnLabel top="DEFENSE" bottom="S · K" />} action="defense" color="#2563eb" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '50%', top: '88%' }} />
      <ABtn label={<BtnLabel top="JUMP"    bottom="W · I" />} action="jump"    color="#16a34a" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '15%', top: '50%' }} />
    </div>
  );
}

// ─── Small oval button ─────────────────────────────────────────────────────────
function OvalBtn({
  label, subLabel, action = '_noop', onPress, wide = false,
}: {
  label: string;
  subLabel?: string;
  action?: string;
  onPress?: () => void;
  wide?: boolean;
}) {
  const h = useTouchBtn(action);
  const handlers = onPress
    ? {
        onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); vibrate(18); onPress(); },
        onPointerUp:   (_e: React.PointerEvent) => {},
        onPointerCancel: (_e: React.PointerEvent) => {},
      }
    : h;
  return (
    <div {...handlers} style={{
      width: wide ? 52 : 44, height: 20, borderRadius: 10,
      background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
      border: '1px solid rgba(0,0,0,0.45)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.45)', fontSize: 7, fontWeight: 800,
      letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2,
      cursor: 'pointer', touchAction: 'none', userSelect: 'none',
    }}>
      <span>{label}</span>
      {subLabel && <span style={{ fontSize: 6, opacity: 0.65 }}>{subLabel}</span>}
    </div>
  );
}

// ─── Shoulder tab (L / R) ─────────────────────────────────────────────────────
// Placed just above D-pad (L) or action cluster (R), not at the top of the shell.
function ShoulderBtn({ label, subLabel, action, side, hidden = false }: {
  label: string; subLabel?: string; action: string; side: 'L' | 'R'; hidden?: boolean;
}) {
  const h = useTouchBtn(action);
  if (hidden) return null;
  return (
    <div {...h} style={{
      minWidth: 72, height: 30,
      background: 'linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)',
      borderRadius: side === 'L' ? '8px 8px 0 12px' : '8px 8px 12px 0',
      boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
      border: '1px solid rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
      lineHeight: 1.2, cursor: 'pointer', touchAction: 'none', userSelect: 'none',
    }}>
      <span>{label}</span>
      {subLabel && <span style={{ fontSize: 7, opacity: 0.7 }}>{subLabel}</span>}
    </div>
  );
}

// ─── Small shoulder tab (portrait) ───────────────────────────────────────────
function SmallShoulderBtn({ label, subLabel, action, side, hidden = false }: {
  label: string; subLabel?: string; action: string; side: 'L' | 'R'; hidden?: boolean;
}) {
  const h = useTouchBtn(action);
  if (hidden) return null;
  return (
    <div {...h} style={{
      minWidth: 58, height: 26,
      background: 'linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)',
      borderRadius: side === 'L' ? '6px 6px 0 10px' : '6px 6px 10px 0',
      boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
      border: '1px solid rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
      lineHeight: 1.2, cursor: 'pointer', touchAction: 'none', userSelect: 'none',
    }}>
      <span>{label}</span>
      {subLabel && <span style={{ fontSize: 6.5, opacity: 0.7 }}>{subLabel}</span>}
    </div>
  );
}

// ─── Zoom button strip ────────────────────────────────────────────────────────
function ZoomStrip({
  onZoomIn, onZoomOut, onZoomReset,
}: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}) {
  const btnStyle: React.CSSProperties = {
    width: 22, height: 22, borderRadius: 4,
    background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 900,
    cursor: 'pointer', touchAction: 'none', userSelect: 'none',
  };
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      <div style={btnStyle} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); vibrate(12); onZoomIn?.(); }}>+</div>
      <div style={btnStyle} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); vibrate(12); onZoomReset?.(); }}>0</div>
      <div style={btnStyle} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); vibrate(12); onZoomOut?.(); }}>−</div>
    </div>
  );
}

// ─── Speaker grille ──────────────────────────────────────────────────────────
function SpeakerDots({ cols = 5, rows = 4 }: { cols?: number; rows?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 6px)`, gap: 4 }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
      ))}
    </div>
  );
}

// ─── Screen bezel (shared) ────────────────────────────────────────────────────
function ScreenBezel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#0f1018',
      borderRadius: 12,
      padding: '6px 8px 8px',
      boxShadow: '0 0 0 2px rgba(0,0,0,0.6), inset 0 3px 12px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      <div style={{
        borderRadius: 7, overflow: 'hidden', background: '#000',
        boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9), inset 0 0 2px rgba(99,102,241,0.3)',
        position: 'relative', width: '100%', height: '100%',
      }}>
        <div className="game-viewport-slot" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 7 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── LANDSCAPE layout ─────────────────────────────────────────────────────────
interface ShellProps {
  children: React.ReactNode;
  onExit?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  controlsHidden: boolean;
  onToggleControls: () => void;
  show25D: boolean;
}

// ─── Overlay theme ─────────────────────────────────────────────────────────────
const SHELL_THEMES: Record<string, string> = {
  dark:         'linear-gradient(155deg,#1f1f2e 0%,#111 100%)',
  ocean:        'linear-gradient(155deg,#0d2d5e 0%,#071a38 100%)',
  fire:         'linear-gradient(155deg,#5e1a0d 0%,#380707 100%)',
  forest:       'linear-gradient(155deg,#0d3a1a 0%,#071c0d 100%)',
  gold:         'linear-gradient(155deg,#5e4a0d 0%,#38280a 100%)',
  midnight:     'linear-gradient(155deg,#0a0a0f 0%,#000 100%)',
  neon:         'linear-gradient(155deg,#5e0d3a 0%,#38071e 100%)',
  space:        'linear-gradient(155deg,#1a1a2e 0%,#0a0a14 100%)',
  purple:       'linear-gradient(155deg, #8b5cf6 0%, #7c3aed 35%, #6d28d9 65%, #5b21b6 100%)',
};

function useShellBackground(): string {
  const [bg, setBg] = useState(() => {
    try {
      const theme = localStorage.getItem('bey.overlayTheme') ?? 'purple';
      if (theme === 'custom') {
        const color = localStorage.getItem('bey.overlayTheme.customColor') ?? '#1a1a2e';
        return `linear-gradient(155deg,${color} 0%,${color}cc 100%)`;
      }
      if (theme === 'custom-image') {
        const img = localStorage.getItem('bey.overlayTheme.customBg');
        if (img) return img; // will be used as backgroundImage
      }
      return SHELL_THEMES[theme] ?? SHELL_THEMES.purple;
    } catch { return SHELL_THEMES.purple; }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const theme = localStorage.getItem('bey.overlayTheme') ?? 'purple';
        if (theme === 'custom') {
          const color = localStorage.getItem('bey.overlayTheme.customColor') ?? '#1a1a2e';
          setBg(`linear-gradient(155deg,${color} 0%,${color}cc 100%)`);
        } else if (theme === 'custom-image') {
          const img = localStorage.getItem('bey.overlayTheme.customBg');
          if (img) setBg(img); else setBg(SHELL_THEMES.purple);
        } else {
          setBg(SHELL_THEMES[theme] ?? SHELL_THEMES.purple);
        }
      } catch { setBg(SHELL_THEMES.purple); }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return bg;
}

function LandscapeShell({ children, onExit, onZoomIn, onZoomOut, onZoomReset, controlsHidden, onToggleControls, show25D }: ShellProps) {
  const T = '0.28s ease';
  const shellBg = useShellBackground();
  const isImageBg = shellBg.startsWith('data:');
  return (
    <div style={{
      position: 'relative',
      width:  'min(96vw, calc(96vh * 1.72))',
      height: 'min(96vh, calc(96vw / 1.72))',
      background: isImageBg ? undefined : shellBg,
      backgroundImage: isImageBg ? `url(${shellBg})` : undefined,
      backgroundSize: 'cover', backgroundPosition: 'center',
      borderRadius: '12px 12px 30px 30px',
      boxShadow: '0 0 0 1.5px rgba(255,255,255,0.18), 0 24px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.22)',
      display: 'flex', flexDirection: 'column', overflow: 'visible',
    }}>
      {/* Main row — no shoulder row at top; L/R are inline with their controls */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', padding: '4px 14px 10px', gap: 10, minHeight: 0, height: 0 }}>

        {/* Left gutter — L shoulder above joystick, then center buttons below */}
        <div style={{
          width: controlsHidden ? 0 : '20%', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, flexShrink: 0, minHeight: 0,
          transition: `width ${T}`,
        }}>
          {/* L shoulder button — just above the joystick */}
          <ShoulderBtn label="L" subLabel="CHARGE" action="chargeHeld" side="L" />
          <VirtualJoystick size={90} />
          {/* Center action buttons: CHARGE | SPECIAL | PAUSE */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <OvalBtn label="CHARGE" subLabel="hold ⎵" action="chargeHeld" wide />
            <OvalBtn label="SPECIAL" subLabel="tap ⎵" action="specialTap" wide />
            <OvalBtn label="PAUSE"  onPress={onExit} wide />
          </div>
        </div>

        {/* Center — screen (always visible, expands when controls hidden) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0, minHeight: 0, height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 2 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>BEYBLADE GAME</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ZoomStrip onZoomIn={onZoomIn} onZoomOut={onZoomOut} onZoomReset={onZoomReset} />
              <ToggleBtn hidden={controlsHidden} onToggle={onToggleControls} />
            </div>
          </div>
          <ScreenBezel style={{ flex: 1, width: '100%', minHeight: 0 }}>
            {children}
          </ScreenBezel>
          <div style={{ fontSize: 10, fontWeight: 900, background: 'linear-gradient(90deg,#fff,#c4b5fd,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.06em' }}>
            <span style={{ fontStyle: 'italic' }}>GAME BOY</span> <span style={{ fontSize: 12 }}>ADVANCE</span>
          </div>
        </div>

        {/* Right gutter — R shoulder above action cluster (R hidden in 2D mode) */}
        <div style={{
          width: controlsHidden ? 0 : '26%', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 0,
          paddingTop: 4, paddingBottom: 8, gap: 8, flexShrink: 0,
          transition: `width ${T}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'flex-end', paddingRight: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.5)' }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>POWER</span>
          </div>
          {/* R shoulder button — just above action cluster; hidden in 2D mode */}
          <ShoulderBtn label="R" subLabel="SPECIAL" action="specialTap" side="R" hidden={!show25D} />
          <ActionCluster btnSize={42} containerSize={114} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, transform: 'rotate(-10deg)' }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ width: 36, height: 3, borderRadius: 2, background: 'rgba(0,0,0,0.28)' }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PORTRAIT layout ──────────────────────────────────────────────────────────
function PortraitShell({ children, onExit, onZoomIn, onZoomOut, onZoomReset, controlsHidden, onToggleControls, show25D }: ShellProps) {
  const T = '0.28s ease';
  const shellBg = useShellBackground();
  const isImageBg = shellBg.startsWith('data:');
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: isImageBg ? undefined : shellBg,
      backgroundImage: isImageBg ? `url(${shellBg})` : undefined,
      backgroundSize: isImageBg ? 'cover' : undefined,
      backgroundPosition: isImageBg ? 'center' : undefined,
      overflow: 'hidden',
    }}>

      {/* ── Screen section ─── */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxHeight: controlsHidden ? '96vh' : '54vh',
        flexShrink: 0,
        background: '#0a0b14',
        position: 'relative',
        boxShadow: 'inset 0 -4px 16px rgba(0,0,0,0.7)',
        transition: 'max-height 0.28s ease',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,0.04)' }} />
        <div style={{
          position: 'absolute',
          inset: '10px 14px 10px',
          borderRadius: 8, overflow: 'hidden', background: '#000',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), 0 0 0 1px rgba(99,102,241,0.2)',
        }}>
          <div className="game-viewport-slot" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}>
            {children}
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 28, background: '#0a0b14',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 10, paddingRight: 10, gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 900, fontStyle: 'italic', color: '#e5e7eb', letterSpacing: '0.05em' }}>GAME BOY</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', letterSpacing: '0.1em' }}>COLOR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ZoomStrip onZoomIn={onZoomIn} onZoomOut={onZoomOut} onZoomReset={onZoomReset} />
            <ToggleBtn hidden={controlsHidden} onToggle={onToggleControls} />
          </div>
        </div>
      </div>

      {/* ── Controller body — collapses when controls hidden ── */}
      <div style={{
        maxHeight: controlsHidden ? 0 : '47vh',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: controlsHidden ? 0 : '4px 12px 8px',
        gap: 0,
        minHeight: 0,
        position: 'relative',
        transition: 'max-height 0.28s ease, padding 0.28s ease',
      }}>
        {/* Nintendo emboss */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 3, flexShrink: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase',
            textShadow: '0 1px 0 rgba(255,255,255,0.08)',
          }}>Nintendo</div>
        </div>

        {/* Main controls row — L above joystick, R above action cluster */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 0 }}>
          {/* Left: L shoulder button above joystick */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '45%', gap: 4 }}>
            <SmallShoulderBtn label="L" subLabel="CHARGE" action="chargeHeld" side="L" />
            <VirtualJoystick size={110} />
          </div>

          {/* Right: R shoulder button (hidden in 2D) above action cluster */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '45%', gap: 4 }}>
            <SmallShoulderBtn label="R" subLabel="SPECIAL" action="specialTap" side="R" hidden={!show25D} />
            <ActionCluster btnSize={48} containerSize={126} />
          </div>
        </div>

        {/* Bottom row: CHARGE | SPECIAL | PAUSE + Speaker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <OvalBtn label="CHARGE"  subLabel="hold ⎵" action="chargeHeld" wide />
              <OvalBtn label="SPECIAL" subLabel="tap ⎵"  action="specialTap" wide />
              <OvalBtn label="PAUSE"   onPress={onExit}  wide />
            </div>
            <div style={{ display: 'flex', gap: 6, paddingLeft: 2 }}>
              <span style={{ fontSize: 7, color: 'rgba(0,0,0,0.28)', fontWeight: 700, letterSpacing: '0.08em', width: 52, textAlign: 'center' }}>CHARGE</span>
              <span style={{ fontSize: 7, color: 'rgba(0,0,0,0.28)', fontWeight: 700, letterSpacing: '0.08em', width: 52, textAlign: 'center' }}>SPECIAL</span>
              <span style={{ fontSize: 7, color: 'rgba(0,0,0,0.28)', fontWeight: 700, letterSpacing: '0.08em', width: 52, textAlign: 'center' }}>PAUSE</span>
            </div>
          </div>
          <SpeakerDots cols={6} rows={4} />
        </div>
      </div>
    </div>
  );
}

// ─── Controls visibility toggle button ───────────────────────────────────────
function ToggleBtn({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return (
    <div
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); vibrate(12); onToggle(); }}
      title={hidden ? 'Show controls' : 'Hide controls'}
      style={{
        width: 22, height: 22, borderRadius: 4,
        background: hidden
          ? 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)'
          : 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
        border: `1px solid ${hidden ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.12)'}`,
        boxShadow: hidden
          ? '0 0 8px rgba(109,40,217,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hidden ? '#e9d5ff' : 'rgba(255,255,255,0.55)',
        fontSize: 11, cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
        flexShrink: 0,
      }}
    >
      {hidden ? '⊕' : '⊖'}
    </div>
  );
}

// ─── GameShell (root) ─────────────────────────────────────────────────────────
export interface GameShellProps {
  children: React.ReactNode;
  show25DRotate?: boolean;
  onExit?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export function GameShell({
  children,
  show25DRotate = false,
  onExit,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: GameShellProps) {
  const portrait = useIsPortrait();
  const [controlsHidden, setControlsHidden] = useState<boolean>(() => {
    try { return localStorage.getItem('bey.hideControls') === '1'; } catch { return false; }
  });

  function toggleControls() {
    setControlsHidden(prev => {
      const next = !prev;
      try { localStorage.setItem('bey.hideControls', next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }

  const shellProps = { onExit, onZoomIn, onZoomOut, onZoomReset, controlsHidden, onToggleControls: toggleControls, show25D: show25DRotate };

  return (
    <div className="game-shell">
      {portrait
        ? <PortraitShell {...shellProps}>{children}</PortraitShell>
        : <LandscapeShell {...shellProps}>{children}</LandscapeShell>
      }
    </div>
  );
}
