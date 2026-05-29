import React, { useEffect, useState } from 'react';
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
function applyAction(action: string, active: boolean) {
  if (action === 'chargeHeld') { touchInputState.chargeHeld = active; return; }
  if (action === 'specialTap') { if (active) touchInputState.specialTap = true; return; }
  (touchInputState as Record<string, boolean>)[action] = active;
}
function useTouchBtn(action: string) {
  return {
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); applyAction(action, true); },
    onPointerUp:   (_e: React.PointerEvent) => { applyAction(action, false); },
    onPointerCancel: (_e: React.PointerEvent) => { applyAction(action, false); },
  };
}

// ─── D-pad ─────────────────────────────────────────────────────────────────────
function DPad({ size = 96 }: { size?: number }) {
  const up    = useTouchBtn('moveUp');
  const down  = useTouchBtn('moveDown');
  const left  = useTouchBtn('moveLeft');
  const right = useTouchBtn('moveRight');

  const armColor = 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)';
  const shadow   = '0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)';

  const arm = (label: string, h: ReturnType<typeof useTouchBtn>, extra: React.CSSProperties) => (
    <div {...h} style={{
      position: 'absolute',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: armColor, boxShadow: shadow,
      color: 'rgba(255,255,255,0.5)', fontSize: size * 0.13, fontWeight: 900,
      cursor: 'pointer', touchAction: 'none', userSelect: 'none',
      ...extra,
    }}>{label}</div>
  );

  const arm1 = Math.round(size * 0.333);
  const arm2 = size - arm1 * 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* horizontal bar */}
      <div style={{ position: 'absolute', top: arm1, left: 0, width: size, height: arm2, background: armColor, boxShadow: shadow, borderRadius: Math.round(size * 0.05) }} />
      {/* vertical bar */}
      <div style={{ position: 'absolute', top: 0, left: arm1, width: arm2, height: size, background: armColor, boxShadow: shadow, borderRadius: Math.round(size * 0.05) }} />
      {/* center nub */}
      <div style={{ position: 'absolute', top: arm1, left: arm1, width: arm2, height: arm2, background: '#111', zIndex: 2 }} />
      {/* arms */}
      {arm('▲', up,    { top: 2,      left: arm1, width: arm2, height: arm1 - 2, borderRadius: `${size*0.05}px ${size*0.05}px 0 0`, zIndex: 3 })}
      {arm('▼', down,  { bottom: 2,   left: arm1, width: arm2, height: arm1 - 2, borderRadius: `0 0 ${size*0.05}px ${size*0.05}px`, zIndex: 3 })}
      {arm('◀', left,  { left: 2,     top: arm1,  width: arm1 - 2, height: arm2, borderRadius: `${size*0.05}px 0 0 ${size*0.05}px`, zIndex: 3 })}
      {arm('▶', right, { right: 2,    top: arm1,  width: arm1 - 2, height: arm2, borderRadius: `0 ${size*0.05}px ${size*0.05}px 0`, zIndex: 3 })}
    </div>
  );
}

// ─── Action buttons (A/B/X/Y diamond) ─────────────────────────────────────────
function ABtn({ label, action, color, style }: { label: string; action: string; color: string; style: React.CSSProperties }) {
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
  const fs = Math.round(btnSize * 0.33);
  return (
    <div style={{ position: 'relative', width: containerSize, height: containerSize, flexShrink: 0 }}>
      <ABtn label="X" action="dodge"   color="#b45309" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '50%', top: '12%' }} />
      <ABtn label="A" action="attack"  color="#dc2626" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '85%', top: '50%' }} />
      <ABtn label="B" action="defense" color="#2563eb" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '50%', top: '88%' }} />
      <ABtn label="Y" action="jump"    color="#16a34a" style={{ width: btnSize, height: btnSize, fontSize: fs, left: '15%', top: '50%' }} />
    </div>
  );
}

// ─── Small oval button ─────────────────────────────────────────────────────────
function OvalBtn({ label, action, wide = false }: { label: string; action: string; wide?: boolean }) {
  const h = useTouchBtn(action);
  return (
    <div {...h} style={{
      width: wide ? 52 : 44, height: 14, borderRadius: 7,
      background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
      border: '1px solid rgba(0,0,0,0.45)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.38)', fontSize: 7, fontWeight: 800,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      cursor: 'pointer', touchAction: 'none', userSelect: 'none',
    }}>{label}</div>
  );
}

// ─── Shoulder tab ─────────────────────────────────────────────────────────────
function ShoulderBtn({ label, action, side }: { label: string; action: string; side: 'L' | 'R' }) {
  const h = useTouchBtn(action);
  return (
    <div {...h} style={{
      width: 80, height: 26,
      background: 'linear-gradient(180deg, #9ca3af 0%, #6b7280 60%, #4b5563 100%)',
      borderRadius: side === 'L' ? '6px 6px 0 10px' : '6px 6px 10px 0',
      boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
      border: '1px solid rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
      cursor: 'pointer', touchAction: 'none', userSelect: 'none',
    }}>{label}</div>
  );
}

