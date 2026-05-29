import { useEffect, useState } from "react";

const DURATION_MS = 1200;

type KOType = "ko" | "ring_out" | "outspin";

const TYPE_CONFIG: Record<KOType, { text: string; color: string; glow: string; stroke: string }> = {
  ko: {
    text: "K.O.!!",
    color: "#ef4444",
    glow: "0 0 40px #ef4444, 0 0 80px #dc2626, 0 0 120px #b91c1c, 4px 4px 0 #7f1d1d",
    stroke: "#991b1b",
  },
  ring_out: {
    text: "RING OUT!",
    color: "#3b82f6",
    glow: "0 0 40px #3b82f6, 0 0 80px #2563eb, 0 0 120px #1d4ed8, 4px 4px 0 #1e3a5f",
    stroke: "#1e40af",
  },
  outspin: {
    text: "OUTSPIN!",
    color: "#f59e0b",
    glow: "0 0 40px #f59e0b, 0 0 80px #d97706, 0 0 120px #b45309, 4px 4px 0 #78350f",
    stroke: "#92400e",
  },
};

export default function KOOverlay({
  visible,
  type,
  onComplete,
}: {
  visible: boolean;
  type: KOType;
  onComplete: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!show) return null;

  const config = TYPE_CONFIG[type];
  const flashBg =
    type === "ko"
      ? "rgba(239, 68, 68, 0.6)"
      : type === "ring_out"
        ? "rgba(59, 130, 246, 0.5)"
        : "rgba(245, 158, 11, 0.5)";

  return (
    <div className="absolute inset-0 z-[80] pointer-events-none overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes ko-flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes ko-text-bounce {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          30% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 1;
          }
          65% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        @keyframes ko-ring {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
      `}</style>

      {/* Color flash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: flashBg,
          animation: `ko-flash ${DURATION_MS * 0.6}ms ease-out forwards`,
        }}
      />

      {/* Expanding ring */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "100px",
          height: "100px",
          border: `4px solid ${config.color}`,
          animation: `ko-ring ${DURATION_MS * 0.8}ms ease-out forwards`,
        }}
      />

      {/* Main text */}
      <div
        className="absolute left-1/2 top-1/2 text-7xl sm:text-8xl md:text-9xl font-black tracking-wider whitespace-nowrap"
        style={{
          color: config.color,
          textShadow: config.glow,
          WebkitTextStroke: `2px ${config.stroke}`,
          animation: `ko-text-bounce ${DURATION_MS}ms ease-out forwards`,
        }}
      >
        {config.text}
      </div>
    </div>
  );
}
