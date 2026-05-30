// StatCountUp — animated number that ticks from 0 to a target value.
// Uses requestAnimationFrame with ease-out timing.

import React, { useEffect, useRef, useState } from "react";

interface StatCountUpProps {
  value: number;
  duration?: number;   // ms, default 2000
  delay?: number;      // ms before starting, default 0
  format?: (n: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCountUp({
  value, duration = 2000, delay = 0, format, className, style,
}: StatCountUpProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === 0) return;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      startRef.current = performance.now();
      const tick = (now: number) => {
        const elapsed = now - (startRef.current ?? now);
        const t = easeOut(Math.min(1, elapsed / duration));
        setDisplay(Math.round(value * t));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (delay > 0) {
      delayTimer = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, delay]);

  const formatted = format ? format(display) : display.toLocaleString();
  return <span className={className} style={style}>{formatted}</span>;
}
