// LaunchPhase — 5-second launch setup overlay shown during status="launching".
// Controls: A/D=tilt, W/S=position, Hold Space=charge+lock, Release Space=launch.
// Once Space is held, position and tilt are locked.
// Shows arena world background behind the scrim and teammate launch progress below.

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ServerBeyblade, ServerArenaState } from "@/types/game";

interface LaunchPhaseProps {
  launchTimer: number;
  launchTilt: number;
  launchPosition: number;
  launchPower: number;
  chargingStarted: boolean;
  launched: boolean;
  failed: boolean;
  isSpectating?: boolean;
  myBeyId?: string | null;
  beyblades?: Map<string, ServerBeyblade>;
  arena?: ServerArenaState | null;
}

const TYPE_COLORS: Record<string, string> = {
  attack: "#ff4444",
  defense: "#4488ff",
  stamina: "#44ff88",
  balanced: "#ffcc44",
};

function worldBgCssStyle(arena?: ServerArenaState | null): CSSProperties {
  const type  = arena?.worldBgType    ?? "none";
  const color = arena?.worldBgColor   ?? "";
  const url   = arena?.worldBgImageUrl ?? "";
  const fit   = arena?.worldBgFit     ?? "cover";
  if (type === "color" && color) return { backgroundColor: color };
  if (type === "image" && url) {
    const sizeMap: Record<string, string> = { cover: "cover", contain: "contain", stretch: "100% 100%" };
    return {
      backgroundImage: `url(${JSON.stringify(url)})`,
      backgroundSize: sizeMap[fit] ?? "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
}

function TeammateBar({ bey, isMe }: { bey: ServerBeyblade; isMe: boolean }) {
  const power  = bey.launchPower  ?? 0;
  const ready  = bey.launchReady  ?? false;
  const failed = bey.launchFailed ?? false;
  const typeColor  = TYPE_COLORS[bey.type] ?? "#888";
  const powerColor = power > 100 ? "#ff6b35" : power > 60 ? "#44ff88" : power > 25 ? "#ffcc44" : "#888";

  return (
    <div
      style={{
        border:     `1px solid ${isMe ? "#ff6b35" : "rgba(255,255,255,0.1)"}`,
        background: isMe ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.04)",
        opacity:    failed ? 0.4 : 1,
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg min-w-0"
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor, flexShrink: 0 }} />
      <span
        style={{ color: isMe ? "#ff6b35" : "var(--text)" }}
        className="text-[11px] font-semibold truncate max-w-[80px]"
      >
        {bey.username}{isMe ? " (you)" : ""}
      </span>

      {failed ? (
        <span className="text-[10px] text-[#ff4444] font-bold ml-auto">FAILED</span>
      ) : ready ? (
        <span className="text-[10px] text-[#44ff88] font-bold ml-auto">READY ✓</span>
      ) : (
        <>
          <div style={{ background: "rgba(255,255,255,0.1)" }} className="flex-1 h-[6px] rounded-[3px] overflow-hidden mx-1 min-w-[40px]">
            <div style={{
              height: "100%",
              width: `${Math.min(100, (power / 150) * 100)}%`,
              background: powerColor,
              borderRadius: 3,
              transition: "width 80ms linear",
            }} />
          </div>
          <span style={{ color: powerColor }} className="text-[10px] font-mono w-[32px] text-right shrink-0">
            {power.toFixed(0)}%
          </span>
        </>
      )}
    </div>
  );
}

export function LaunchPhase({
  launchTimer,
  launchTilt,
  launchPosition,
  launchPower,
  chargingStarted,
  launched,
  failed,
  isSpectating,
  myBeyId,
  beyblades,
  arena,
}: LaunchPhaseProps) {
  const prevTimerRef = useRef(launchTimer);
  const [timerFlash, setTimerFlash] = useState(false);

  useEffect(() => {
    if (launchTimer <= 2 && launchTimer > 0 && Math.floor(prevTimerRef.current) !== Math.floor(launchTimer)) {
      setTimerFlash(true);
      const t = setTimeout(() => setTimerFlash(false), 300);
      prevTimerRef.current = launchTimer;
      return () => clearTimeout(t);
    }
    prevTimerRef.current = launchTimer;
  }, [launchTimer]);

  if (launched || failed) return null;

  const powerColor = launchPower > 100 ? "#ff6b35" : launchPower > 60 ? "#44ff88" : launchPower > 25 ? "#ffcc44" : "#888888";
  const timerPct   = Math.max(0, (launchTimer / 5) * 100);
  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";

  const hasWorldBg = (arena?.worldBgType ?? "none") !== "none";
  const bgOpacity  = arena?.worldBgOpacity ?? 1;
  const bgBlur     = arena?.worldBgBlurPx  ?? 0;
  const wbStyle    = worldBgCssStyle(arena);

  // All non-AI players for the teammate strip (includes self)
  const allPlayers = beyblades ? Array.from(beyblades.values()).filter(b => !b.isAI) : [];
  const teammates  = allPlayers.filter(b => b.id !== myBeyId);
  const showStrip  = allPlayers.length > 1;

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 55 }}
      className="flex flex-col items-center justify-center pointer-events-none select-none"
    >
      {/* World background */}
      {hasWorldBg && (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            opacity: bgOpacity,
            filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
            ...wbStyle,
          }}
        />
      )}

      {/* Dark scrim */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: hasWorldBg ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.72)",
        }}
      />

      {/* Content (panel + teammate strip) */}
      <div style={{ position: "relative", zIndex: 2 }} className="flex flex-col items-center gap-3 w-full px-4 max-h-full overflow-y-auto">
        {/* Main launch panel */}
        <div
          style={{
            border: `2px solid ${chargingStarted ? "#ff6b35" : "#334155"}`,
            boxShadow: chargingStarted ? "0 0 32px rgba(255,107,53,0.4)" : "none",
            transition: "border-color 200ms, box-shadow 200ms",
          }}
          className="flex flex-col items-center gap-5 px-10 py-8 bg-[rgba(15,23,42,0.92)] rounded-[20px] min-w-[340px]"
        >
          {/* Timer bar */}
          <div className="w-full text-center">
            <div
              style={{ fontSize: timerFlash ? 36 : 28, color: timerFlash ? "#ff4444" : timerColor, transition: "font-size 150ms, color 150ms" }}
              className="font-black font-mono tracking-[0.05em]"
            >
              {Math.ceil(Math.max(0, launchTimer))}s
            </div>
            <div className="h-[6px] rounded-[3px] mt-2 overflow-hidden bg-bg3">
              <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, transition: "width 100ms linear, background 300ms" }} className="rounded-[3px]" />
            </div>
          </div>

          {/* Tilt gauge */}
          <div style={{ opacity: chargingStarted ? 0.45 : 1, transition: "opacity 200ms" }} className="w-full">
            <div className="flex justify-between text-[11px] mb-1 text-theme-muted">
              <span>← Tilt (A/D)</span>
              <span className="text-theme-text font-bold">{launchTilt > 0 ? "+" : ""}{launchTilt.toFixed(0)}°</span>
            </div>
            <div className="relative h-3 rounded-[6px] overflow-hidden bg-bg3">
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#334155", transform: "translateX(-50%)" }} />
              <div style={{
                position: "absolute", top: 2, bottom: 2, width: 8,
                background: Math.abs(launchTilt) > 30 ? "#ff4444" : "#4488ff",
                borderRadius: 4,
                left: `calc(50% + ${(launchTilt / 45) * 42}% - 4px)`,
                transition: "left 50ms, background 200ms",
              }} />
            </div>
            <div className="flex justify-between text-[10px] mt-[2px] text-theme-faint">
              <span>-45°</span><span>0°</span><span>+45°</span>
            </div>
          </div>

          {/* Position gauge */}
          <div style={{ opacity: chargingStarted ? 0.45 : 1, transition: "opacity 200ms" }} className="w-full">
            <div className="flex justify-between text-[11px] mb-1 text-theme-muted">
              <span>Position (W/S)</span>
              <span className="text-theme-text font-bold">
                {launchPosition < 0.33 ? "Forward" : launchPosition > 0.66 ? "Backward" : "Center"}
              </span>
            </div>
            <div className="relative h-3 rounded-[6px] overflow-hidden bg-bg3">
              <div style={{
                position: "absolute", top: 2, bottom: 2, width: 8,
                background: launchPosition > 0.66 ? "#ff8844" : launchPosition < 0.33 ? "#44aaff" : "#44ff88",
                borderRadius: 4,
                left: `calc(${launchPosition * 100}% - 4px)`,
                transition: "left 50ms, background 200ms",
              }} />
            </div>
            <div className="flex justify-between text-[10px] mt-[2px] text-theme-faint">
              <span className="text-[#44aaff]">Forward (W)</span>
              <span className="text-[#ff8844]">Backward (S)</span>
            </div>
          </div>

          {/* Power charge bar */}
          <div className="w-full">
            <div className="flex justify-between text-[11px] mb-1 text-theme-muted">
              <span>Launch Power</span>
              <span style={{ color: powerColor }} className="font-bold">
                {launchPower.toFixed(0)}%
                {launchPower > 100 && <span className="text-[10px] ml-1 text-[#ff6b35]">OVERDRIVE</span>}
              </span>
            </div>
            <div className="relative h-[14px] rounded-[7px] overflow-hidden bg-bg3">
              <div style={{ position: "absolute", left: `${(100 / 150) * 100}%`, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.3)", zIndex: 1 }} />
              <div style={{
                height: "100%",
                width: `${Math.min(100, (launchPower / 150) * 100)}%`,
                background: `linear-gradient(90deg, #4488ff, ${powerColor})`,
                borderRadius: 7,
                transition: "width 80ms linear, background 200ms",
                boxShadow: launchPower > 100 ? `0 0 8px ${powerColor}` : "none",
              }} />
            </div>
            <div className="flex justify-between text-[10px] mt-[2px] text-theme-faint">
              <span>0%</span><span>100%</span><span className="text-[#ff6b35]">MAX 150%</span>
            </div>
          </div>

          {/* Status / instruction */}
          {isSpectating ? (
            <div className="text-theme-muted text-[13px] text-center">Watching launch phase...</div>
          ) : chargingStarted ? (
            <div className="text-[14px] text-[#ff6b35] font-bold text-center tracking-[0.05em]">
              CHARGING — RELEASE SPACE TO LAUNCH!
            </div>
          ) : (
            <div className="text-theme-muted text-[13px] text-center leading-[1.5]">
              <div className="text-theme-text font-semibold mb-1">Set your launch</div>
              <span className="text-[#4488ff]">A / D</span> tilt &nbsp;·&nbsp;
              <span className="text-[#44ff88]">W / S</span> position<br />
              <span className="text-[#ffcc44]">Hold SPACE</span> to charge &amp; lock · Release to launch
            </div>
          )}
        </div>

        {/* Teammate / all-players launch strip */}
        {showStrip && (
          <div
            style={{ background: "rgba(15,23,42,0.85)", border: "1px solid #334155" }}
            className="rounded-[14px] px-4 py-3 min-w-[340px] max-w-[600px] w-full"
          >
            <div className="text-[10px] text-theme-faint uppercase tracking-widest mb-2">
              {isSpectating ? "All players launching" : "Other players launching"}
            </div>
            <div className="flex flex-col gap-1.5">
              {myBeyId && beyblades?.has(myBeyId) && !isSpectating && (
                <TeammateBar bey={beyblades.get(myBeyId)!} isMe={true} />
              )}
              {teammates.map(b => (
                <TeammateBar key={b.id} bey={b} isMe={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
