// Phase 28 — BitBeastOverlay: fullscreen GIF/PNG overlay that plays on special activation.
// Receives a BitBeastAssetDoc; fades in, holds, then fades out over `durationMs`.

import { useEffect, useRef, useState } from "react";
import type { BitBeastAssetDoc } from "@/game/renderer/IGameRenderer";

interface BitBeastOverlayProps {
  side: "left" | "right";
  asset: BitBeastAssetDoc | null;
  visible: boolean;
  durationMs?: number;
}

export function BitBeastOverlay({ side, asset, visible, durationMs = 2400 }: BitBeastOverlayProps) {
  const [opacity, setOpacity] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (visible && asset) {
      setOpacity(1);
      timerRef.current = setTimeout(() => setOpacity(0), durationMs - 400);
    } else {
      setOpacity(0);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, asset, durationMs]);

  if (!asset || opacity === 0) return null;

  const isLeft = side === "left";

  return (
    <div style={{
      position: "absolute",
      top: 0,
      [isLeft ? "left" : "right"]: 0,
      width: "40%",
      height: "100%",
      zIndex: 60,
      pointerEvents: "none",
      opacity,
      transition: "opacity 0.4s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: isLeft ? "flex-start" : "flex-end",
      padding: "0 1rem",
    }}>
      <div className="relative max-w-[220px] max-h-[300px]">
        {/* Glow backdrop */}
        <div className="absolute pointer-events-none -inset-5 rounded-[50%] bg-[radial-gradient(ellipse,rgba(120,80,255,0.35)_0%,transparent_70%)]" />
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-auto object-contain [filter:drop-shadow(0_0_12px_rgba(150,100,255,0.7))]"
        />
        <div
          className="absolute whitespace-nowrap font-mono text-[0.7rem] font-bold text-[#ccaaff] [text-shadow:0_0_8px_#8844ff] tracking-[0.08em]"
          style={{
            bottom: -22,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {asset.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
