import { useEffect, useState } from "react";

export default function LaunchCinematic({
  active,
  power,
}: {
  active: boolean;
  power: number;
}) {
  const [fadeOut, setFadeOut] = useState(false);
  const [wasActive, setWasActive] = useState(false);

  useEffect(() => {
    if (active) {
      setWasActive(true);
      setFadeOut(false);
    } else if (wasActive) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setWasActive(false);
        setFadeOut(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [active, wasActive]);

  if (!wasActive) return null;

  const isHighPower = power > 120;
  const powerNorm = Math.min(power, 150) / 150;

  return (
    <div
      className="absolute inset-0 z-[80] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 500ms ease-out",
      }}
    >
      <style>{`
        @keyframes launch-scale-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          40% {
            transform: scale(1.15);
            opacity: 1;
          }
          60% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes launch-ripple {
          0% {
            transform: scale(1) translateX(0);
          }
          25% {
            transform: scale(1.02) translateX(-2px);
          }
          50% {
            transform: scale(0.98) translateX(2px);
          }
          75% {
            transform: scale(1.01) translateX(-1px);
          }
          100% {
            transform: scale(1) translateX(0);
          }
        }
        @keyframes launch-glow-pulse {
          0%, 100% {
            text-shadow:
              0 0 20px #f59e0b,
              0 0 40px #f59e0b,
              0 0 80px #d97706,
              0 0 120px #b45309;
          }
          50% {
            text-shadow:
              0 0 30px #fbbf24,
              0 0 60px #fbbf24,
              0 0 100px #f59e0b,
              0 0 160px #d97706;
          }
        }
      `}</style>

      {/* Golden aura ring behind text when power > 120 */}
      {isHighPower && (
        <div
          className="absolute rounded-full"
          style={{
            width: `${200 + powerNorm * 100}px`,
            height: `${200 + powerNorm * 100}px`,
            background: `radial-gradient(circle, rgba(251, 191, 36, ${0.3 + powerNorm * 0.3}) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 70%)`,
            animation: "launch-glow-pulse 0.8s ease-in-out infinite",
          }}
        />
      )}

      {/* LET IT RIP text */}
      <div
        className="text-3xl sm:text-4xl font-black uppercase tracking-wider select-none"
        style={{
          color: isHighPower ? "#fbbf24" : "#ffffff",
          textShadow: isHighPower
            ? "0 0 30px #f59e0b, 0 0 60px #d97706, 0 0 90px #b45309, 3px 3px 0 #78350f"
            : "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2), 3px 3px 0 #374151",
          WebkitTextStroke: isHighPower ? "2px #92400e" : "2px #4b5563",
          animation: active
            ? `launch-scale-in 0.6s ease-out forwards, launch-ripple 0.3s ease-in-out ${0.6}s infinite`
            : "none",
        }}
      >
        LET IT RIP!
      </div>

      {/* Power level indicator */}
      <div
        className="absolute bottom-[20%] text-xl sm:text-2xl font-bold tracking-widest uppercase"
        style={{
          color: isHighPower ? "#fbbf24" : "#9ca3af",
          textShadow: isHighPower ? "0 0 10px #f59e0b" : "none",
          opacity: powerNorm,
        }}
      >
        Power: {Math.round(power)}%
      </div>
    </div>
  );
}
