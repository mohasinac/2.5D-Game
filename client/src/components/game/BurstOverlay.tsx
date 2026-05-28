import { useEffect, useState } from "react";

const DURATION_MS = 1500;
const CRACK_COUNT = 12;

export default function BurstOverlay({
  visible,
  onComplete,
}: {
  visible: boolean;
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

  const cracks = Array.from({ length: CRACK_COUNT }, (_, i) => {
    const angle = (360 / CRACK_COUNT) * i;
    return (
      <div
        key={i}
        className="absolute left-1/2 top-1/2 origin-bottom-left"
        style={{
          width: "2px",
          height: "0%",
          background: "linear-gradient(to top, #dc2626, transparent)",
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          animation: `burst-crack-expand ${DURATION_MS * 0.6}ms ease-out forwards`,
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
      {/* Keyframe definitions */}
      <style>{`
        @keyframes burst-flash {
          0% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes burst-crack-expand {
          0% { height: 0%; }
          100% { height: 45vh; }
        }
        @keyframes burst-text-slam {
          0% {
            transform: translate(-50%, -300%) scale(3);
            opacity: 0;
          }
          30% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Crimson flash */}
      <div
        className="absolute inset-0 bg-red-700"
        style={{
          animation: `burst-flash ${DURATION_MS}ms ease-out forwards`,
        }}
      />

      {/* Radial cracks */}
      {cracks}

      {/* BURST!! text */}
      <div
        className="absolute left-1/2 top-1/2 text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-widest"
        style={{
          textShadow:
            "0 0 40px #dc2626, 0 0 80px #dc2626, 0 0 120px #991b1b, 4px 4px 0 #7f1d1d",
          WebkitTextStroke: "2px #991b1b",
          animation: `burst-text-slam ${DURATION_MS}ms ease-out forwards`,
        }}
      >
        BURST!!
      </div>
    </div>
  );
}
