import React, { useCallback, useRef } from 'react';
import { touchInputState } from '../../game/hooks/useGameInput';
import { useControlLayout, type ControlButtonId } from './useControlLayout';

interface ButtonDef {
  id: ControlButtonId;
  label: string;
  action: keyof typeof touchInputState;
  color: string;
  size: number;
  side: 'left' | 'right';
}

interface ControlOverlayProps {
  show25DRotate?: boolean;
  visible?: boolean;
  onToggleVisibility?: () => void;
}

const LEFT_BUTTONS: ButtonDef[] = [
  { id: 'dpad-up',    label: '▲', action: 'moveUp',    color: '#6b7280', size: 48, side: 'left' },
  { id: 'dpad-down',  label: '▼', action: 'moveDown',  color: '#6b7280', size: 48, side: 'left' },
  { id: 'dpad-left',  label: '◀', action: 'moveLeft',  color: '#6b7280', size: 48, side: 'left' },
  { id: 'dpad-right', label: '▶', action: 'moveRight', color: '#6b7280', size: 48, side: 'left' },
  { id: 'btn-l',      label: 'L',  action: 'chargeHeld', color: '#374151', size: 44, side: 'left' },
  { id: 'btn-select', label: '⬟',  action: 'jump',      color: '#374151', size: 36, side: 'left' },
];

const RIGHT_BUTTONS: ButtonDef[] = [
  { id: 'btn-a', label: 'A', action: 'attack',   color: '#dc2626', size: 52, side: 'right' },
  { id: 'btn-b', label: 'B', action: 'defense',  color: '#2563eb', size: 52, side: 'right' },
  { id: 'btn-x', label: 'X', action: 'dodge',    color: '#d97706', size: 52, side: 'right' },
  { id: 'btn-y', label: 'Y', action: 'jump',     color: '#16a34a', size: 52, side: 'right' },
  { id: 'btn-r', label: 'R', action: 'specialTap', color: '#374151', size: 44, side: 'right' },
  { id: 'btn-start', label: '≡', action: 'dodge',  color: '#374151', size: 36, side: 'right' },
];

const ROTATE_BUTTON: ButtonDef = {
  id: 'btn-exit', label: '↻', action: 'dodge', color: '#7c3aed', size: 40, side: 'right',
};

function ControlButton({
  def,
  pos,
  isDragging,
  isShaking,
  onPointerDown,
  onPointerUp,
  onPointerMove,
}: {
  def: ButtonDef;
  pos: { xPct: number; yPct: number };
  isDragging: boolean;
  isShaking: boolean;
  onPointerDown: (e: React.PointerEvent, id: ControlButtonId) => void;
  onPointerUp: (e: React.PointerEvent, id: ControlButtonId) => void;
  onPointerMove: (e: React.PointerEvent, id: ControlButtonId) => void;
}) {
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
        background: `${def.color}cc`,
        border: isDragging
          ? '2px solid rgba(255,255,255,0.8)'
          : '1.5px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: def.size > 48 ? '18px' : '14px',
        fontWeight: 700,
        cursor: isDragging ? 'grabbing' : 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: isDragging ? 100 : 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        transition: isDragging ? 'none' : 'box-shadow 100ms',
        animation: isShaking ? 'dragShake 0.35s ease-in-out 3' : undefined,
      }}
      className={isShaking ? 'control-btn-draggable' : ''}
      onPointerDown={e => onPointerDown(e, def.id)}
      onPointerUp={e => onPointerUp(e, def.id)}
      onPointerMove={e => onPointerMove(e, def.id)}
    >
      {def.label}
    </div>
  );
}

export function ControlOverlay({ show25DRotate = false, visible = true }: ControlOverlayProps) {
  const layout = useControlLayout();
  const leftGutterRef = useRef<HTMLDivElement>(null);
  const rightGutterRef = useRef<HTMLDivElement>(null);
  const activePointers = useRef<Map<number, ControlButtonId>>(new Map());
  const pressedButtons = useRef<Set<ControlButtonId>>(new Set());

  const press = useCallback((id: ControlButtonId, btn: ButtonDef) => {
    pressedButtons.current.add(id);
    if (btn.action === 'specialTap') {
      touchInputState.specialTap = true;
    } else if (btn.action === 'chargeHeld') {
      touchInputState.chargeHeld = true;
    } else {
      (touchInputState as Record<string, boolean>)[btn.action] = true;
    }
  }, []);

  const release = useCallback((id: ControlButtonId, btn: ButtonDef) => {
    pressedButtons.current.delete(id);
    if (btn.action === 'specialTap') {
      touchInputState.specialTap = false;
    } else if (btn.action === 'chargeHeld') {
      touchInputState.chargeHeld = false;
    } else {
      (touchInputState as Record<string, boolean>)[btn.action] = false;
    }
  }, []);

  const getAllButtons = (): ButtonDef[] => {
    const btns = [...LEFT_BUTTONS, ...RIGHT_BUTTONS];
    if (show25DRotate) btns.push(ROTATE_BUTTON);
    return btns;
  };

  const getGutterRef = (side: 'left' | 'right') =>
    side === 'left' ? leftGutterRef : rightGutterRef;

  const handlePointerDown = useCallback((e: React.PointerEvent, id: ControlButtonId) => {
    if (layout.draggingId === id) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const btn = getAllButtons().find(b => b.id === id);
    if (btn) press(id, btn);
    activePointers.current.set(e.pointerId, id);
    layout.startHold(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, press, show25DRotate]);

  const handlePointerUp = useCallback((e: React.PointerEvent, id: ControlButtonId) => {
    layout.cancelHold();
    layout.endDrag(id);
    const btn = getAllButtons().find(b => b.id === id);
    if (btn) release(id, btn);
    activePointers.current.delete(e.pointerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, release, show25DRotate]);

  const handlePointerMove = useCallback((e: React.PointerEvent, id: ControlButtonId) => {
    if (layout.draggingId !== id) return;
    const btn = getAllButtons().find(b => b.id === id);
    if (!btn) return;
    const gutterEl = getGutterRef(btn.side).current;
    if (!gutterEl) return;
    const rect = gutterEl.getBoundingClientRect();
    layout.updateDrag(id, e.clientX, e.clientY, rect);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, show25DRotate]);

  if (!visible) return null;

  const allButtons = getAllButtons();

  return (
    <>
      {/* Left gutter */}
      <div
        ref={leftGutterRef}
        className="game-gutter"
        style={{ position: 'relative', touchAction: 'none' }}
      >
        {allButtons.filter(b => b.side === 'left').map(btn => (
          <ControlButton
            key={btn.id}
            def={btn}
            pos={layout.getPosition(btn.id)}
            isDragging={layout.draggingId === btn.id}
            isShaking={layout.shakingId === btn.id}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
          />
        ))}
      </div>

      {/* Right gutter */}
      <div
        ref={rightGutterRef}
        className="game-gutter"
        style={{ position: 'relative', touchAction: 'none' }}
      >
        {allButtons.filter(b => b.side === 'right').map(btn => (
          <ControlButton
            key={btn.id}
            def={btn}
            pos={layout.getPosition(btn.id)}
            isDragging={layout.draggingId === btn.id}
            isShaking={layout.shakingId === btn.id}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
          />
        ))}
      </div>
    </>
  );
}
