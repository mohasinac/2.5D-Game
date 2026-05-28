import { useCallback, useEffect, useRef, useState } from 'react';

export type ControlButtonId =
  | 'dpad-up' | 'dpad-down' | 'dpad-left' | 'dpad-right'
  | 'btn-a' | 'btn-b' | 'btn-x' | 'btn-y'
  | 'btn-l' | 'btn-r'
  | 'btn-select' | 'btn-start' | 'btn-exit';

export interface ControlPosition {
  /** Percentage of gutter width from left edge of gutter area */
  xPct: number;
  /** Percentage of gutter height from top edge of gutter area */
  yPct: number;
}

type PositionMap = Partial<Record<ControlButtonId, ControlPosition>>;

const STORAGE_KEY = 'bey.controlLayout.v1';

const DEFAULT_LEFT_POSITIONS: Partial<Record<ControlButtonId, ControlPosition>> = {
  'dpad-up':    { xPct: 50, yPct: 38 },
  'dpad-down':  { xPct: 50, yPct: 62 },
  'dpad-left':  { xPct: 30, yPct: 50 },
  'dpad-right': { xPct: 70, yPct: 50 },
  'btn-l':      { xPct: 50, yPct: 12 },
  'btn-select': { xPct: 50, yPct: 82 },
};

const DEFAULT_RIGHT_POSITIONS: Partial<Record<ControlButtonId, ControlPosition>> = {
  'btn-a':     { xPct: 70, yPct: 50 },
  'btn-b':     { xPct: 50, yPct: 62 },
  'btn-x':     { xPct: 50, yPct: 38 },
  'btn-y':     { xPct: 30, yPct: 50 },
  'btn-r':     { xPct: 50, yPct: 12 },
  'btn-start': { xPct: 30, yPct: 82 },
  'btn-exit':  { xPct: 70, yPct: 82 },
};

export const DEFAULT_POSITIONS: PositionMap = {
  ...DEFAULT_LEFT_POSITIONS,
  ...DEFAULT_RIGHT_POSITIONS,
};

function loadPositions(): PositionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_POSITIONS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_POSITIONS };
}

function savePositions(positions: PositionMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch { /* ignore */ }
}

interface HoldState {
  id: ControlButtonId;
  startTime: number;
  timerId: ReturnType<typeof setTimeout>;
}

export function useControlLayout() {
  const [positions, setPositions] = useState<PositionMap>(loadPositions);
  const [draggingId, setDraggingId] = useState<ControlButtonId | null>(null);
  const [shakingId, setShakingId] = useState<ControlButtonId | null>(null);
  const holdRef = useRef<HoldState | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; origPos: ControlPosition } | null>(null);

  const resetPositions = useCallback(() => {
    setPositions({ ...DEFAULT_POSITIONS });
    savePositions({ ...DEFAULT_POSITIONS });
  }, []);

  const getPosition = useCallback((id: ControlButtonId): ControlPosition => {
    return positions[id] ?? DEFAULT_POSITIONS[id] ?? { xPct: 50, yPct: 50 };
  }, [positions]);

  const startHold = useCallback((id: ControlButtonId) => {
    if (holdRef.current) clearTimeout(holdRef.current.timerId);
    const timerId = setTimeout(() => {
      setShakingId(id);
      setDraggingId(id);
      holdRef.current = null;
      setTimeout(() => setShakingId(null), 1200);
    }, 10000);
    holdRef.current = { id, startTime: Date.now(), timerId };
  }, []);

  const cancelHold = useCallback(() => {
    if (holdRef.current) {
      clearTimeout(holdRef.current.timerId);
      holdRef.current = null;
    }
  }, []);

  const startDrag = useCallback((
    id: ControlButtonId,
    clientX: number,
    clientY: number,
    origPos: ControlPosition,
  ) => {
    dragStartRef.current = { x: clientX, y: clientY, origPos };
    setDraggingId(id);
  }, []);

  const updateDrag = useCallback((
    id: ControlButtonId,
    clientX: number,
    clientY: number,
    gutterRect: DOMRect,
  ) => {
    if (!dragStartRef.current) return;
    const xPct = Math.max(5, Math.min(95, ((clientX - gutterRect.left) / gutterRect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((clientY - gutterRect.top) / gutterRect.height) * 100));
    setPositions(prev => ({ ...prev, [id]: { xPct, yPct } }));
  }, []);

  const endDrag = useCallback((id: ControlButtonId) => {
    setDraggingId(null);
    dragStartRef.current = null;
    setPositions(prev => {
      savePositions(prev);
      return prev;
    });
    if (id === draggingId) setDraggingId(null);
  }, [draggingId]);

  useEffect(() => () => {
    if (holdRef.current) clearTimeout(holdRef.current.timerId);
  }, []);

  return {
    positions,
    draggingId,
    shakingId,
    getPosition,
    startHold,
    cancelHold,
    startDrag,
    updateDrag,
    endDrag,
    resetPositions,
  };
}
