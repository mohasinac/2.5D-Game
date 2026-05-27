/**
 * MiniGamePlatformBlock — Sequential aim + launch to hit objects in order
 *
 * Used for the puppy-rescue waterfall scene and similar "hit a switch /
 * block a hazard" moments.
 *
 * Each stage shows an object (log/switch/block) that the player must hit
 * with a launched Beyblade.  On hit, a brief animation plays (log swings,
 * switch lights up, etc.) and the next stage is revealed.
 *
 * All N stages must succeed within the time limit.
 * Controls: identical to MiniGameTargetHit (← → aim, SPACE charge/launch).
 */

import { useEffect, useRef, useCallback, useState } from "react";
import type { MiniGameConfig, MiniGameResult } from "../../data/schemas";

// ── Canvas dimensions ─────────────────────────────────────────────────────────
const CW       = 480;
const CH       = 300;
const GROUND_Y = CH - 30;
const PLAYER_X = 55;
const PLAYER_Y = GROUND_Y - 18;
const GRAVITY  = 350;
const MAX_PWR  = 440;
const CHARGE_R = 85;

// ── Per-stage object config ───────────────────────────────────────────────────
interface StageObject {
  x: number; y: number; w: number; h: number;
  label: string;
  /** visual state: normal | swinging | blocked */
  state: "normal" | "swinging" | "blocked";
  swingAngle: number;  // for log swing animation
}

function buildStages(count: number): StageObject[] {
  // Logs stack above the waterfall (right side of canvas)
  const logs: StageObject[] = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      x: CW - 95 + i * 4,          // stagger slightly
      y: GROUND_Y - 50 - i * 55,   // stacked upward
      w: 65, h: 16,
      label: `Log ${i + 1}`,
      state: "normal",
      swingAngle: 0,
    });
  }
  return logs;
}

