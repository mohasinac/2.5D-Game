// BitBeastCinematic — full-screen burst-in overlay shown when the player fires a
// special move or when the launching phase begins ("beast reveal").
// Pointer-events-none so it never blocks game input.

import { useEffect, useRef, useState } from "react";

interface Props {
  imageUrl: string;
  moveName: string;
  visible: boolean;
}

export function BitBeastCinematic({ imageUrl, moveName, visible }: Props) {
  const [show, setShow]       = useState(false);
  const [fading, setFading]   = useState(false);
  const fadeTimerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (visible && imageUrl) {
      setShow(true);
      setFading(false);
    } else if (show) {
      setFading(true);
      fadeTimerRef.current = setTimeout(() => { setShow(false); setFading(false); }, 350);
    }
    return () => { if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current); };
  }, [visible, imageUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show || !imageUrl) return null;

  return (
    <>
      <style>{`
        @keyframes bb-burst {
          0%   { transform: scale(2.8); opacity: 0; }
          20%  { transform: scale(1);   opacity: 1; }
          80%  { transform: scale(1);   opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes bb-name-in {
          0%   { opacity: 0; letter-spacing: 0.5em; }
          30%  { opacity: 1; letter-spacing: 0.22em; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bb-bg-pulse {
          0%, 100% { opacity: 0.78; }
          50%       { opacity: 0.88; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[195] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(60,30,100,0.9) 0%, rgba(0,0,0,0.82) 70%)",
          animation: "bb-bg-pulse 0.9s ease-in-out infinite",
          opacity: fading ? 0 : 1,
          transition: fading ? "opacity 0.35s ease-out" : "none",
        }}
      />

      {/* Beast image + move name */}
      <div
        className="fixed inset-0 z-[196] pointer-events-none flex flex-col items-center justify-center gap-4"
        style={{ opacity: fading ? 0 : 1, transition: fading ? "opacity 0.35s ease-out" : "none" }}
      >
        {/* Glow ring behind image */}
        <div
          style={{
            position: "absolute",
            width: "min(55vw, 55vh)",
            height: "min(55vw, 55vh)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(140,80,255,0.45) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Beast image */}
        <img
          src={imageUrl}
          alt={moveName}
          style={{
            width: "min(52vw, 52vh)",
            height: "min(52vw, 52vh)",
            objectFit: "contain",
            filter: "drop-shadow(0 0 20px rgba(160,100,255,0.8)) drop-shadow(0 0 40px rgba(100,60,200,0.5))",
            animation: "bb-burst 1.8s cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        />

        {/* Move name */}
        {moveName && (
          <div
            style={{
              fontSize: "clamp(16px, 4vw, 28px)",
              fontWeight: 900,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              textShadow: "0 0 20px #b06fff, 0 0 40px #7833ff, 0 0 60px #5500cc",
              animation: "bb-name-in 1.8s cubic-bezier(0.22,1,0.36,1) forwards",
              userSelect: "none",
            }}
          >
            {moveName}
          </div>
        )}
      </div>
    </>
  );
}
