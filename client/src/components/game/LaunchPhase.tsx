// LaunchPhase — mobile-first launch setup overlay during status="launching".
// String launcher: PowerArc charge meter, TiltPositionDragger, big hold-to-charge button.
// Ripcord launcher: oscillating bar, tap at peak (unchanged mechanics).
// Touch: TiltPositionDragger (2D drag) + hold button → sends input bitmask.
// Keyboard (desktop): A/D tilt · W/S position · SPACE charge (existing hook).

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ServerBeyblade, ServerArenaState } from "@/types/game";
import { LAUNCH_DURATION_S } from "@/shared/constants/gameConstants";
import { PowerArc } from "./PowerArc";
import { TiltPositionDragger } from "./TiltPositionDragger";

const CHARGE_BIT = 0x100;

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
  /** @default "string" */
  launcherType?: "string" | "ripcord";
  /**
   * Optional touch input callback. When provided the mobile touch controls are
   * active (TiltPositionDragger + hold button). Called with a bitmask; parent
   * forwards to Colyseus sendInput. When absent only keyboard controls work.
   */
  onSendInput?: (mask: number) => void;
}

const TYPE_COLORS: Record<string, string> = {
  attack: "#ff4444",
  defense: "#4488ff",
  stamina: "#44ff88",
  balanced: "#ffcc44",
};

function worldBgStyle(arena?: ServerArenaState | null): CSSProperties {
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

// ─── Teammate row ─────────────────────────────────────────────────────────────
function TeammateBar({ bey, isMe }: { bey: ServerBeyblade; isMe: boolean }) {
  const power  = bey.launchPower  ?? 0;
  const ready  = bey.launchReady  ?? false;
  const failed = bey.launchFailed ?? false;
  const typeColor  = TYPE_COLORS[bey.type] ?? "#888";
  const powerColor = power > 100 ? "#ff6b35" : power > 60 ? "#44ff88" : power > 25 ? "#ffcc44" : "#888";

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${failed ? "opacity-40" : ""} ${isMe ? "border-[#ff6b35] bg-[rgba(255,107,53,0.08)]" : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]"}`}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: typeColor }} />
      <span className={`text-[11px] font-semibold truncate max-w-[80px] ${isMe ? "text-[#ff6b35]" : "text-theme-text"}`}>
        {bey.username}{isMe ? " (you)" : ""}
      </span>
      {failed ? (
        <span className="text-[10px] text-[#ff4444] font-bold ml-auto">FAILED</span>
      ) : ready ? (
        <span className="text-[10px] text-[#44ff88] font-bold ml-auto">READY ✓</span>
      ) : (
        <>
          <div className="flex-1 h-[6px] rounded-[3px] overflow-hidden mx-1 min-w-[40px] bg-white/10">
            <div className="h-full rounded-[3px] transition-[width_80ms_linear]" style={{ width: `${Math.min(100, (power / 150) * 100)}%`, background: powerColor }} />
          </div>
          <span className="text-[10px] font-mono w-[32px] text-right shrink-0" style={{ color: powerColor }}>
            {power.toFixed(0)}%
          </span>
        </>
      )}
    </div>
  );
}

