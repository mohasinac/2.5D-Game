// LaunchPhase — 5-second launch setup overlay shown during status="launching".
// Controls: A/D=tilt, W/S=position, Hold Space=charge+lock, Release Space=launch.
// Once Space is held, position and tilt are locked.
// Shows arena world background behind the scrim and teammate launch progress below.
//
// launcherType="string"  (default) — hold SPACE to charge, release to launch.
// launcherType="ripcord"           — oscillating gauge, press A at peak for PERFECT.

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
  /** @default "string" */
  launcherType?: "string" | "ripcord";
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
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg min-w-0 border ${failed ? "opacity-40" : ""} ${isMe ? "border-[#ff6b35] bg-[rgba(255,107,53,0.08)]" : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]"}`}
    >
      <div
        style={{ background: typeColor }}
        className="w-2 h-2 rounded-full shrink-0"
      />
      <span
        className={`text-[11px] font-semibold truncate max-w-[80px] ${isMe ? "text-[#ff6b35]" : "text-theme-text"}`}
      >
        {bey.username}{isMe ? " (you)" : ""}
      </span>

      {failed ? (
        <span className="text-[10px] text-[#ff4444] font-bold ml-auto">FAILED</span>
      ) : ready ? (
        <span className="text-[10px] text-[#44ff88] font-bold ml-auto">READY ✓</span>
      ) : (
        <>
          <div className="flex-1 h-[6px] rounded-[3px] overflow-hidden mx-1 min-w-[40px] bg-white/10">
            <div className="h-full rounded-[3px] [transition:width_80ms_linear]" style={{ width: `${Math.min(100, (power / 150) * 100)}%`, background: powerColor }} />
          </div>
          <span style={{ color: powerColor }} className="text-[10px] font-mono w-[32px] text-right shrink-0">
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
    <div
      className="absolute top-0 left-0 right-0 z-[200] overflow-hidden animate-[slideDown_0.3s_ease-out_forwards]"
      aria-hidden
    >
      {/* Red/orange base with speed lines */}
      <div className="relative w-full py-5 bg-gradient-to-r from-red-700 via-red-500 to-orange-500">
        {/* Speed lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,transparent 0%,transparent 45%,rgba(255,255,255,0.12) 46%,rgba(255,255,255,0.12) 54%,transparent 55%)",
          }}
        />
        <div className="relative flex items-center justify-center gap-3">
          <span className="lir-word text-white font-black italic text-[clamp(2rem,6vw,4rem)] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] [animation:lirWord_0.15s_ease-out_0s_both]">
            LET
          </span>
          <span className="lir-word text-white font-black italic text-[clamp(2rem,6vw,4rem)] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] [animation:lirWord_0.15s_ease-out_0.15s_both]">
            IT
          </span>
          <span className="lir-word text-white font-black italic text-[clamp(2rem,6vw,4rem)] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] [animation:lirWord_0.15s_ease-out_0.3s_both]">
            RIP!
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── String launcher UI ───────────────────────────────────────────────────────
function StringLauncherUI({
  launchPower,
  launchTimer,
  launchTilt,
  launchPosition,
  chargingStarted,
  isSpectating,
  perfectFlash,
}: {
  launchPower: number;
  launchTimer: number;
  launchTilt: number;
  launchPosition: number;
  chargingStarted: boolean;
  isSpectating: boolean;
  perfectFlash: boolean;
}) {
  const isPerfectZone = launchPower >= 95;
  const pct = Math.min(100, (launchPower / 150) * 100);

  // Beyblade slides left along the string as power charges (0% = far right, 100% = far left)
  // string spans 70% of screen; bey starts at 90% left, slides to 15% left
  const beyLeftPct = 90 - (pct / 100) * 75;

  // Power bar color: grey → yellow → green → orange → red
  const barColor =
    launchPower > 130 ? "#ff2222" :
    launchPower > 100 ? "#ff6b35" :
    launchPower >= 95  ? "#44ff88" :
    launchPower > 60   ? "#ffcc44" :
    launchPower > 25   ? "#88aaff" :
    "#555577";

  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";

  return (
    <div className="relative w-full flex flex-col items-center gap-0">
      {/* ── Perfect-zone screen flash ── */}
      {isPerfectZone && !isSpectating && (
        <div
          className={`absolute inset-0 pointer-events-none z-[10] rounded-[20px] border-4 border-[#44ff88] ${perfectFlash ? "opacity-100" : "opacity-50"} [transition:opacity_100ms]`}
          aria-hidden
        />
      )}

      {/* ── Countdown timer (top centre) ── */}
      <div className="w-full text-center mb-4">
        <div
          className="font-black font-mono tracking-[0.05em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            color: timerColor,
            textShadow: `0 0 20px ${timerColor}88`,
          }}
        >
          {Math.ceil(Math.max(0, launchTimer))}s
        </div>
        <div className="h-[4px] rounded-[2px] mt-2 overflow-hidden bg-white/10 w-full">
          <div
            className="h-full rounded-[2px] [transition:width_100ms_linear,background_300ms]"
            style={{ width: `${Math.max(0, (launchTimer / 5) * 100)}%`, background: timerColor }}
          />
        </div>
      </div>

      {/* ── String rail + sliding beyblade ── */}
      <div className="relative w-full flex items-center justify-center my-3" style={{ height: "80px" }}>
        {/* String rail — spans 70% of container width */}
        <div
          className="absolute h-[4px] bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full"
          style={{ left: "15%", right: "15%" }}
          aria-hidden
        />

        {/* Beyblade icon on the string */}
        <div
          className={`absolute flex items-center justify-center w-14 h-14 rounded-full border-2 select-none [transition:left_80ms_linear] ${isPerfectZone ? "border-[#44ff88] shadow-[0_0_20px_#44ff88]" : "border-white/60 shadow-[0_0_10px_rgba(255,255,255,0.3)]"} bg-[rgba(255,255,255,0.08)]`}
          style={{ left: `${beyLeftPct}%`, transform: "translate(-50%, -50%)", top: "50%" }}
          aria-hidden
        >
          <span
            className={`text-2xl ${chargingStarted ? "[animation:spin_0.3s_linear_infinite]" : "[animation:spin_1s_linear_infinite]"}`}
            role="img"
            aria-label="beyblade"
          >
            ⚙
          </span>
        </div>
      </div>

      {/* ── Power bar (right side, vertical) ── */}
      <div className="w-full flex items-end gap-4 mt-2">
        {/* Vertical power bar */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[10px] text-theme-faint uppercase tracking-wider">Power</span>
          <div
            className="relative w-8 rounded-[6px] overflow-hidden bg-white/10"
            style={{ height: "120px" }}
          >
            {/* 100% marker */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-white/40 z-[1]"
              style={{ bottom: `${(100 / 150) * 100}%` }}
            />
            {/* Fill — grows from bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-[6px] [transition:height_80ms_linear,background_200ms]"
              style={{
                height: `${pct}%`,
                background: `linear-gradient(0deg, ${barColor}, ${barColor}99)`,
                boxShadow: isPerfectZone ? `0 0 12px ${barColor}` : "none",
              }}
            />
            {/* Perfect zone highlight band */}
            <div
              className="absolute left-0 right-0 opacity-30"
              style={{
                bottom: `${(95 / 150) * 100}%`,
                height: `${(5 / 150) * 100}%`,
                background: "#44ff88",
              }}
            />
          </div>
          <span
            className="text-[11px] font-mono font-bold"
            style={{ color: barColor }}
          >
            {launchPower.toFixed(0)}%
          </span>
        </div>

        {/* Tilt + Position + instructions */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Tilt gauge */}
          <div className={`w-full transition-opacity duration-200 ${chargingStarted ? "opacity-45" : "opacity-100"}`}>
            <div className="flex justify-between text-[11px] mb-1 text-theme-muted">
              <span>← Tilt (A/D)</span>
              <span className="text-theme-text font-bold">{launchTilt > 0 ? "+" : ""}{launchTilt.toFixed(0)}°</span>
            </div>
            <div className="relative h-3 rounded-[6px] overflow-hidden bg-bg3">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#334155] -translate-x-1/2" />
              <div
                className={`absolute top-[2px] bottom-[2px] w-2 rounded-[4px] [transition:left_50ms,background_200ms] ${Math.abs(launchTilt) > 30 ? "bg-[#ff4444]" : "bg-[#4488ff]"}`}
                style={{ left: `calc(50% + ${(launchTilt / 45) * 42}% - 4px)` }}
              />
            </div>
          </div>

          {/* Position gauge */}
          <div className={`w-full transition-opacity duration-200 ${chargingStarted ? "opacity-45" : "opacity-100"}`}>
            <div className="flex justify-between text-[11px] mb-1 text-theme-muted">
              <span>Position (W/S)</span>
              <span className="text-theme-text font-bold">
                {launchPosition < 0.33 ? "Forward" : launchPosition > 0.66 ? "Backward" : "Center"}
              </span>
            </div>
            <div className="relative h-3 rounded-[6px] overflow-hidden bg-bg3">
              <div
                className={`absolute top-[2px] bottom-[2px] w-2 rounded-[4px] [transition:left_50ms,background_200ms] ${launchPosition > 0.66 ? "bg-[#ff8844]" : launchPosition < 0.33 ? "bg-[#44aaff]" : "bg-[#44ff88]"}`}
                style={{ left: `calc(${launchPosition * 100}% - 4px)` }}
              />
            </div>
          </div>

          {/* Status instruction */}
          {isSpectating ? (
            <div className="text-theme-muted text-[13px] text-center">Watching launch phase...</div>
          ) : chargingStarted ? (
            <div
              className={`text-[14px] font-black text-center tracking-[0.1em] ${isPerfectZone ? "text-[#44ff88] [animation:pulse_0.4s_ease-in-out_infinite]" : "text-[#ff6b35]"}`}
            >
              {isPerfectZone ? "✦ PERFECT ZONE — RELEASE!" : "CHARGING — RELEASE SPACE TO LAUNCH!"}
            </div>
          ) : (
            <div className="text-theme-muted text-[12px] text-center leading-[1.5]">
              <div className="text-theme-text font-semibold mb-1">Set your launch</div>
              <span className="text-[#4488ff]">A / D</span> tilt &nbsp;·&nbsp;
              <span className="text-[#44ff88]">W / S</span> position<br />
              <span className="text-[#ffcc44]">Hold SPACE</span> to charge &amp; lock · Release to launch
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ripcord launcher UI ──────────────────────────────────────────────────────
function RipcordLauncherUI({
  launchTimer,
  launchPower,
  isSpectating,
  ripcordPressResult,
}: {
  launchTimer: number;
  launchPower: number;
  isSpectating: boolean;
  ripcordPressResult: "perfect" | "good" | "miss" | null;
}) {
  // The oscillating fill level — driven by launchPower from server OR a local sine if spectating
  const pct = Math.min(100, Math.max(0, launchPower));
  const isPeak = pct >= 90;

  // Zone bar color: red at edges, yellow mid, green at peak
  const fillColor =
    pct >= 90 ? "#44ff88" :
    pct >= 60 ? "#ffcc44" :
    pct >= 30 ? "#ff8844" :
    "#ff4444";

  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";

  const resultColors: Record<string, string> = {
    perfect: "#44ff88",
    good:    "#ffcc44",
    miss:    "#ff4444",
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-4">
      {/* Countdown */}
      <div className="w-full text-center">
        <div
          className="font-black font-mono tracking-[0.05em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            color: timerColor,
            textShadow: `0 0 20px ${timerColor}88`,
          }}
        >
          {Math.ceil(Math.max(0, launchTimer))}s
        </div>
        <div className="h-[4px] rounded-[2px] mt-2 overflow-hidden bg-white/10 w-full">
          <div
            className="h-full rounded-[2px] [transition:width_100ms_linear,background_300ms]"
            style={{ width: `${Math.max(0, (launchTimer / 5) * 100)}%`, background: timerColor }}
          />
        </div>
      </div>

      {/* Oscillating zone bar */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="relative w-full h-[32px] rounded-full overflow-hidden bg-white/10">
          {/* Sweet spot band — center 10% */}
          <div
            className="absolute top-0 bottom-0 opacity-30 rounded-full"
            style={{
              left: "45%",
              width: "10%",
              background: "#44ff88",
            }}
            aria-hidden
          />
          {/* Oscillating fill */}
          <div
            className="absolute top-0 left-0 bottom-0 rounded-full [transition:width_60ms_linear,background_100ms]"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #ff444444, ${fillColor})`,
              boxShadow: isPeak ? `0 0 16px ${fillColor}` : "none",
            }}
          />
          {/* Peak marker line */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-[#44ff88]/70 z-[2]"
            style={{ left: "90%" }}
            aria-hidden
          />
          {/* Current indicator needle */}
          <div
            className="absolute top-1 bottom-1 w-[4px] bg-white rounded-full z-[3] [transition:left_60ms_linear]"
            style={{ left: `calc(${pct}% - 2px)` }}
            aria-hidden
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between w-full text-[10px] text-theme-faint px-1">
          <span>LOW</span>
          <span className="text-[#44ff88]">◀ SWEET SPOT ▶</span>
          <span>PEAK</span>
        </div>
      </div>

      {/* Press result overlay */}
      {ripcordPressResult && (
        <div
          className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-[0.2em] [animation:scaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          style={{ color: resultColors[ripcordPressResult] ?? "#fff" }}
        >
          {ripcordPressResult === "perfect" && "✦ PERFECT!"}
          {ripcordPressResult === "good"    && "GOOD!"}
          {ripcordPressResult === "miss"    && "MISS!"}
        </div>
      )}

      {/* Prompt */}
      {!ripcordPressResult && !isSpectating && (
        <div
          className={`text-[15px] font-black tracking-[0.15em] ${isPeak ? "text-[#44ff88] [animation:pulse_0.3s_ease-in-out_infinite]" : "text-theme-muted"}`}
        >
          {isPeak ? "▶ PRESS A NOW! ◀" : "PRESS A AT PEAK!"}
        </div>
      )}
      {isSpectating && (
        <div className="text-theme-muted text-[13px]">Watching ripcord launch...</div>
      )}
    </div>
  );
}

// ─── Perfect launch announcement ──────────────────────────────────────────────
function PerfectBadge() {
  return (
    <div className="flex flex-col items-center gap-1 mt-3">
      <div
        className="text-[clamp(1rem,3vw,1.5rem)] font-black tracking-[0.25em] [animation:scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        style={{ color: "#ffd700", textShadow: "0 0 20px #ffd700aa" }}
      >
        BOOST 100% ✦ PERFECT
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function LaunchPhase({
  launchTimer,
  launchTilt,
  launchPosition,
  launchPower,
  chargingStarted,
  launched,
  failed,
  isSpectating = false,
  myBeyId,
  beyblades,
  arena,
  launcherType = "string",
}: LaunchPhaseProps) {
  const prevTimerRef = useRef(launchTimer);
  const [timerFlash, setTimerFlash] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  // Ripcord-specific: freeze result when A is pressed
  const [ripcordPressResult, setRipcordPressResult] = useState<"perfect" | "good" | "miss" | null>(null);
  // Flashing flag for perfect zone
  const [perfectFlash, setPerfectFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer flash on tick
  useEffect(() => {
    if (launchTimer <= 2 && launchTimer > 0 && Math.floor(prevTimerRef.current) !== Math.floor(launchTimer)) {
      setTimerFlash(true);
      const t = setTimeout(() => setTimerFlash(false), 300);
      prevTimerRef.current = launchTimer;
      return () => clearTimeout(t);
    }
    prevTimerRef.current = launchTimer;
  }, [launchTimer]);

  // "LET IT RIP" banner on launch
  useEffect(() => {
    if (launched) {
      setShowBanner(true);
    }
  }, [launched]);

  // Perfect zone flash effect (string launcher)
  useEffect(() => {
    if (launcherType === "string" && launchPower >= 95 && !isSpectating) {
      if (!flashTimerRef.current) {
        flashTimerRef.current = setInterval(() => {
          setPerfectFlash(f => !f);
        }, 150);
      }
    } else {
      if (flashTimerRef.current) {
        clearInterval(flashTimerRef.current);
        flashTimerRef.current = null;
      }
      setPerfectFlash(false);
    }
    return () => {
      if (flashTimerRef.current) {
        clearInterval(flashTimerRef.current);
        flashTimerRef.current = null;
      }
    };
  }, [launchPower, launcherType, isSpectating]);

  // Detect ripcord key press (A key) — only active in ripcord mode and not spectating
  useEffect(() => {
    if (launcherType !== "ripcord" || isSpectating || ripcordPressResult) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "KeyA" && e.key !== "a" && e.key !== "A") return;
      const pct = Math.min(100, Math.max(0, launchPower));
      const result: "perfect" | "good" | "miss" =
        pct >= 90 ? "perfect" :
        pct >= 60 ? "good" :
        "miss";
      setRipcordPressResult(result);
      if (result === "perfect") setShowPerfect(true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [launcherType, isSpectating, ripcordPressResult, launchPower]);

  // Show perfect badge when launched at high power (string launcher)
  useEffect(() => {
    if (launched && launchPower >= 95 && launcherType === "string") {
      setShowPerfect(true);
    }
  }, [launched, launchPower, launcherType]);

  // Keep showing the banner+perfect even after launched (parent may unmount us shortly)
  if (failed && !launched) return null;

  const hasWorldBg = (arena?.worldBgType ?? "none") !== "none";
  const bgOpacity  = arena?.worldBgOpacity ?? 1;
  const bgBlur     = arena?.worldBgBlurPx  ?? 0;
  const wbStyle    = worldBgCssStyle(arena);

  const allPlayers = beyblades ? Array.from(beyblades.values()).filter(b => !b.isAI) : [];
  const teammates  = allPlayers.filter(b => b.id !== myBeyId);
  const showStrip  = allPlayers.length > 1;

  // Screen-flash border color for timerFlash
  const timerColor = launchTimer <= 2 ? "#ff4444" : launchTimer <= 3 ? "#ffcc44" : "#4488ff";
  void timerColor; // used via timerFlash
  void timerFlash;

  return (
    <div
      className="absolute inset-0 z-[55] flex flex-col items-center justify-center pointer-events-none select-none"
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
        className={`absolute inset-0 z-[1] ${hasWorldBg ? "bg-[rgba(0,0,0,0.55)]" : "bg-[rgba(0,0,0,0.72)]"}`}
      />

      {/* "LET IT RIP" banner — slides in from top on launch */}
      {showBanner && <LetItRipBanner />}

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center gap-3 w-full px-4 max-h-full overflow-y-auto">

        {/* Main launch panel */}
        <div
          className={`flex flex-col items-center gap-4 px-8 py-7 bg-[rgba(15,23,42,0.92)] rounded-[20px] w-full max-w-[460px] border-2 [transition:border-color_200ms,box-shadow_200ms] ${chargingStarted ? "border-[#ff6b35] shadow-[0_0_32px_rgba(255,107,53,0.4)]" : "border-[#334155]"}`}
        >
          {launcherType === "string" ? (
            <StringLauncherUI
              launchPower={launchPower}
              launchTimer={launchTimer}
              launchTilt={launchTilt}
              launchPosition={launchPosition}
              chargingStarted={chargingStarted}
              isSpectating={isSpectating}
              perfectFlash={perfectFlash}
            />
          ) : (
            <RipcordLauncherUI
              launchTimer={launchTimer}
              launchPower={launchPower}
              isSpectating={isSpectating}
              ripcordPressResult={ripcordPressResult}
            />
          )}

          {/* Perfect badge */}
          {showPerfect && <PerfectBadge />}
        </div>

        {/* Teammate / all-players launch strip */}
        {showStrip && (
          <div
            className="rounded-[14px] px-4 py-3 w-full max-w-[460px] bg-[rgba(15,23,42,0.85)] border border-border-c"
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
