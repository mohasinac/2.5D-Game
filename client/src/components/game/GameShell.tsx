import React, { useRef } from 'react';
import { touchInputState } from '../../game/hooks/useGameInput';

// ─── Touch helpers ────────────────────────────────────────────────────────────
function applyAction(action: string, active: boolean) {
  if (action === 'chargeHeld') { touchInputState.chargeHeld = active; return; }
  if (action === 'specialTap') { if (active) touchInputState.specialTap = true; return; }
  (touchInputState as Record<string, boolean>)[action] = active;
}

function useTouchBtn(action: string) {
  return {
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); applyAction(action, true); },
    onPointerUp:   (e: React.PointerEvent) => { applyAction(action, false); },
    onPointerCancel: (e: React.PointerEvent) => { applyAction(action, false); },
  };
}

// ─── D-pad ────────────────────────────────────────────────────────────────────
function DPad() {
  const up    = useTouchBtn('moveUp');
  const down  = useTouchBtn('moveDown');
  const left  = useTouchBtn('moveLeft');
  const right = useTouchBtn('moveRight');

  const arm = (label: string, handlers: ReturnType<typeof useTouchBtn>, style: React.CSSProperties) => (
    <div
      {...handlers}
      style={{
        position: 'absolute',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 900,
        cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        ...style,
      }}
    >{label}</div>
  );

  return (
    <div style={{ position: 'relative', width: 108, height: 108, flexShrink: 0 }}>
      {/* Cross body */}
      <div style={{
        position: 'absolute', top: '33%', left: 0, width: '100%', height: '34%',
        background: 'linear-gradient(180deg, #2a2d3a 0%, #1e2130 100%)',
        borderRadius: 5,
        boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '33%', width: '34%', height: '100%',
        background: 'linear-gradient(90deg, #2a2d3a 0%, #1e2130 100%)',
        borderRadius: 5,
        boxShadow: '2px 0 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
      }} />
      {/* Center nub */}
      <div style={{
        position: 'absolute', top: '33%', left: '33%', width: '34%', height: '34%',
        background: '#252838',
        zIndex: 2,
      }} />
      {/* Arms */}
      {arm('▲', up,    { top: 2,   left: '33%', width: '34%', height: '31%', zIndex: 3 })}
      {arm('▼', down,  { bottom: 2, left: '33%', width: '34%', height: '31%', zIndex: 3 })}
      {arm('◀', left,  { left: 2,  top: '33%',  width: '31%', height: '34%', zIndex: 3 })}
      {arm('▶', right, { right: 2, top: '33%',  width: '31%', height: '34%', zIndex: 3 })}
    </div>
  );
}

// ─── Action cluster (A/B/X/Y diamond) ────────────────────────────────────────
interface ActionBtnProps {
  label: string;
  action: string;
  color: string;
  style: React.CSSProperties;
}

function ActionBtn({ label, action, color, style }: ActionBtnProps) {
  const h = useTouchBtn(action);
  return (
    <div
      {...h}
      style={{
        position: 'absolute',
        width: 44, height: 44, borderRadius: '50%',
        background: `radial-gradient(circle at 40% 35%, ${color}dd, ${color}99)`,
        border: `2px solid ${color}aa`,
        boxShadow: `0 3px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.15) inset, 0 -2px 0 rgba(0,0,0,0.3) inset`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 15, fontWeight: 900,
        cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        transform: 'translate(-50%, -50%)',
        ...style,
      }}
    >{label}</div>
  );
}

function ActionCluster() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <ActionBtn label="X" action="dodge"      color="#b45309" style={{ left: '50%', top: '12%' }} />
      <ActionBtn label="A" action="attack"     color="#c0392b" style={{ left: '85%', top: '50%' }} />
      <ActionBtn label="B" action="defense"    color="#2563eb" style={{ left: '50%', top: '88%' }} />
      <ActionBtn label="Y" action="jump"       color="#16a34a" style={{ left: '15%', top: '50%' }} />
    </div>
  );
}

// ─── Shoulder button ──────────────────────────────────────────────────────────
function ShoulderBtn({ label, action, side }: { label: string; action: string; side: 'left' | 'right' }) {
  const h = useTouchBtn(action);
  return (
    <div
      {...h}
      style={{
        width: 52, height: 22,
        borderRadius: side === 'left' ? '4px 4px 0 8px' : '4px 4px 8px 0',
        background: 'linear-gradient(180deg, #3a3d50 0%, #252838 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 800,
        cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        letterSpacing: '0.05em',
      }}
    >{label}</div>
  );
}

// ─── Small center button (SELECT / START) ────────────────────────────────────
function CenterBtn({ label, action }: { label: string; action: string }) {
  const h = useTouchBtn(action);
  return (
    <div
      {...h}
      style={{
        width: 44, height: 16, borderRadius: 8,
        background: 'linear-gradient(180deg, #3a3d50 0%, #252838 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: 700,
        cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}
    >{label}</div>
  );
}

// ─── GameShell ────────────────────────────────────────────────────────────────
interface GameShellProps {
  children: React.ReactNode;
  show25DRotate?: boolean;
}

export function GameShell({ children, show25DRotate: _show25DRotate = false }: GameShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={shellRef}
      className="game-shell"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {/* ── GBA Console Body ────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        maxWidth: 900,
        margin: '0 auto',
      }}>

        {/* ── Shoulder row ──────────────────────────────── */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 8px',
        }}>
          <ShoulderBtn label="L" action="chargeHeld" side="left" />
          <ShoulderBtn label="R" action="specialTap" side="right" />
        </div>

        {/* ── Main body ─────────────────────────────────── */}
        <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          background: 'linear-gradient(180deg, #1e2130 0%, #161826 60%, #12141f 100%)',
          borderRadius: '0 0 28px 28px',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          {/* Left side — D-pad */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '12px 16px',
            flex: '0 0 auto',
            minWidth: 120,
          }}>
            <DPad />
            <CenterBtn label="SELECT" action="jump" />
          </div>

          {/* Center — Screen + bezel */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 0',
            minWidth: 0,
            minHeight: 0,
          }}>
            {/* Screen outer bezel */}
            <div style={{
              background: '#0a0b14',
              borderRadius: 10,
              padding: 8,
              boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.8), inset 0 0 12px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: '80vmin',
              maxHeight: '80vmin',
            }}>
              {/* Screen inner frame */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.25)',
              }}>
                <div className="game-viewport-slot" style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  maxWidth: '100%', maxHeight: '100%',
                  borderRadius: 6,
                }}>
                  {children}
                </div>
              </div>
            </div>
          </div>

          {/* Right side — Action cluster */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '12px 16px',
            flex: '0 0 auto',
            minWidth: 120,
          }}>
            <ActionCluster />
            <CenterBtn label="START" action="attack" />
          </div>
        </div>

        {/* ── Logo strip ────────────────────────────────── */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '4px 0 6px',
          gap: 8,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: '0.25em',
            color: 'rgba(99,102,241,0.4)', textTransform: 'uppercase',
          }}>BEYBLADE GAME</span>
        </div>
      </div>
    </div>
  );
}