// ─── "LET IT RIP" banner ─────────────────────────────────────────────────────
function LetItRipBanner() {
  return (
    <div className="absolute top-0 left-0 right-0 z-[200] overflow-hidden [animation:slideDown_0.3s_ease-out_forwards]" aria-hidden>
      <div className="relative w-full py-5 bg-gradient-to-r from-red-700 via-red-500 to-orange-500">
        <div className="absolute inset-0 pointer-events-none opacity-60 [background-image:repeating-linear-gradient(90deg,transparent_0%,transparent_45%,rgba(255,255,255,0.12)_46%,rgba(255,255,255,0.12)_54%,transparent_55%)]" />
        <div className="relative flex items-center justify-center gap-3">
          {["LET", "IT", "RIP!"].map((w, i) => (
            <span key={w} className="text-white font-black italic text-[clamp(1rem,3vw,1.8rem)] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              style={{ animation: `lirWord 0.15s ease-out ${i * 0.15}s both` }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Ripcord launcher (unchanged mechanics) ───────────────────────────────────
function RipcordLauncherUI({ launchTimer, launchPower, launchTilt, launchPosition, chargingStarted, isSpectating, pressResult }: {
  launchTimer: number; launchPower: number; launchTilt: number; launchPosition: number;
  chargingStarted: boolean; isSpectating: boolean; pressResult: "perfect"|"good"|"miss"|null;
}) {
  const pct = Math.min(100, Math.max(0, (launchPower / 150) * 100));
  const isPeak = launchPower >= 130;
  const fillColor = launchPower >= 130 ? "#44ff88" : launchPower >= 90 ? "#ffcc44" : launchPower >= 45 ? "#ff8844" : "#ff4444";
  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 4 ? "#ffcc44" : "#4488ff";
  const resultColor = pressResult ? ({ perfect: "#44ff88", good: "#ffcc44", miss: "#ff4444" }[pressResult]) : "#fff";

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Timer */}
      <div className="w-full">
        <div className="font-black font-mono text-center" style={{ color: timerColor, fontSize: "clamp(1.5rem,4vw,2.2rem)", textShadow: `0 0 16px ${timerColor}88` }}>
          {Math.ceil(Math.max(0, launchTimer))}s
        </div>
        <div className="h-[4px] rounded mt-1 overflow-hidden bg-white/10">
          <div className="h-full rounded transition-[width_100ms_linear]" style={{ width: `${Math.max(0,(launchTimer/LAUNCH_DURATION_S)*100)}%`, background: timerColor }} />
        </div>
      </div>
      {/* Oscillating bar */}
      <div className="w-full">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">Ripcord Power</span>
        <div className="relative w-full h-9 rounded-full overflow-hidden mt-1 bg-white/10">
          <div className="absolute top-0 bottom-0 opacity-25 rounded-r-full bg-[#44ff88]" style={{ left: "86%", right: 0 }} />
          <div className="absolute top-0 left-0 bottom-0 rounded-full transition-[width_50ms_linear]" style={{ width: `${pct}%`, background: `linear-gradient(90deg,#ff444444,${fillColor})`, boxShadow: isPeak ? `0 0 16px ${fillColor}` : "none" }} />
          <div className="absolute top-1 bottom-1 w-1 bg-[#44ff88]/70 z-[2]" style={{ left: "86%" }} />
          <div className="absolute top-1 bottom-1 w-1 bg-white rounded-full z-[3] transition-[left_50ms_linear]" style={{ left: `calc(${pct}% - 2px)` }} />
        </div>
      </div>
      {/* Tilt + Position */}
      <div className={`grid grid-cols-2 gap-2 w-full transition-opacity ${chargingStarted ? "opacity-40" : "opacity-100"}`}>
        {[
          { label: "Tilt (A/D)", val: `${launchTilt > 0 ? "+" : ""}${launchTilt.toFixed(0)}°`, pct: 50 + (launchTilt/45)*45, color: Math.abs(launchTilt) > 30 ? "#ff4444" : "#4488ff" },
          { label: "Pos (W/S)", val: launchPosition < 0.33 ? "Fwd" : launchPosition > 0.66 ? "Back" : "Ctr", pct: launchPosition * 100, color: launchPosition > 0.66 ? "#ff8844" : launchPosition < 0.33 ? "#44aaff" : "#44ff88" },
        ].map(g => (
          <div key={g.label}>
            <div className="flex justify-between text-[10px] text-white/40 mb-1">
              <span>{g.label}</span><span className="font-mono text-white/70">{g.val}</span>
            </div>
            <div className="relative h-2 rounded overflow-hidden bg-bg3">
              {g.label.startsWith("Tilt") && <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15 -translate-x-1/2" />}
              <div className="absolute top-0.5 bottom-0.5 w-2.5 rounded transition-[left_50ms]" style={{ left: `calc(${g.pct}% - 5px)`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>
      {pressResult ? (
        <div className="text-[clamp(1.5rem,4vw,2.2rem)] font-black tracking-[0.2em] [animation:scaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ color: resultColor }}>
          {pressResult === "perfect" ? "PERFECT!" : pressResult === "good" ? "GOOD!" : "MISS!"}
        </div>
      ) : !isSpectating && (
        <div className={`text-[13px] font-bold text-center ${isPeak ? "text-[#44ff88] [animation:pulse_0.3s_ease-in-out_infinite]" : "text-[#ffcc44]"}`}>
          {isPeak ? "PRESS SPACE NOW!" : "PRESS SPACE AT PEAK!"}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function LaunchPhase({
  launchTimer, launchTilt, launchPosition, launchPower,
  chargingStarted, launched, failed,
  isSpectating = false, myBeyId, beyblades, arena,
  launcherType = "string",
  onSendInput,
}: LaunchPhaseProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  const [ripcordPressResult, setRipcordPressResult] = useState<"perfect"|"good"|"miss"|null>(null);

  // Touch input state
  const maskRef = useRef(0);
  const sendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPowerRef = useRef(0);
  const touchActive = useRef(false);

  const updateMask = useCallback((newMask: number) => {
    maskRef.current = newMask;
    onSendInput?.(newMask);
    if (newMask !== 0 && !sendIntervalRef.current) {
      sendIntervalRef.current = setInterval(() => {
        if (maskRef.current !== 0) onSendInput?.(maskRef.current);
      }, 50);
    } else if (newMask === 0 && sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
  }, [onSendInput]);

  const handleDragMask = useCallback((dragBits: number) => {
    updateMask((maskRef.current & CHARGE_BIT) | (chargingStarted ? 0 : dragBits));
  }, [updateMask, chargingStarted]);

  const handleChargeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    touchActive.current = true;
    updateMask(maskRef.current | CHARGE_BIT);
    navigator.vibrate?.(20);
  }, [updateMask]);

  const handleChargeEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    touchActive.current = false;
    updateMask(maskRef.current & ~CHARGE_BIT);
  }, [updateMask]);

  // Haptic feedback on power milestones
  useEffect(() => {
    if (!onSendInput) return;
    const pct = (launchPower / 150) * 100;
    const prevPct = (prevPowerRef.current / 150) * 100;
    if (Math.floor(pct / 10) > Math.floor(prevPct / 10) && pct > 10) {
      navigator.vibrate?.(10);
    }
    if (prevPct < 85 && pct >= 85) {
      navigator.vibrate?.([30, 10, 30]);
    }
    prevPowerRef.current = launchPower;
  }, [launchPower, onSendInput]);

  useEffect(() => { if (launched) setShowBanner(true); }, [launched]);

  useEffect(() => {
    if (!launched || isSpectating) return;
    if (launcherType === "ripcord" && !ripcordPressResult) {
      const r = launchPower >= 130 ? "perfect" : launchPower >= 90 ? "good" : "miss";
      setRipcordPressResult(r);
      if (r === "perfect") setShowPerfect(true);
    }
    if (launcherType === "string" && launchPower >= 95) setShowPerfect(true);
  }, [launched, launchPower, launcherType, isSpectating, ripcordPressResult]);

  useEffect(() => () => {
    if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
  }, []);

  if (failed && !launched) return null;

  const hasWorldBg = (arena?.worldBgType ?? "none") !== "none";
  const wbStyle = worldBgStyle(arena);
  const allPlayers = beyblades ? Array.from(beyblades.values()).filter(b => !b.isAI) : [];
  const teammates = allPlayers.filter(b => b.id !== myBeyId);
  const showStrip = allPlayers.length > 1;
  const isTouchMode = !!onSendInput;

  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";
  const timerPct = Math.max(0, (launchTimer / LAUNCH_DURATION_S) * 100);

  return (
    <div
      data-testid="launch-phase-overlay"
      className="absolute inset-0 z-[80] flex flex-col items-center justify-center select-none"
      style={{ pointerEvents: isTouchMode ? "auto" : "none" }}
    >
      {/* World background */}
      {hasWorldBg && (
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: arena?.worldBgOpacity ?? 1, filter: (arena?.worldBgBlurPx ?? 0) > 0 ? `blur(${arena?.worldBgBlurPx}px)` : undefined, ...wbStyle }} />
      )}

      {/* Dark scrim */}
      <div aria-hidden className={`absolute inset-0 z-[1] pointer-events-none ${hasWorldBg ? "bg-black/55" : "bg-black/72"}`} />

      {showBanner && <LetItRipBanner />}

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center gap-3 w-full px-4 max-h-full overflow-y-auto pointer-events-none">

        {/* Main panel */}
        <div className={`flex flex-col items-center gap-3 px-6 py-5 rounded-[20px] w-full max-w-[420px] pointer-events-auto border-2 transition-[border-color,box-shadow] duration-200 ${chargingStarted ? "border-[#ff6b35] shadow-[0_0_28px_rgba(255,107,53,0.4)]" : "border-white/10"}`}
          style={{ background: "rgba(10,15,30,0.92)" }}>

          {/* Timer bar */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">LAUNCH TIMER</span>
              <span className="text-[14px] font-black font-mono" style={{ color: timerColor }}>{Math.ceil(Math.max(0,launchTimer))}s</span>
            </div>
            <div className="h-1.5 rounded overflow-hidden bg-white/10">
              <div className="h-full rounded transition-[width_100ms_linear,background_300ms]"
                style={{ width: `${timerPct}%`, background: timerColor }} />
            </div>
          </div>

          {launcherType === "string" ? (
            <>
              {/* Tilt + Position dragger (mobile touch mode) */}
              {isTouchMode && !isSpectating && (
                <TiltPositionDragger
                  tilt={launchTilt}
                  position={launchPosition}
                  locked={chargingStarted}
                  onMaskChange={handleDragMask}
                />
              )}

              {/* Desktop tilt/position gauges (keyboard mode) */}
              {!isTouchMode && !isSpectating && (
                <div className={`grid grid-cols-2 gap-3 w-full transition-opacity ${chargingStarted ? "opacity-40" : "opacity-100"}`}>
                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>Tilt <span className="text-[#4488ff]">A/D</span></span>
                      <span className="font-mono text-white/70">{launchTilt > 0 ? "+" : ""}{launchTilt.toFixed(0)}°</span>
                    </div>
                    <div className="relative h-2 rounded overflow-hidden bg-bg3">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15 -translate-x-1/2" />
                      <div className="absolute top-0.5 bottom-0.5 w-2.5 rounded transition-[left_50ms]"
                        style={{ left: `calc(${50 + (launchTilt/45)*45}% - 5px)`, background: Math.abs(launchTilt) > 30 ? "#ff4444" : "#4488ff" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>Pos <span className="text-[#44ff88]">W/S</span></span>
                      <span className="font-mono text-white/70">{launchPosition < 0.33 ? "Fwd" : launchPosition > 0.66 ? "Back" : "Ctr"}</span>
                    </div>
                    <div className="relative h-2 rounded overflow-hidden bg-bg3">
                      <div className="absolute top-0.5 bottom-0.5 w-2.5 rounded transition-[left_50ms]"
                        style={{ left: `calc(${launchPosition * 100}% - 5px)`, background: launchPosition > 0.66 ? "#ff8844" : launchPosition < 0.33 ? "#44aaff" : "#44ff88" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* PowerArc */}
              <div className="flex flex-col items-center gap-2">
                <PowerArc power={launchPower} size={110} strokeWidth={10} />
                {showPerfect && (
                  <div className="text-[clamp(0.9rem,2.5vw,1.3rem)] font-black tracking-[0.25em] text-[#ffd700] [animation:scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    style={{ textShadow: "0 0 20px #ffd700aa" }}>
                    BOOST 100% ✦ PERFECT
                  </div>
                )}
              </div>

              {/* Charge button (touch mode) */}
              {isTouchMode && !isSpectating && !launched && (
                <button
                  className="w-full rounded-xl font-black text-[15px] uppercase tracking-[0.1em] transition-all duration-100 active:scale-[0.97] touch-none"
                  style={{
                    height: 56,
                    background: chargingStarted
                      ? "linear-gradient(135deg,#ff6b35,#ff3333)"
                      : "linear-gradient(135deg,#1e3a5f,#2563eb)",
                    border: `2px solid ${chargingStarted ? "#ff6b35" : "#3b82f6"}`,
                    boxShadow: chargingStarted ? "0 0 20px rgba(255,107,53,0.5)" : "0 0 12px rgba(59,130,246,0.3)",
                    color: "#fff",
                    pointerEvents: "auto",
                  }}
                  onPointerDown={handleChargeStart}
                  onPointerUp={handleChargeEnd}
                  onPointerCancel={handleChargeEnd}
                  onPointerLeave={handleChargeEnd}
                >
                  {chargingStarted ? "RELEASE TO LAUNCH ↑" : "HOLD TO CHARGE ↓"}
                </button>
              )}

              {/* Desktop charge hint */}
              {!isTouchMode && !isSpectating && (
                <div className={`text-[14px] font-bold text-center ${chargingStarted && launchPower >= 95 ? "text-[#44ff88] [animation:pulse_0.4s_ease-in-out_infinite]" : chargingStarted ? "text-[#ff6b35]" : "text-white/60"}`}>
                  {chargingStarted
                    ? (launchPower >= 95 ? "✦ PERFECT — RELEASE SPACE!" : "CHARGING... RELEASE SPACE TO LAUNCH")
                    : "HOLD SPACE to charge · Release to launch"}
                </div>
              )}

              {isSpectating && (
                <span className="text-white/40 text-[13px]">Watching launch phase...</span>
              )}
            </>
          ) : (
            <RipcordLauncherUI
              launchTimer={launchTimer}
              launchPower={launchPower}
              launchTilt={launchTilt}
              launchPosition={launchPosition}
              chargingStarted={chargingStarted}
              isSpectating={isSpectating}
              pressResult={ripcordPressResult}
            />
          )}
        </div>

        {/* Teammate / all-players strip */}
        {showStrip && (
          <div className="rounded-[14px] px-4 py-3 w-full max-w-[420px] border border-border-c pointer-events-auto"
            style={{ background: "rgba(15,23,42,0.85)" }}>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">
              {isSpectating ? "All players launching" : "Other players launching"}
            </div>
            <div className="flex flex-col gap-1.5">
              {myBeyId && beyblades?.has(myBeyId) && !isSpectating && (
                <TeammateBar bey={beyblades.get(myBeyId)!} isMe />
              )}
              {teammates.map(b => <TeammateBar key={b.id} bey={b} isMe={false} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown  { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes lirWord    { from { opacity:0; transform:scale(0.7) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes scaleUp    { from { opacity:0; transform:scale(0.4); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}
