// SpinningBeyblade — animated spinning beyblade used in lobby/loading screens.
// Spins faster as `speed` increases (0.5 = slow idle, 1.0 = normal, 2.0 = launching).
// Falls back to a generic gear emoji if no image is provided.

import React, { useEffect, useRef } from "react";

interface SpinningBeybladeProps {
  imageUrl?: string | null;
  size?: number;      // px, default 80
  speed?: number;     // multiplier 0.5–3.0, default 1.0
  className?: string;
}

export function SpinningBeyblade({ imageUrl, size = 80, speed = 1.0, className = "" }: SpinningBeybladeProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  // Smooth RAf-driven spin (not CSS animation — allows dynamic speed changes)
  useEffect(() => {
    const degsPerMs = (360 * speed) / 1000; // full rotations per second * speed

    const tick = (now: number) => {
      const dt = prevTimeRef.current !== null ? now - prevTimeRef.current : 0;
      prevTimeRef.current = now;
      angleRef.current = (angleRef.current + degsPerMs * dt) % 360;
      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [speed]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        ref={imgRef}
        className="w-full h-full flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="beyblade"
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <span
            className="select-none"
            style={{ fontSize: size * 0.7, lineHeight: 1 }}
            aria-label="beyblade"
          >
            ⚙
          </span>
        )}
      </div>
    </div>
  );
}
