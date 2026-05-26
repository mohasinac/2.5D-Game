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
    <div
      className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} w-[40%] h-full z-[60] pointer-events-none flex items-center ${isLeft ? "justify-start" : "justify-end"} px-4 [transition:opacity_0.4s_ease] [opacity:var(--bit-op)]`}
      style={{"--bit-op": opacity} as React.CSSProperties}
    >
      <div className="relative max-w-[220px] max-h-[300px]">
        {/* Glow backdrop */}
        <div className="absolute pointer-events-none -inset-5 rounded-[50%] bg-[radial-gradient(ellipse,rgba(120,80,255,0.35)_0%,transparent_70%)]" />
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-auto object-contain [filter:drop-shadow(0_0_12px_rgba(150,100,255,0.7))]"
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-[22px] whitespace-nowrap font-mono text-[0.7rem] font-bold text-[#ccaaff] [text-shadow:0_0_8px_#8844ff] tracking-[0.08em]"
        >
          {asset.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
