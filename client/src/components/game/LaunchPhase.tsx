// LaunchPhase — 5-second launch setup overlay shown during status="launching".
// Controls: A/D=tilt, W/S=position, Hold Space=charge+lock, Release Space=launch.
// Once Space is held, position and tilt are locked.

import { useEffect, useRef, useState } from "react";
import { C } from "@/styles/theme";

interface LaunchPhaseProps {
  launchTimer: number;         // seconds remaining (from gameState.launchTimer)
  launchTilt: number;          // my bey's current tilt (-45 to +45)
  launchPosition: number;      // my bey's current position (0=forward, 1=backward)
  launchPower: number;         // 0-150
  chargingStarted: boolean;    // Space held → locked
  launched: boolean;           // launch complete
  failed: boolean;             // timer ran out without launch
  isSpectating?: boolean;
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
}: LaunchPhaseProps) {
  const prevTimerRef = useRef(launchTimer);
  const [timerFlash, setTimerFlash] = useState(false);

  // Flash timer when <= 2s remaining
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

  const powerColor = launchPower > 100
    ? "#ff6b35"   // orange-red for above 100%
    : launchPower > 60
      ? "#44ff88" // green for good charge
      : launchPower > 25
        ? "#ffcc44" // yellow for mid charge
        : "#888888"; // grey for low

  const timerPct = Math.max(0, (launchTimer / 5) * 100);
  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        zIndex: 55,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "32px 40px",
        background: "rgba(15,23,42,0.92)",
        border: `2px solid ${chargingStarted ? "#ff6b35" : C.border}`,
        borderRadius: 20,
        minWidth: 340,
        boxShadow: chargingStarted ? "0 0 32px rgba(255,107,53,0.4)" : "none",
        transition: "border-color 200ms, box-shadow 200ms",
      }}>

        {/* Timer bar */}
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{
            fontSize: timerFlash ? 36 : 28,
            fontWeight: 900,
            color: timerFlash ? "#ff4444" : timerColor,
            fontFamily: "monospace",
            letterSpacing: "0.05em",
            transition: "font-size 150ms, color 150ms",
          }}>
            {Math.ceil(Math.max(0, launchTimer))}s
          </div>
          <div style={{ height: 6, background: C.bg3, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${timerPct}%`,
              background: timerColor,
              borderRadius: 3,
              transition: "width 100ms linear, background 300ms",
            }} />
          </div>
        </div>

        {/* Tilt gauge */}
        <div style={{ width: "100%", opacity: chargingStarted ? 0.45 : 1, transition: "opacity 200ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
            <span>← Tilt (A/D)</span>
            <span style={{ color: C.text, fontWeight: 700 }}>{launchTilt > 0 ? "+" : ""}{launchTilt.toFixed(0)}°</span>
          </div>
          <div style={{ position: "relative", height: 12, background: C.bg3, borderRadius: 6, overflow: "hidden" }}>
            {/* Center marker */}
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: C.border, transform: "translateX(-50%)" }} />
            {/* Tilt indicator */}
            <div style={{
              position: "absolute",
              top: 2,
              bottom: 2,
              width: 8,
              background: Math.abs(launchTilt) > 30 ? "#ff4444" : "#4488ff",
              borderRadius: 4,
              left: `calc(50% + ${(launchTilt / 45) * 42}% - 4px)`,
              transition: "left 50ms, background 200ms",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginTop: 2 }}>
            <span>-45°</span><span>0°</span><span>+45°</span>
          </div>
        </div>

        {/* Position gauge */}
        <div style={{ width: "100%", opacity: chargingStarted ? 0.45 : 1, transition: "opacity 200ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
            <span>Position (W/S)</span>
            <span style={{ color: C.text, fontWeight: 700 }}>
              {launchPosition < 0.33 ? "Forward" : launchPosition > 0.66 ? "Backward" : "Center"}
            </span>
          </div>
          <div style={{ position: "relative", height: 12, background: C.bg3, borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              position: "absolute",
              top: 2,
              bottom: 2,
              width: 8,
              background: launchPosition > 0.66 ? "#ff8844" : launchPosition < 0.33 ? "#44aaff" : "#44ff88",
              borderRadius: 4,
              left: `calc(${launchPosition * 100}% - 4px)`,
              transition: "left 50ms, background 200ms",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginTop: 2 }}>
            <span style={{ color: "#44aaff" }}>Forward (W)</span>
            <span style={{ color: "#ff8844" }}>Backward (S)</span>
          </div>
        </div>

        {/* Power charge bar */}
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
            <span>Launch Power</span>
            <span style={{ color: powerColor, fontWeight: 700 }}>
              {launchPower.toFixed(0)}%
              {launchPower > 100 && <span style={{ fontSize: 10, marginLeft: 4, color: "#ff6b35" }}>OVERDRIVE</span>}
            </span>
          </div>
          <div style={{ position: "relative", height: 14, background: C.bg3, borderRadius: 7, overflow: "hidden" }}>
            {/* 100% marker */}
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginTop: 2 }}>
            <span>0%</span><span>100%</span><span style={{ color: "#ff6b35" }}>MAX 150%</span>
          </div>
        </div>

        {/* Status / instruction */}
        {isSpectating ? (
          <div style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Watching launch phase...</div>
        ) : chargingStarted ? (
          <div style={{ fontSize: 14, color: "#ff6b35", fontWeight: 700, textAlign: "center", letterSpacing: "0.05em" }}>
            CHARGING — RELEASE SPACE TO LAUNCH!
          </div>
        ) : (
          <div style={{ fontSize: 13, color: C.muted, textAlign: "center", lineHeight: 1.5 }}>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 4 }}>Set your launch</div>
            <span style={{ color: "#4488ff" }}>A / D</span> tilt &nbsp;·&nbsp;
            <span style={{ color: "#44ff88" }}>W / S</span> position<br />
            <span style={{ color: "#ffcc44" }}>Hold SPACE</span> to charge &amp; lock · Release to launch
          </div>
        )}
      </div>
    </div>
  );
}
