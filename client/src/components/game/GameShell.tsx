import React, { useCallback, useRef, useState } from 'react';
import { touchInputState } from '../../game/hooks/useGameInput';
import { useControlLayout, type ControlButtonId } from './useControlLayout';

interface ButtonDef {
  id: ControlButtonId;
  label: string;
  action: string;
  color: string;
  size: number;
  side: 'left' | 'right';
}

const BASE_BUTTONS: ButtonDef[] = [
  { id: 'dpad-up',    label: '▲', action: 'moveUp',    color: '#4b5563', size: 44, side: 'left' },
  { id: 'dpad-down',  label: '▼', action: 'moveDown',  color: '#4b5563', size: 44, side: 'left' },
  { id: 'dpad-left',  label: '◀', action: 'moveLeft',  color: '#4b5563', size: 44, side: 'left' },
  { id: 'dpad-right', label: '▶', action: 'moveRight', color: '#4b5563', size: 44, side: 'left' },
  { id: 'btn-l',      label: 'L',  action: 'chargeHeld', color: '#1f2937', size: 40, side: 'left' },
  { id: 'btn-select', label: '⬟',  action: 'jump',     color: '#1f2937', size: 32, side: 'left' },
  { id: 'btn-a',     label: 'A', action: 'attack',     color: '#dc2626', size: 50, side: 'right' },
  { id: 'btn-b',     label: 'B', action: 'defense',    color: '#1d4ed8', size: 50, side: 'right' },
  { id: 'btn-x',     label: 'X', action: 'dodge',      color: '#b45309', size: 50, side: 'right' },
  { id: 'btn-y',     label: 'Y', action: 'jump',       color: '#15803d', size: 50, side: 'right' },
  { id: 'btn-r',     label: 'R',  action: 'specialTap', color: '#1f2937', size: 40, side: 'right' },
  { id: 'btn-start', label: '≡',  action: 'dodge',     color: '#1f2937', size: 32, side: 'right' },
];

const ROTATE_BTN: ButtonDef = {
  id: 'btn-exit', label: '↻', action: 'rotate25d', color: '#5b21b6', size: 38, side: 'right',
};

interface ControlButtonProps {
  def: ButtonDef;
  pos: { xPct: number; yPct: number };
  isDragging: boolean;
  isShaking: boolean;
  onDown: (e: React.PointerEvent) => void;
  onUp: (e: React.PointerEvent) => void;
  onMove: (e: React.PointerEvent) => void;
}

function CtrlBtn({ def, pos, isDragging, isShaking, onDown, onUp, onMove }: ControlButtonProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${pos.xPct}%`,
        top: `${pos.yPct}%`,
        transform: 'translate(-50%, -50%)',
        width: def.size,
        height: def.size,
        borderRadius: '50%',
        background: `${def.color}dd`,
        border: `1.5px solid ${isDragging ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: def.size > 46 ? '17px' : '13px',
        fontWeight: 700,
        zIndex: isDragging ? 100 : 10,
        cursor: isDragging ? 'grabbing' : 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        touchAction: 'none',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'border 100ms',
        animation: isShaking ? 'dragShake 0.35s ease-in-out 3' : undefined,
        outline: isShaking ? '2px solid rgba(255,255,255,0.6)' : undefined,
        outlineOffset: isShaking ? '2px' : undefined,
      }}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerMove={onMove}
      onPointerCancel={onUp}
    >
      {def.label}
    </div>
  );
}

interface GameShellProps {
  children: React.ReactNode;
  show25DRotate?: boolean;
}

export function GameShell({ children, show25DRotate = false }: GameShellProps) {
  const layout = useControlLayout();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const activePointers = useRef(new Map<number, ControlButtonId>());

  const buttons = show25DRotate ? [...BASE_BUTTONS, ROTATE_BTN] : BASE_BUTTONS;
  const leftBtns = buttons.filter(b => b.side === 'left');
  const rightBtns = buttons.filter(b => b.side === 'right');

  const applyAction = (action: string, active: boolean) => {
    if (action === 'chargeHeld') touchInputState.chargeHeld = active;
    else if (action === 'specialTap') { if (active) touchInputState.specialTap = true; }
    else (touchInputState as Record<string, boolean>)[action] = active;
  };

  const makeHandlers = useCallback((id: ControlButtonId, btn: ButtonDef, side: 'left' | 'right') => {
    const gutterRef = side === 'left' ? leftRef : rightRef;
    return {
      onDown: (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        if (layout.draggingId !== id) applyAction(btn.action, true);
        activePointers.current.set(e.pointerId, id);
        layout.startHold(id);
      },
      onUp: (e: React.PointerEvent) => {
        layout.cancelHold();
        layout.endDrag(id);
        applyAction(btn.action, false);
        activePointers.current.delete(e.pointerId);
      },
      onMove: (e: React.PointerEvent) => {
        if (layout.draggingId !== id) return;
        const rect = gutterRef.current?.getBoundingClientRect();
        if (rect) layout.updateDrag(id, e.clientX, e.clientY, rect);
      },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  return (
    <div className="game-shell" style={{ display: 'flex', flexDirection: 'row' }}>
      {/* ── Left gutter ──────────────────────────────────── */}
      {controlsVisible && (
        <div ref={leftRef} className="game-gutter" style={{ touchAction: 'none' }}>
          {leftBtns.map(btn => {
            const h = makeHandlers(btn.id, btn, 'left');
            return (
              <CtrlBtn
                key={btn.id}
                def={btn}
                pos={layout.getPosition(btn.id)}
                isDragging={layout.draggingId === btn.id}
                isShaking={layout.shakingId === btn.id}
                onDown={h.onDown}
                onUp={h.onUp}
                onMove={h.onMove}
              />
            );
          })}
        </div>
      )}

      {/* ── Game viewport slot (children = canvas + overlays) ── */}
      <div className="game-viewport-slot">
        {children}
      </div>

      {/* ── Right gutter ─────────────────────────────────── */}
      {controlsVisible && (
        <div ref={rightRef} className="game-gutter" style={{ touchAction: 'none' }}>
          {rightBtns.map(btn => {
            const h = makeHandlers(btn.id, btn, 'right');
            return (
              <CtrlBtn
                key={btn.id}
                def={btn}
                pos={layout.getPosition(btn.id)}
                isDragging={layout.draggingId === btn.id}
                isShaking={layout.shakingId === btn.id}
                onDown={h.onDown}
                onUp={h.onUp}
                onMove={h.onMove}
              />
            );
          })}
        </div>
      )}

      {/* ── Controls toggle ───────────────────────────────── */}
      <button
        onClick={() => setControlsVisible(v => !v)}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 50,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.45)', borderRadius: '8px',
          padding: '3px 10px', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        {controlsVisible ? 'HIDE' : 'CTRL'}
      </button>
    </div>
  );
}
