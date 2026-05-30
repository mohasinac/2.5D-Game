// FloatingDamageText — animated floating damage numbers over the game canvas.
// Rendered as absolutely-positioned DOM elements over the PixiJS canvas.
// Pooled via a React state array; each entry auto-removes after its animation.

import React, { useCallback, useEffect, useRef, useState } from "react";

export type DamageTextKind = "damage" | "received" | "burst" | "ring-out" | "spin-out" | "heal";

export interface DamageTextEntry {
  id: number;
  x: number;       // canvas % (0–100) — converts to left% style
  y: number;       // canvas % (0–100) — converts to top% style
  text: string;
  kind: DamageTextKind;
}

interface FloatingDamageTextProps {
  entries: DamageTextEntry[];
  onExpired: (id: number) => void;
}

const KIND_STYLES: Record<DamageTextKind, { color: string; fontSize: number; shadow: string }> = {
  damage:   { color: "#FFD700", fontSize: 18, shadow: "0 2px 4px #00000099" },
  received: { color: "#FF3333", fontSize: 20, shadow: "0 2px 6px #00000099" },
  burst:    { color: "#FFFFFF", fontSize: 26, shadow: "0 0 16px #FF3333, 0 2px 8px #00000099" },
  "ring-out": { color: "#FF8C00", fontSize: 22, shadow: "0 2px 6px #00000099" },
  "spin-out": { color: "#4D9FFF", fontSize: 22, shadow: "0 2px 6px #00000099" },
  heal:     { color: "#00FF88", fontSize: 16, shadow: "0 2px 4px #00000099" },
};

function FloatingTextItem({ entry, onExpired }: { entry: DamageTextEntry; onExpired: (id: number) => void }) {
  const style = KIND_STYLES[entry.kind];
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => onExpired(entry.id), 1000);
    return () => clearTimeout(t);
  }, [entry.id, onExpired]);

  return (
    <div
      ref={elRef}
      className="absolute pointer-events-none select-none font-bold font-mono z-[100]"
      style={{
        left: `${entry.x}%`,
        top: `${entry.y}%`,
        fontSize: style.fontSize,
        color: style.color,
        textShadow: style.shadow,
        transform: "translate(-50%, -50%)",
        animation: "floatUp 1s ease-out forwards",
        whiteSpace: "nowrap",
      }}
    >
      {entry.text}
    </div>
  );
}

export function FloatingDamageText({ entries, onExpired }: FloatingDamageTextProps) {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1;   transform: translate(-50%, -50%) scale(1.3); }
          20%  { opacity: 1;   transform: translate(-50%, calc(-50% - 8px)) scale(1); }
          80%  { opacity: 0.8; transform: translate(-50%, calc(-50% - 32px)) scale(1); }
          100% { opacity: 0;   transform: translate(-50%, calc(-50% - 48px)) scale(0.9); }
        }
      `}</style>
      {entries.map(entry => (
        <FloatingTextItem key={entry.id} entry={entry} onExpired={onExpired} />
      ))}
    </>
  );
}

// Hook for managing damage text entries from outside
let _nextId = 1;

export function useFloatingDamageText() {
  const [entries, setEntries] = useState<DamageTextEntry[]>([]);

  const addEntry = useCallback((
    x: number, y: number, text: string, kind: DamageTextKind
  ) => {
    const id = _nextId++;
    setEntries(prev => [...prev.slice(-20), { id, x, y, text, kind }]);
  }, []);

  const removeEntry = useCallback((id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  return { entries, addEntry, removeEntry };
}