// ── Drawing ───────────────────────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D, stages: StageObject[], stageIdx: number) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, "#0f2942");
  sky.addColorStop(1, "#1e4d7a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CW, GROUND_Y);

  // Ground
  ctx.fillStyle = "#2d5a1b";
  ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);

  // River (flowing water on right side)
  const riverX = CW - 110;
  const waterGrad = ctx.createLinearGradient(riverX, 0, riverX + 40, 0);
  waterGrad.addColorStop(0, "#1d4ed8");
  waterGrad.addColorStop(0.5, "#3b82f6");
  waterGrad.addColorStop(1, "#1d4ed8");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(riverX, 0, 40, CH);

  // Waterfall animation (ripples)
  const t = Date.now() / 300;
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = "#93c5fd";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const wy = ((t * 40 + i * 60) % CH);
    ctx.beginPath();
    ctx.moveTo(riverX + 5, wy);
    ctx.lineTo(riverX + 10, wy + 8);
    ctx.lineTo(riverX + 15, wy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Blocked waterfall sections (where logs have swung)
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].state !== "normal") {
      const blockY = stages[i].y;
      ctx.fillStyle = "#60a5fa30";
      ctx.fillRect(riverX, blockY, 40, stages[i].h + 4);
    }
  }

  // Puppy at river (shows at bottom, jumps for joy when all logs blocked)
  const allBlocked = stages.every((s) => s.state !== "normal");
  ctx.font = allBlocked ? "26px serif" : "20px serif";
  ctx.textAlign = "center";
  const puppyY = allBlocked
    ? GROUND_Y - 12 - Math.abs(Math.sin(Date.now() / 200)) * 10
    : GROUND_Y - 8;
  ctx.fillText("🐕", riverX + 20, puppyY);

  // Draw logs
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    ctx.save();
    ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
    if (s.state === "swinging") {
      ctx.rotate(s.swingAngle * (Math.PI / 180));
    } else if (s.state === "blocked") {
      ctx.rotate(-Math.PI / 2 + 0.2); // log swung 90° to block waterfall
    }

    // Log gradient
    const logGrad = ctx.createLinearGradient(-s.w / 2, 0, s.w / 2, 0);
    logGrad.addColorStop(0, "#78350f");
    logGrad.addColorStop(0.5, "#b45309");
    logGrad.addColorStop(1, "#78350f");
    ctx.fillStyle = s.state === "normal" ? logGrad : (s.state === "blocked" ? "#92400e" : "#d97706");
    ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);

    // Grain lines
    ctx.strokeStyle = "#78350f60";
    ctx.lineWidth = 1;
    for (let g = -s.w / 2 + 8; g < s.w / 2; g += 12) {
      ctx.beginPath();
      ctx.moveTo(g, -s.h / 2 + 2);
      ctx.lineTo(g, s.h / 2 - 2);
      ctx.stroke();
    }

    // Active highlight
    if (i === stageIdx && s.state === "normal") {
      ctx.strokeStyle = `rgba(250,204,21,${0.5 + Math.sin(Date.now() / 200) * 0.4})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(-s.w / 2 - 3, -s.h / 2 - 3, s.w + 6, s.h + 6);
    }
    // Blocked tick
    if (s.state === "blocked") {
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("✓", 0, 5);
    }
    ctx.restore();
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, angle: number, charging: boolean, power: number) {
  ctx.save();
  ctx.translate(PLAYER_X, PLAYER_Y);
  // Spinning disc
  const t = Date.now() / 180;
  ctx.save();
  ctx.rotate(t);
  ctx.strokeStyle = charging ? "#60a5fa" : "#3b82f6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#1e40af";
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2);
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(9, 0); ctx.lineTo(14, -3); ctx.lineTo(14, 3);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Aim line
  const aimLen = 34 + power * 0.055;
  const rad    = -(angle * Math.PI / 180);
  const ax     = Math.cos(rad) * aimLen;
  const ay     = Math.sin(rad) * aimLen;
  ctx.strokeStyle = charging ? "#facc1580" : "#ffffff40";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Date.now() / 90);
  ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#2563eb";
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#60a5fa";
  ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawPowerBar(ctx: CanvasRenderingContext2D, power: number) {
  const bx = 12, by = CH - 28, bw = 11, bh = 100;
  ctx.fillStyle = "#00000060"; ctx.fillRect(bx - 2, by - bh - 2, bw + 4, bh + 4);
  const fh = (power / 100) * bh;
  const g = ctx.createLinearGradient(0, by, 0, by - bh);
  g.addColorStop(0, "#22c55e"); g.addColorStop(0.6, "#facc15"); g.addColorStop(1, "#ef4444");
  ctx.fillStyle = g; ctx.fillRect(bx, by - fh, bw, fh);
  ctx.strokeStyle = "#ffffff50"; ctx.lineWidth = 1; ctx.strokeRect(bx, by - bh, bw, bh);
  ctx.fillStyle = "#fff"; ctx.font = "8px monospace"; ctx.textAlign = "center";
  ctx.fillText("PWR", bx + bw / 2, by + 10);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  config: MiniGameConfig;
  onComplete: (result: MiniGameResult) => void;
}

type GamePhase = "aim" | "charge" | "flying" | "hit_anim" | "result";

export function MiniGamePlatformBlock({ config, onComplete }: Props) {
  const numStages = config.stages   ?? 3;
  const timeLimit = config.timeLimit ?? 30;
  const xpReward  = config.xpReward  ?? 50;

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const lastTsRef    = useRef<number>(0);

  const stagesRef    = useRef<StageObject[]>(buildStages(numStages));
  const stageIdxRef  = useRef(0);
  const angleRef     = useRef(55);
  const powerRef     = useRef(0);
  const chargingRef  = useRef(false);
  const phaseRef     = useRef<GamePhase>("aim");
  const projRef      = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const hitsRef      = useRef(0);
  const startTsRef   = useRef(Date.now());
  const hitAnimRef   = useRef(0);  // countdown for hit animation
  const popRef       = useRef<{ text: string; x: number; y: number; alpha: number } | null>(null);

  const [phase,    setPhase]    = useState<GamePhase>("aim");
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // ── Launch ────────────────────────────────────────────────────────────────
  const doLaunch = useCallback(() => {
    if (phaseRef.current !== "charge") return;
    const pf = powerRef.current / 100;
    const sp = pf * MAX_PWR + 80;
    const rd = -(angleRef.current * Math.PI / 180);
    projRef.current = { x: PLAYER_X, y: PLAYER_Y, vx: Math.cos(rd) * sp, vy: Math.sin(rd) * sp };
    phaseRef.current = "flying";
    setPhase("flying");
  }, []);

  // ── Keys ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (["aim","charge"].includes(phaseRef.current)) {
        if (e.code === "ArrowLeft")  { e.preventDefault(); angleRef.current = Math.min(88, angleRef.current + 3); }
        if (e.code === "ArrowRight") { e.preventDefault(); angleRef.current = Math.max(10, angleRef.current - 3); }
        if ((e.code === "Space" || e.key === " ") && phaseRef.current === "aim") {
          e.preventDefault(); phaseRef.current = "charge"; setPhase("charge"); chargingRef.current = true;
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === " ") && chargingRef.current) {
        e.preventDefault(); chargingRef.current = false; doLaunch();
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [doLaunch]);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CW * dpr; canvas.height = CH * dpr;
    canvas.style.width = CW + "px"; canvas.style.height = CH + "px";
    ctx.scale(dpr, dpr);
    startTsRef.current = Date.now();

    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      const elapsed   = (Date.now() - startTsRef.current) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0 && phaseRef.current !== "result") {
        phaseRef.current = "result"; setPhase("result");
      }

      if (chargingRef.current && phaseRef.current === "charge") {
        powerRef.current = Math.min(100, powerRef.current + CHARGE_R * dt);
      }

      // Move projectile
      if (phaseRef.current === "flying" && projRef.current) {
        projRef.current.vy += GRAVITY * dt;
        projRef.current.x  += projRef.current.vx * dt;
        projRef.current.y  += projRef.current.vy * dt;

        const si = stageIdxRef.current;
        const st = stagesRef.current[si];
        if (st && st.state === "normal") {
          const { x, y } = projRef.current;
          if (x >= st.x && x <= st.x + st.w && y >= st.y && y <= st.y + st.h) {
            // HIT!
            stagesRef.current[si].state = "swinging";
            hitsRef.current++;
            hitAnimRef.current = 0.6; // 0.6s swing animation
            popRef.current = { text: "HIT!", x: st.x + st.w / 2, y: st.y - 15, alpha: 1 };
            phaseRef.current = "hit_anim";
            setPhase("hit_anim");
          }
        }
        if (projRef.current && (projRef.current.x > CW + 20 || projRef.current.y > CH + 20)) {
          popRef.current = { text: "MISS", x: CW / 2, y: CH / 3, alpha: 1 };
          phaseRef.current = "hit_anim";
          setPhase("hit_anim");
          projRef.current = null;
        }
      }

      // Hit animation
      if (phaseRef.current === "hit_anim") {
        hitAnimRef.current = Math.max(0, hitAnimRef.current - dt);
        const si = stageIdxRef.current;
        if (stagesRef.current[si]?.state === "swinging") {
          // Swing angle from 0 → -90 deg
          stagesRef.current[si].swingAngle = -(1 - hitAnimRef.current / 0.6) * 90;
        }
        if (popRef.current) { popRef.current.alpha -= dt * 2; popRef.current.y -= dt * 25; }
        if (hitAnimRef.current <= 0) {
          if (stagesRef.current[si]?.state === "swinging") {
            stagesRef.current[si].state = "blocked";
          }
          popRef.current   = null;
          projRef.current  = null;
          const nextSI     = stageIdxRef.current + (stagesRef.current[si]?.state === "blocked" ? 1 : 0);
          stageIdxRef.current = nextSI;
          if (nextSI >= stagesRef.current.length) {
            phaseRef.current = "result"; setPhase("result");
          } else {
            powerRef.current = 0; phaseRef.current = "aim"; setPhase("aim");
          }
        }
      }

      // Draw
      ctx.clearRect(0, 0, CW, CH);
      drawBg(ctx, stagesRef.current, stageIdxRef.current);
      if (phaseRef.current !== "result") drawPlayer(ctx, angleRef.current, chargingRef.current, powerRef.current);
      if (projRef.current) drawProjectile(ctx, projRef.current.x, projRef.current.y);
      if (["aim","charge"].includes(phaseRef.current)) drawPowerBar(ctx, powerRef.current);

      if (popRef.current && popRef.current.alpha > 0) {
        ctx.save(); ctx.globalAlpha = popRef.current.alpha;
        ctx.font = "bold 20px monospace"; ctx.textAlign = "center";
        ctx.fillStyle = popRef.current.text === "HIT!" ? "#22c55e" : "#ef4444";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
        ctx.fillText(popRef.current.text, popRef.current.x, popRef.current.y);
        ctx.restore();
      }

      // Stage indicators at top
      const dotGap = 28;
      const dotsX  = CW / 2 - (numStages * dotGap) / 2;
      stagesRef.current.forEach((s, i) => {
        const dx = dotsX + i * dotGap + 10;
        ctx.fillStyle = s.state === "blocked" ? "#22c55e"
          : s.state === "swinging" ? "#facc15"
          : (i === stageIdxRef.current ? "#ffffff" : "#ffffff40");
        ctx.beginPath();
        ctx.arc(dx, 18, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Timer bar
      if (phaseRef.current !== "result") {
        const frac = remaining / timeLimit;
        ctx.fillStyle = frac > 0.4 ? "#22c55e" : frac > 0.2 ? "#facc15" : "#ef4444";
        ctx.fillRect(0, 0, CW * frac, 3);
      }

      if (phaseRef.current !== "result") rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timeLimit, numStages]);

  // ── Result callback ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "result") return;
    const hits      = hitsRef.current;
    const threshold = config.successThreshold ?? 1.0;
    const success   = hits / numStages >= threshold;
    const score     = Math.round((hits / numStages) * 100);
    const xpEarned  = success ? xpReward : Math.round(xpReward * 0.1 * hits);
    const timeTaken = Date.now() - startTsRef.current;
    const t = setTimeout(() => {
      onComplete({ success, score, hitsLanded: hits, xpEarned, timeTakenMs: timeTaken });
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, config.successThreshold, numStages, xpReward, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex items-center justify-between w-full px-1 text-sm">
        <span className="text-white/70">
          Logs blocked: <strong className="text-white">{hitsRef.current}/{numStages}</strong>
        </span>
        <span className={`font-bold tabular-nums ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-white/70"}`}>
          ⏱ {timeLeft}s
        </span>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/20" style={{ lineHeight: 0 }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
      {phase === "result" ? (
        <div className="text-center">
          <div className="text-2xl font-black mb-1" style={{ color: hitsRef.current >= numStages ? "#22c55e" : "#ef4444" }}>
            {hitsRef.current >= numStages ? "PUPPY SAVED! 🐕" : `${hitsRef.current}/${numStages} logs blocked`}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 text-xs text-white/50">
          <span>← → Aim</span>
          <span>Hold SPACE: Charge</span>
          <span>Release: Launch</span>
        </div>
      )}
    </div>
  );
}
