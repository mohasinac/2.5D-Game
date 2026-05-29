import { useEffect, useState, useCallback } from "react";

const DISMISS_MS = 5000;
const CONFETTI_COUNT = 40;

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  attack: { bg: "bg-red-600", text: "text-red-100" },
  defense: { bg: "bg-blue-600", text: "text-blue-100" },
  stamina: { bg: "bg-green-600", text: "text-green-100" },
  balanced: { bg: "bg-yellow-600", text: "text-yellow-100" },
};

function ConfettiPiece({ index }: { index: number }) {
  const left = Math.random() * 100;
  const size = 6 + Math.random() * 8;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 3;
  const hue = Math.floor(Math.random() * 360);
  const drift = (Math.random() - 0.5) * 80;

  return (
    <div
      key={index}
      className="absolute top-0"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: `hsl(${hue}, 80%, 60%)`,
        animation: `confetti-fall ${duration}s linear ${delay}s infinite`,
        transform: `translateX(${drift}px)`,
      }}
    />
  );
}

export default function VictoryOverlay({
  visible,
  winnerName,
  winnerType,
  onDismiss,
}: {
  visible: boolean;
  winnerName: string;
  winnerType: string;
  onDismiss: () => void;
}) {
  const [show, setShow] = useState(false);

  const handleDismiss = useCallback(() => {
    setShow(false);
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }
    setShow(true);
    const timer = setTimeout(handleDismiss, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, handleDismiss]);

  if (!show) return null;

  const typeStyle = TYPE_COLORS[winnerType.toLowerCase()] ?? {
    bg: "bg-gray-600",
    text: "text-gray-100",
  };

  const confettiPieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => (
    <ConfettiPiece key={i} index={i} />
  ));

  return (
    <div
      className="absolute inset-0 z-[80] flex flex-col items-center justify-center cursor-pointer"
      onClick={handleDismiss}
    >
      <style>{`
        @keyframes victory-backdrop {
          0% { opacity: 0; }
          20% { opacity: 1; }
        }
        @keyframes victory-header {
          0% {
            opacity: 0;
            letter-spacing: 1em;
          }
          60% {
            opacity: 1;
            letter-spacing: 0.3em;
          }
          100% {
            opacity: 1;
            letter-spacing: 0.2em;
          }
        }
        @keyframes victory-name-slam {
          0% {
            transform: scale(3) translateY(-40px);
            opacity: 0;
          }
          40% {
            transform: scale(1.1) translateY(0);
            opacity: 1;
          }
          60% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes victory-badge {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        style={{ animation: "victory-backdrop 0.5s ease-out forwards" }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces}
      </div>

      {/* VICTORY header */}
      <div
        className="relative text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-amber-400 mb-6"
        style={{
          textShadow: "0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.3)",
          animation: "victory-header 0.8s ease-out forwards",
        }}
      >
        VICTORY
      </div>

      {/* Winner name */}
      <div
        className="relative text-5xl sm:text-6xl md:text-8xl font-black uppercase text-white mb-6"
        style={{
          textShadow: "0 0 30px rgba(255,255,255,0.4), 4px 4px 0 rgba(0,0,0,0.5)",
          animation: "victory-name-slam 0.8s ease-out 0.3s both",
        }}
      >
        {winnerName}
      </div>

      {/* Type badge */}
      <div
        className={`relative px-6 py-2 rounded-full text-lg sm:text-xl font-bold uppercase ${typeStyle.bg} ${typeStyle.text}`}
        style={{
          animation: "victory-badge 0.5s ease-out 0.8s both",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {winnerType}
      </div>

      {/* Dismiss hint */}
      <div
        className="relative mt-8 text-sm text-gray-400 animate-pulse"
        style={{ animation: "victory-badge 0.5s ease-out 1.5s both" }}
      >
        Click anywhere to continue
      </div>
    </div>
  );
}
