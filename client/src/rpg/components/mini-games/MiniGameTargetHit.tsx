/**
 * MiniGameTargetHit — Aim + charge + launch; hit N targets
 *
 * Controls:
 *  ← / →  — rotate launch angle
 *  Hold SPACE — charge power (power bar fills)
 *  Release SPACE — launch Dragoon S along trajectory arc
 *  TAP on mobile — tap canvas to aim, hold/release button for power
 *
 * The Beyblade travels a parabolic arc. If it collides with a target rect
 * the target is marked as hit, the next target becomes active.
 * Player wins when all targets are hit before the timer expires.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import type { MiniGameConfig, MiniGameResult } from "../../data/schemas";

// ── Layout constants ──────────────────────────────────────────────────────────
const CW          = 480;   // canvas width
const CH          = 280;   // canvas height
const GROUND_Y    = CH - 40;
const PLAYER_X    = 60;
const PLAYER_Y    = GROUND_Y - 18;
const GRAVITY     = 380;   // px/s²
const MAX_POWER   = 420;   // px/s (initial speed at full charge)
const CHARGE_RATE = 80;    // power units per second while holding

// ── Target layout (3 stacked cans) ────────────────────────────────────────────
interface Target {
  x: number; y: number; w: number; h: number;
  hit: boolean; label: string;
}

function buildTargets(count: number): Target[] {
  const targets: Target[] = [];
  const xBase = CW - 90;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    targets.push({
      x: xBase + col * 38 - 18,
      y: GROUND_Y - 28 - row * 34,
      w: 30, h: 28,
      hit: false,
      label: String(i + 1),
    });
  }
  return targets;
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D) {
  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  skyGrad.addColorStop(0, "#1e3a5f");
  skyGrad.addColorStop(1, "#2d6a9f");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CW, GROUND_Y);

  // Ground
  const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, CH);
  groundGrad.addColorStop(0, "#3d7a3d");
  groundGrad.addColorStop(1, "#2a552a");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);

  // Ground line
  ctx.strokeStyle = "#5a9e5a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(CW, GROUND_Y);
  ctx.stroke();

  // "Stadium" circle on ground
  ctx.strokeStyle = "#ffffff20";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(PLAYER_X + 10, GROUND_Y, 30, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlayer(ctx: CanvasRenderingContext2D, angle: number, charging: boolean, power: number) {
  ctx.save();
  ctx.translate(PLAYER_X, PLAYER_Y);

  // Body shadow
  ctx.fillStyle = "#00000040";
  ctx.beginPath();
  ctx.ellipse(0, 14, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dragoon S — spinning disc
  const t = Date.now() / 200;
  ctx.save();
  ctx.rotate(t);
  // Outer ring
  ctx.strokeStyle = charging ? "#60a5fa" : "#3b82f6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.stroke();
  // Inner
  ctx.fillStyle = charging ? "#1d4ed8" : "#1e40af";
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  // Attack wings
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2);
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(15, -4);
    ctx.lineTo(15, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Aim arrow
  const aimLength = 36 + power * 0.06;
  const radAngle = -angle * (Math.PI / 180);
  const ax = Math.cos(radAngle) * aimLength;
  const ay = Math.sin(radAngle) * aimLength;
  ctx.strokeStyle = charging ? `rgba(250,204,21,${0.6 + power / 200})` : "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrow head
  ctx.fillStyle = charging ? "#facc15" : "#ffffff80";
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(radAngle);
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(-4, -4);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawTargets(ctx: CanvasRenderingContext2D, targets: Target[], activeIdx: number) {
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    if (t.hit) {
      // Hit effect — faded
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.globalAlpha = 1;
      // Checkmark
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("✓", t.x + t.w / 2, t.y + t.h / 2 + 5);
      continue;
    }
    const isActive = i === activeIdx;
    // Can body
    const canGrad = ctx.createLinearGradient(t.x, 0, t.x + t.w, 0);
    canGrad.addColorStop(0, "#b45309");
    canGrad.addColorStop(0.4, "#d97706");
    canGrad.addColorStop(1, "#92400e");
    ctx.fillStyle = canGrad;
    ctx.fillRect(t.x, t.y + 4, t.w, t.h - 4);
    // Can top (red lid)
    ctx.fillStyle = isActive ? "#ef4444" : "#dc2626";
    ctx.fillRect(t.x + 2, t.y, t.w - 4, 7);
    // Label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(t.label, t.x + t.w / 2, t.y + t.h / 2 + 9);
    // Active pulse ring
    if (isActive) {
      const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
      ctx.strokeStyle = `rgba(250,204,21,${0.4 + pulse * 0.6})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(t.x - 3, t.y - 3, t.w + 6, t.h + 6);
    }
  }
}

function drawProjectile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  const t = Date.now() / 100;
  ctx.translate(x, y);
  ctx.rotate(t);
  // Outer
  ctx.strokeStyle = "#93c5fd";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.stroke();
  // Inner
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  // Glow trail
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#60a5fa";
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPowerBar(ctx: CanvasRenderingContext2D, power: number) {
  const bx = 14, by = CH - 32, bw = 12, bh = 110;
  // Background
  ctx.fillStyle = "#00000060";
  ctx.fillRect(bx - 2, by - bh - 2, bw + 4, bh + 4);
  // Fill
  const fillH = (power / 100) * bh;
  const fillGrad = ctx.createLinearGradient(0, by, 0, by - bh);
  fillGrad.addColorStop(0, "#22c55e");
  fillGrad.addColorStop(0.6, "#facc15");
  fillGrad.addColorStop(1, "#ef4444");
  ctx.fillStyle = fillGrad;
  ctx.fillRect(bx, by - fillH, bw, fillH);
  // Border
  ctx.strokeStyle = "#ffffff60";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by - bh, bw, bh);
  // Label
  ctx.fillStyle = "#fff";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("PWR", bx + bw / 2, by + 12);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  config: MiniGameConfig;
  onComplete: (result: MiniGameResult) => void;
}

type GamePhase = "aim" | "charge" | "flying" | "hit_pop" | "result";

export function MiniGameTargetHit({ config, onComplete }: Props) {
  const numTargets = config.targets ?? 3;
  const timeLimit  = config.timeLimit ?? 30;
  const xpReward   = config.xpReward  ?? 40;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  // Game state (refs for animation loop)
  const angleRef    = useRef(45);    // degrees above horizontal
  const powerRef    = useRef(0);     // 0-100%
  const chargingRef = useRef(false);
  const phaseRef    = useRef<GamePhase>("aim");
  const targetsRef  = useRef<Target[]>(buildTargets(numTargets));
  const activeIdxRef= useRef(0);
  const projRef     = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const hitsRef     = useRef(0);
  const startTsRef  = useRef(Date.now());
  const popMsgRef   = useRef<{ text: string; x: number; y: number; alpha: number } | null>(null);
  const timerRef    = useRef(timeLimit);

  // React state (only for re-renders that matter to the DOM outside canvas)
  const [phase, setPhase]     = useState<GamePhase>("aim");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [, forceUpdate]       = useState(0);

  // ── Launch Beyblade ────────────────────────────────────────────────────────
  const doLaunch = useCallback(() => {
    if (phaseRef.current !== "charge") return;
    const powerFrac = powerRef.current / 100;
    const speed     = powerFrac * MAX_POWER + 80; // min speed 80
    const rad       = -(angleRef.current * Math.PI / 180);
    projRef.current = {
      x: PLAYER_X,
      y: PLAYER_Y,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
    };
    phaseRef.current = "flying";
    setPhase("flying");
  }, []);

  // ── Key handlers ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft")  { e.preventDefault(); angleRef.current = Math.min(85, angleRef.current + 3); }
      if (e.code === "ArrowRight") { e.preventDefault(); angleRef.current = Math.max(5,  angleRef.current - 3); }
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (phaseRef.current === "aim") {
          phaseRef.current = "charge";
          setPhase("charge");
          chargingRef.current = true;
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === " ") && chargingRef.current) {
        e.preventDefault();
        chargingRef.current = false;
        doLaunch();
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, [doLaunch]);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;
    canvas.style.width  = CW + "px";
    canvas.style.height = CH + "px";
    ctx.scale(dpr, dpr);

    startTsRef.current = Date.now();

    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      // Update timer
      const elapsed = (Date.now() - startTsRef.current) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      timerRef.current = remaining;
      setTimeLeft(Math.ceil(remaining));

      // Timeout → result
      if (remaining <= 0 && phaseRef.current !== "result") {
        phaseRef.current = "result";
        setPhase("result");
      }

      // Charge power
      if (chargingRef.current && phaseRef.current === "charge") {
        powerRef.current = Math.min(100, powerRef.current + CHARGE_RATE * dt);
      }

      // Move projectile
      if (phaseRef.current === "flying" && projRef.current) {
        projRef.current.vy += GRAVITY * dt;
        projRef.current.x  += projRef.current.vx * dt;
        projRef.current.y  += projRef.current.vy * dt;

        // Check collision with active target
        const ai = activeIdxRef.current;
        const tg = targetsRef.current[ai];
        if (tg && !tg.hit) {
          const { x, y } = projRef.current;
          if (x >= tg.x && x <= tg.x + tg.w && y >= tg.y && y <= tg.y + tg.h) {
            // HIT!
            targetsRef.current[ai].hit = true;
            hitsRef.current++;
            popMsgRef.current = { text: "HIT!", x: tg.x + tg.w / 2, y: tg.y - 10, alpha: 1 };
            phaseRef.current = "hit_pop";
            setPhase("hit_pop");
          }
        }

        // Out of bounds
        if (projRef.current.x > CW + 20 || projRef.current.y > CH + 20) {
          popMsgRef.current = { text: "MISS!", x: CW / 2, y: CH / 2, alpha: 1 };
          phaseRef.current = "hit_pop";
          setPhase("hit_pop");
          projRef.current = null;
        }
      }

      // Fade pop message + advance
      if (phaseRef.current === "hit_pop" && popMsgRef.current) {
        popMsgRef.current.alpha -= dt * 2.5;
        popMsgRef.current.y     -= dt * 30;
        if (popMsgRef.current.alpha <= 0) {
          popMsgRef.current = null;
          projRef.current   = null;
          const nextActive  = activeIdxRef.current + (targetsRef.current[activeIdxRef.current]?.hit ? 1 : 0);
          activeIdxRef.current = nextActive;
          if (nextActive >= targetsRef.current.length) {
            // All hit!
            phaseRef.current = "result";
            setPhase("result");
          } else {
            powerRef.current  = 0;
            phaseRef.current  = "aim";
            setPhase("aim");
          }
        }
      }

      // ── Draw ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, CW, CH);
      drawBackground(ctx);
      drawTargets(ctx, targetsRef.current, activeIdxRef.current);
      if (phaseRef.current !== "result") {
        drawPlayer(ctx, angleRef.current, chargingRef.current, powerRef.current);
      }
      if (projRef.current) drawProjectile(ctx, projRef.current.x, projRef.current.y);
      if (phaseRef.current === "charge" || phaseRef.current === "aim") {
        drawPowerBar(ctx, powerRef.current);
      }

      // Pop message
      if (popMsgRef.current && popMsgRef.current.alpha > 0) {
        const pm = popMsgRef.current;
        ctx.save();
        ctx.globalAlpha = pm.alpha;
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = pm.text === "HIT!" ? "#22c55e" : "#ef4444";
        ctx.shadowColor = pm.text === "HIT!" ? "#22c55e" : "#ef4444";
        ctx.shadowBlur = 10;
        ctx.fillText(pm.text, pm.x, pm.y);
        ctx.restore();
      }

      // Timer bar across top
      if (phaseRef.current !== "result") {
        const frac = remaining / timeLimit;
        ctx.fillStyle = frac > 0.4 ? "#22c55e" : frac > 0.2 ? "#facc15" : "#ef4444";
        ctx.fillRect(0, 0, CW * frac, 4);
      }

      if (phaseRef.current !== "result") {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timeLimit]);

  // ── Result → callback ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "result") return;
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (ctx) {
      // Draw final state
      ctx.clearRect(0, 0, CW, CH);
      drawBackground(ctx);
      drawTargets(ctx, targetsRef.current, -1);
    }
    const hits      = hitsRef.current;
    const threshold = config.successThreshold ?? 1.0;
    const success   = hits / numTargets >= threshold;
    const score     = Math.round((hits / numTargets) * 100);
    const xpEarned  = success ? xpReward : Math.round(xpReward * 0.15 * (hits / numTargets));
    const timeTaken = Date.now() - startTsRef.current;
    const t = setTimeout(() => {
      onComplete({ success, score, hitsLanded: hits, xpEarned, timeTakenMs: timeTaken });
    }, 1800);
    return () => clearTimeout(t);
  }, [phase, config.successThreshold, numTargets, xpReward, onComplete]);

  const allHit = hitsRef.current >= numTargets;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Stats row */}
      <div className="flex items-center justify-between w-full px-1 text-sm">
        <span className="text-white/70">
          Targets: <strong className="text-white">{hitsRef.current}/{numTargets}</strong>
        </span>
        <span className={`font-bold tabular-nums ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-white/70"}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden border border-white/20" style={{ lineHeight: 0 }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Controls hint / result */}
      {phase === "result" ? (
        <div className="text-center">
          <div
            className="text-2xl font-black mb-1"
            style={{ color: allHit ? "#22c55e" : "#ef4444" }}
          >
            {allHit ? "ALL TARGETS HIT!" : `${hitsRef.current}/${numTargets} targets`}
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
