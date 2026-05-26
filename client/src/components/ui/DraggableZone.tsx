import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Pos { x: number; y: number; }

interface DraggableZoneProps {
  storageKey: string;
  children: React.ReactNode;
  /** Applied to the wrapper div when docked (normal in-flow positioning). */
  className?: string;
}

function loadPos(key: string): Pos | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

function savePos(key: string, pos: Pos) {
  try { localStorage.setItem(key, JSON.stringify(pos)); } catch { /* ignore */ }
}

export function DraggableZone({ storageKey, children, className }: DraggableZoneProps) {
  const [floating, setFloating] = useState<Pos | null>(() => loadPos(storageKey));
  const dragRef = useRef<{ startPointer: Pos; startEl: Pos } | null>(null);
  const elRef = useRef<HTMLDivElement>(null);

  const isDocked = floating === null;

  const handleDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = elRef.current?.getBoundingClientRect();
    dragRef.current = {
      startPointer: { x: e.clientX, y: e.clientY },
      startEl: rect ? { x: rect.left, y: rect.top } : { x: e.clientX - 60, y: e.clientY - 20 },
    };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startPointer.x;
    const dy = e.clientY - dragRef.current.startPointer.y;
    const moved = Math.sqrt(dx * dx + dy * dy);
    if (moved < 8 && isDocked) return;
    const newPos = {
      x: dragRef.current.startEl.x + dx,
      y: dragRef.current.startEl.y + dy,
    };
    setFloating(newPos);
    savePos(storageKey, newPos);
  };

  const handleDragEnd = () => { dragRef.current = null; };

  const snapBack = () => {
    setFloating(null);
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  };

  // Clamp to viewport on resize
  useEffect(() => {
    if (!floating) return;
    const clamp = () => {
      const el = elRef.current;
      if (!el) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { width, height } = el.getBoundingClientRect();
      setFloating(prev => {
        if (!prev) return null;
        return {
          x: Math.max(0, Math.min(prev.x, vw - width)),
          y: Math.max(0, Math.min(prev.y, vh - height)),
        };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [floating]);

  if (isDocked) {
    return (
      <div ref={elRef} className={cn("relative", className)}>
        <button
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-bg3 border border-border-c text-theme-faint hover:text-theme-text text-[10px] flex items-center justify-center z-10 cursor-grab active:cursor-grabbing"
          title="Drag to move"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
        >
          ⠿
        </button>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={elRef}
      className="fixed z-[200] touch-none select-none bg-bg0/80 backdrop-blur-sm rounded-2xl border border-border-c p-3"
      style={{ left: floating.x, top: floating.y }}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          className="cursor-grab active:cursor-grabbing text-theme-faint hover:text-theme-text text-base leading-none px-1"
          title="Drag to move"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
        >
          ⠿
        </button>
        <button
          onClick={snapBack}
          className="text-[10px] text-theme-faint hover:text-theme-text px-1.5 py-0.5 rounded bg-bg2 border border-border-c leading-none"
          title="Snap back to default position"
        >
          ⌂
        </button>
      </div>
      {children}
    </div>
  );
}
