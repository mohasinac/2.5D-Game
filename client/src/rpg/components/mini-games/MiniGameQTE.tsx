/**
 * MiniGameQTE — Quick Time Event mini-game
 *
 * The player presses SPACE (or taps) when the moving needle lands inside the
 * green "perfect" zone.  Each beat in the sequence can have a different zone
 * width and needle speed, ramping up the challenge.
 *
 * Config options (MiniGameConfig):
 *  sequence          — array of beat labels, e.g. ["SPACE","SPACE","SPACE"]
 *  perfectZoneWidth  — green zone width as fraction of bar (default 0.25)
 *  timeLimit         — seconds per beat (default 3)
 *  xpReward          — XP on full success
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { MiniGameConfig, MiniGameResult } from "../../data/schemas";

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = "intro" | "countdown" | "active" | "hit_feedback" | "result";
type HitGrade = "perfect" | "good" | "miss";

interface BeatResult {
  grade: HitGrade;
  pos: number; // needle position 0-1 when pressed
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BAR_W          = 400;
const BAR_H          = 52;
const NEEDLE_SPEED   = 0.6;  // fraction of bar per second (base speed)
const SPEED_RAMP     = 0.08; // added per beat
const GOOD_MULT      = 1.8;  // good zone = perfect * this
const BEAT_ANIM_MS   = 500;  // "HIT!" / "MISS" display time

function getGrade(pos: number, zoneW: number): HitGrade {
  const dist = Math.abs(pos - 0.5); // 0 = perfect centre
  if (dist <= zoneW / 2)             return "perfect";
  if (dist <= (zoneW * GOOD_MULT) / 2) return "good";
  return "miss";
}

const GRADE_COLOR: Record<HitGrade, string> = {
  perfect: "#22c55e",
  good:    "#facc15",
  miss:    "#ef4444",
};

const GRADE_LABEL: Record<HitGrade, string> = {
  perfect: "PERFECT!",
  good:    "GOOD!",
  miss:    "MISS!",
};

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  config: MiniGameConfig;
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameQTE({ config, onComplete }: Props) {
  const sequence    = config.sequence       ?? ["SPACE", "SPACE", "SPACE"];
  const zoneW       = config.perfectZoneWidth ?? 0.25;
  const xpReward    = config.xpReward        ?? 30;
  const timeLimit   = config.timeLimit        ?? 3;

  const [phase,       setPhase]      = useState<Phase>("intro");
  const [countdown,   setCountdown]  = useState(3);
  const [beatIndex,   setBeatIndex]  = useState(0);
  const [needlePos,   setNeedlePos]  = useState(0);     // 0–1
  const [beatResults, setBeatResults]= useState<BeatResult[]>([]);
  const [feedbackGrade, setFeedbackGrade] = useState<HitGrade | null>(null);

  const dirRef      = useRef(1);   // needle direction: +1 right, -1 left
  const needleRef   = useRef(0);
  const rafRef      = useRef<number>(0);
  const lastTsRef   = useRef<number>(0);
  const beatIdxRef  = useRef(0);
  const resultsRef  = useRef<BeatResult[]>([]);
  const phaseRef    = useRef<Phase>("intro");
  const pressedRef  = useRef(false);

  const speed = NEEDLE_SPEED + beatIndex * SPEED_RAMP;

  // ── Press handler ─────────────────────────────────────────────────────────
  const handlePress = useCallback(() => {
    if (phaseRef.current !== "active" || pressedRef.current) return;
    pressedRef.current = true;
    const pos   = needleRef.current;
    const grade = getGrade(pos, zoneW);
    const result: BeatResult = { grade, pos };
    resultsRef.current = [...resultsRef.current, result];
    setBeatResults([...resultsRef.current]);
    setFeedbackGrade(grade);
    phaseRef.current = "hit_feedback";
    setPhase("hit_feedback");
  }, [zoneW]);

  // ── Keyboard listener ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePress();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePress]);

  // ── Intro phase ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "intro") return;
    const t = setTimeout(() => {
      setPhase("countdown");
      phaseRef.current = "countdown";
    }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Countdown phase ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("active");
      phaseRef.current = "active";
      pressedRef.current = false;
      lastTsRef.current = 0;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 900);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // ── Needle animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    const spd = NEEDLE_SPEED + beatIdxRef.current * SPEED_RAMP;
    const tick = (ts: number) => {
      if (phaseRef.current !== "active") return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      needleRef.current += spd * dirRef.current * dt;
      if (needleRef.current >= 1) { needleRef.current = 1; dirRef.current = -1; }
      if (needleRef.current <= 0) { needleRef.current = 0; dirRef.current =  1; }
      setNeedlePos(needleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // Time limit per beat — auto-miss if player doesn't press in time
  useEffect(() => {
    if (phase !== "active") return;
    const t = setTimeout(() => {
      if (phaseRef.current !== "active") return;
      handlePress(); // force a "miss" at current position — player was too slow
    }, timeLimit * 1000);
    return () => clearTimeout(t);
  }, [phase, beatIndex, timeLimit, handlePress]);

  // ── Hit feedback → advance to next beat ──────────────────────────────────
  useEffect(() => {
    if (phase !== "hit_feedback") return;
    const t = setTimeout(() => {
      const nextBeat = beatIdxRef.current + 1;
      if (nextBeat >= sequence.length) {
        // All beats done — compute result
        phaseRef.current = "result";
        setPhase("result");
      } else {
        beatIdxRef.current = nextBeat;
        setBeatIndex(nextBeat);
        setFeedbackGrade(null);
        pressedRef.current = false;
        phaseRef.current = "active";
        setPhase("active");
        lastTsRef.current = 0;
      }
    }, BEAT_ANIM_MS);
    return () => clearTimeout(t);
  }, [phase, sequence.length]);

  // ── Result calculation ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "result") return;
    const results = resultsRef.current;
    const hits    = results.filter((r) => r.grade !== "miss").length;
    const perfects= results.filter((r) => r.grade === "perfect").length;
    const threshold = config.successThreshold ?? 1.0;
    const successFrac = hits / sequence.length;
    const success     = successFrac >= threshold;
    const score       = Math.round((perfects / sequence.length) * 70 + (hits / sequence.length) * 30);
    const xpEarned    = success ? Math.round(xpReward * (score / 100)) : Math.round(xpReward * 0.2);
    const t = setTimeout(() => {
      onComplete({ success, score, hitsLanded: hits, xpEarned, timeTakenMs: 0 });
    }, 1800);
    return () => clearTimeout(t);
  }, [phase, config.successThreshold, sequence.length, xpReward, onComplete]);

  // ── Zone colours on the bar ───────────────────────────────────────────────
  const goodW    = zoneW * GOOD_MULT;
  const centre   = 0.5;
  // Red zones on outside, yellow closer, green at centre
  const barGradient = `linear-gradient(to right,
    #ef4444 0%,
    #ef4444 ${(centre - goodW / 2) * 100}%,
    #facc15 ${(centre - goodW / 2) * 100}%,
    #facc15 ${(centre - zoneW / 2) * 100}%,
    #22c55e ${(centre - zoneW / 2) * 100}%,
    #22c55e ${(centre + zoneW / 2) * 100}%,
    #facc15 ${(centre + zoneW / 2) * 100}%,
    #facc15 ${(centre + goodW / 2) * 100}%,
    #ef4444 ${(centre + goodW / 2) * 100}%,
    #ef4444 100%
  )`;

  const results = resultsRef.current;
  const allDone = phase === "result";
  const perfectCount = results.filter((r) => r.grade === "perfect").length;
  const goodCount    = results.filter((r) => r.grade === "good").length;
  const missCount    = results.filter((r) => r.grade === "miss").length;
  const hitsCount    = perfectCount + goodCount;

  return (
    <div className="flex flex-col items-center gap-5 select-none" style={{ width: BAR_W + 40 }}>

      {/* Beat indicator dots */}
      <div className="flex gap-3">
        {sequence.map((_, i) => {
          const done   = i < results.length;
          const grade  = done ? results[i].grade : null;
          const active = i === beatIndex && phase !== "result";
          return (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 transition-all duration-150"
              style={{
                borderColor: done ? GRADE_COLOR[grade!] : active ? "#fff" : "#555",
                background:  done ? GRADE_COLOR[grade!] : active ? "#ffffff33" : "transparent",
                transform:   active ? "scale(1.3)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {/* Phase display */}
      {phase === "intro" && (
        <div className="text-white text-lg font-bold animate-pulse">
          {config.description ?? "Press at the right moment!"}
        </div>
      )}

      {phase === "countdown" && (
        <div
          className="text-white font-black"
          style={{ fontSize: 72, lineHeight: 1, textShadow: "0 0 20px #fff" }}
        >
          {countdown > 0 ? countdown : "GO!"}
        </div>
      )}

      {(phase === "active" || phase === "hit_feedback") && (
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Zone bar */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: BAR_W, height: BAR_H, background: barGradient }}
          >
            {/* Needle */}
            <div
              className="absolute top-0 bottom-0 w-[3px] rounded-full"
              style={{
                left: `${needlePos * 100}%`,
                transform: "translateX(-50%)",
                background: "#fff",
                boxShadow: "0 0 8px #fff, 0 0 16px #fff",
                transition: "none",
              }}
            />
            {/* Centre marker */}
            <div
              className="absolute top-1 bottom-1 w-[2px] opacity-50"
              style={{ left: "50%", transform: "translateX(-50%)", background: "#fff" }}
            />
          </div>

          {/* Feedback popup */}
          {feedbackGrade && (
            <div
              className="text-3xl font-black tracking-wider animate-bounce"
              style={{ color: GRADE_COLOR[feedbackGrade], textShadow: `0 0 12px ${GRADE_COLOR[feedbackGrade]}` }}
            >
              {GRADE_LABEL[feedbackGrade]}
            </div>
          )}

          {/* Button prompt */}
          {!feedbackGrade && (
            <div className="flex items-center gap-3 mt-1">
              <kbd className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white font-bold text-sm tracking-widest">
                {sequence[beatIndex] ?? "SPACE"}
              </kbd>
              <span className="text-white/60 text-sm">press now!</span>
            </div>
          )}
        </div>
      )}

      {/* Final result */}
      {allDone && (
        <div className="flex flex-col items-center gap-3">
          <div
            className="text-4xl font-black"
            style={{ color: hitsCount >= Math.ceil(sequence.length * (config.successThreshold ?? 1)) ? "#22c55e" : "#ef4444" }}
          >
            {hitsCount >= Math.ceil(sequence.length * (config.successThreshold ?? 1)) ? "SUCCESS!" : "TRY AGAIN"}
          </div>
          <div className="flex gap-5 text-sm">
            <span className="text-green-400">{perfectCount} Perfect</span>
            <span className="text-yellow-400">{goodCount} Good</span>
            <span className="text-red-400">{missCount} Miss</span>
          </div>
        </div>
      )}
    </div>
  );
}
