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
      <div style={{
        position: "relative",
        maxWidth: 220,
        maxHeight: 300,
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(120,80,255,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <img
          src={asset.imageUrl}
          alt={asset.name}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 12px rgba(150,100,255,0.7))",
            imageRendering: "auto",
          }}
        />
        <div style={{
          position: "absolute",
          bottom: -22,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontFamily: "monospace",
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "#ccaaff",
          textShadow: "0 0 8px #8844ff",
          letterSpacing: "0.08em",
        }}>
          {asset.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