// ─── Speaker grille (dot matrix, GBC style) ───────────────────────────────────
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

// ─── LANDSCAPE layout (GBA style) ─────────────────────────────────────────────
function LandscapeShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative',
      width:  'min(96vw, calc(96vh * 1.72))',
      height: 'min(96vh, calc(96vw / 1.72))',
      background: 'linear-gradient(155deg, #8b5cf6 0%, #7c3aed 35%, #6d28d9 65%, #5b21b6 100%)',
      borderRadius: '12px 12px 30px 30px',
      boxShadow: '0 0 0 1.5px rgba(255,255,255,0.18), 0 24px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.22)',
      display: 'flex', flexDirection: 'column', overflow: 'visible',
    }}>
      {/* Shoulder row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
        <ShoulderBtn label="L" action="chargeHeld" side="L" />
        <ShoulderBtn label="R" action="specialTap" side="R" />
      </div>

      {/* Main row */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4px 14px 10px', gap: 10, minHeight: 0 }}>

        {/* Left — D-pad + center */}
        <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, flexShrink: 0 }}>
          <DPad size={90} />
          <div style={{ display: 'flex', gap: 8 }}>
            <OvalBtn label="SELECT" action="jump" />
            <OvalBtn label="START"  action="attack" />
          </div>
        </div>

        {/* Center — screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0, minHeight: 0, height: '100%' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>BEYBLADE GAME</div>
          <ScreenBezel style={{ flex: 1, width: '100%', minHeight: 0 }}>
            {children}
          </ScreenBezel>
          <div style={{ fontSize: 10, fontWeight: 900, background: 'linear-gradient(90deg,#fff,#c4b5fd,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.06em' }}>
            <span style={{ fontStyle: 'italic' }}>GAME BOY</span> <span style={{ fontSize: 12 }}>ADVANCE</span>
          </div>
        </div>

        {/* Right — power + actions + speaker */}
        <div style={{ width: '26%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', paddingTop: 4, paddingBottom: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'flex-end', paddingRight: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.5)' }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>POWER</span>
          </div>
          <ActionCluster btnSize={42} containerSize={114} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, transform: 'rotate(-10deg)' }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ width: 36, height: 3, borderRadius: 2, background: 'rgba(0,0,0,0.28)' }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PORTRAIT layout (GBC style) ──────────────────────────────────────────────
function PortraitShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(175deg, #7c3aed 0%, #6d28d9 40%, #5b21b6 100%)',
      overflow: 'hidden',
    }}>

      {/* ── Screen section (top) ──────────────────────── */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxHeight: '58vh',
        flexShrink: 0,
        background: '#0a0b14',
        position: 'relative',
        boxShadow: 'inset 0 -4px 16px rgba(0,0,0,0.7)',
      }}>
        {/* Bezel top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,0.04)' }} />
        {/* Screen inner */}
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
        {/* GAME BOY COLOR label at bottom of bezel */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 28, background: '#0a0b14',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, fontStyle: 'italic', color: '#e5e7eb', letterSpacing: '0.05em' }}>GAME BOY</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', letterSpacing: '0.1em' }}>COLOR</span>
        </div>
      </div>

      {/* ── Controller body ───────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        padding: '8px 16px 12px',
        gap: 0,
        minHeight: 0,
        position: 'relative',
      }}>
        {/* Nintendo emboss */}
        <div style={{
          textAlign: 'center',
          fontSize: 13, fontWeight: 700, letterSpacing: '0.2em',
          color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase',
          paddingBottom: 6, flexShrink: 0,
          textShadow: '0 1px 0 rgba(255,255,255,0.08)',
        }}>Nintendo</div>

        {/* Main controls row */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 0 }}>

          {/* D-pad */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45%' }}>
            <DPad size={120} />
          </div>

          {/* Action cluster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45%' }}>
            <ActionCluster btnSize={48} containerSize={130} />
          </div>
        </div>

        {/* Bottom row: SELECT/START + Speaker */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 8, flexShrink: 0 }}>
          {/* SELECT + START */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <OvalBtn label="SELECT" action="jump" wide />
              <OvalBtn label="START"  action="attack" wide />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingLeft: 4 }}>
              <span style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, letterSpacing: '0.12em', width: 52, textAlign: 'center' }}>SELECT</span>
              <span style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, letterSpacing: '0.12em', width: 52, textAlign: 'center' }}>START</span>
            </div>
          </div>

          {/* Speaker dots */}
          <SpeakerDots cols={6} rows={5} />
        </div>
      </div>
    </div>
  );
}

// ─── GameShell (root) ─────────────────────────────────────────────────────────
interface GameShellProps {
  children: React.ReactNode;
  show25DRotate?: boolean;
}

export function GameShell({ children, show25DRotate: _show25DRotate = false }: GameShellProps) {
  const portrait = useIsPortrait();

  return (
    <div className="game-shell">
      {portrait
        ? <PortraitShell>{children}</PortraitShell>
        : <LandscapeShell>{children}</LandscapeShell>
      }
    </div>
  );
}
