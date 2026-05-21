// Tryout mode — completely server-free.
// Physics runs locally in the browser; beyblade + arena data is loaded from
// Firestore directly. No Colyseus connection is opened.

import { useRef, useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import type { ServerBeyblade, ServerGameState } from "@/types/game";
import { C } from "@/styles/theme";
import { CameraControls } from "@/components/game/CameraControls";
import { ControlsLegend } from "@/components/game/ControlsLegend";

// ─── Physics constants ────────────────────────────────────────────────────────

const FRICTION    = 0.97;   // velocity multiplier per frame (~60fps)
const MOVE_ACCEL  = 5.0;    // px applied per frame when key held
const MAX_SPEED   = 350;    // px/s hard cap
const BASE_SPIN_DECAY = 7;  // RPM-equivalent units/s (slow for tryout enjoyment)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDefaultBeyblade(id: string, username: string): ServerBeyblade {
  return {
    id, userId: id, username,
    x: 540, y: 540, rotation: 0,
    velocityX: 0, velocityY: 0, angularVelocity: 15,
    health: 100, maxHealth: 100,
    stamina: 1000, maxStamina: 1000,
    spin: 2000, maxSpin: 2000,
    isActive: true, isAI: false,
    type: "balanced",
    radius: 5, actualSize: 120,
    isInvulnerable: false,
    damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: "right",
    power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TryoutGamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
  const { settings, isHydrated } = useGame();

  // Physics state — all in refs to avoid React re-render on each frame
  const bey = useRef<ServerBeyblade>(makeDefaultBeyblade(
    settings.userId ?? "local",
    settings.username ?? "Player"
  ));
  const arenaRadius = useRef(486); // default for 1080px arena
  const arenaConfig = useRef<ServerGameState["arena"] | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const timerRef = useRef(0);     // elapsed seconds
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // HUD state — updated at lower frequency
  const [hud, setHud] = useState({ spin: 2000, maxSpin: 2000, health: 100, timer: 0, loaded: false });

  const { render, setControlledBeyblade, cameraZoomIn, cameraZoomOut, cameraZoomReset } = usePixiRenderer(containerRef, mode);

  // Local tryout has exactly one bey — follow it.
  useEffect(() => {
    setControlledBeyblade(bey.current.id);
  }, [setControlledBeyblade]);

  // ─── Load data from Firestore ───────────────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;

    async function load() {
      const beybladeId = settings.beybladeId ?? "default";
      const arenaId = settings.arenaId ?? "default";

      // Load beyblade stats
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, beybladeId));
        if (snap.exists()) {
          const d = snap.data() as any;
          const radiusCm = d.radius ?? 5;
          const radiusPx = radiusCm * 24;
          const stamina = d.stamina ?? 100;
          const maxSpin = 2000 * (1 + stamina * 0.0008);
          bey.current = {
            ...bey.current,
            type: d.type ?? "balanced",
            radius: radiusCm,
            actualSize: radiusPx * 2,
            maxSpin,
            spin: maxSpin,
          };
        }
      } catch { /* use defaults */ }

      // Load arena config
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ARENAS, arenaId));
        if (snap.exists()) {
          const d = snap.data() as any;
          const w = d.width ?? 1080;
          const h = d.height ?? 1080;
          arenaRadius.current = Math.min(w, h) * 0.45;
          arenaConfig.current = {
            id: arenaId,
            name: d.name ?? "Arena",
            width: w,
            height: h,
            shape: d.shape ?? "circle",
            theme: d.theme ?? "default",
          };
          // Place beyblade at center of loaded arena
          bey.current.x = w / 2;
          bey.current.y = h / 2;
        }
      } catch { /* use defaults */ }

      setHud((h) => ({
        ...h,
        spin: bey.current.spin,
        maxSpin: bey.current.maxSpin,
        loaded: true,
      }));
    }

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // ─── Keyboard listeners ─────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const up   = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup",   up);
    };
  }, []);

  // ─── Physics + render loop ──────────────────────────────────────────────────
  useEffect(() => {
    let hudTick = 0;

    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05); // cap at 50ms
      lastTsRef.current = ts;
      timerRef.current += dt;

      const b = bey.current;
      const keys = keysRef.current;
      const ar = arenaRadius.current;
      const cx = arenaConfig.current ? arenaConfig.current.width / 2 : 540;
      const cy = arenaConfig.current ? arenaConfig.current.height / 2 : 540;

      // Input → acceleration
      let ax = 0, ay = 0;
      if (keys.has("KeyA") || keys.has("ArrowLeft"))  ax -= MOVE_ACCEL;
      if (keys.has("KeyD") || keys.has("ArrowRight")) ax += MOVE_ACCEL;
      if (keys.has("KeyW") || keys.has("ArrowUp"))    ay -= MOVE_ACCEL;
      if (keys.has("KeyS") || keys.has("ArrowDown"))  ay += MOVE_ACCEL;

      // Spin boost with Space
      if (keys.has("Space") && b.spin < b.maxSpin) {
        b.spin = Math.min(b.maxSpin, b.spin + 20 * dt);
      }

      // Velocity update
      b.velocityX = (b.velocityX + ax) * FRICTION;
      b.velocityY = (b.velocityY + ay) * FRICTION;

      // Speed cap
      const spd = Math.sqrt(b.velocityX ** 2 + b.velocityY ** 2);
      if (spd > MAX_SPEED * dt) {
        const scale = (MAX_SPEED * dt) / spd;
        b.velocityX *= scale;
        b.velocityY *= scale;
      }

      // Position update
      b.x += b.velocityX;
      b.y += b.velocityY;

      // Arena boundary — bounce off edge
      const dx = b.x - cx, dy = b.y - cy;
      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      const radiusPx = b.radius * 24;
      if (dist + radiusPx > ar) {
        const nx = dx / dist, ny = dy / dist;
        b.x = cx + nx * (ar - radiusPx - 1);
        b.y = cy + ny * (ar - radiusPx - 1);
        // Reflect velocity
        const dot = b.velocityX * nx + b.velocityY * ny;
        b.velocityX -= 2 * dot * nx * 0.6;
        b.velocityY -= 2 * dot * ny * 0.6;
      }

      // Spin decay (faster near edge = nutation effect)
      const stability = b.spin / b.maxSpin;
      const decayRate = BASE_SPIN_DECAY * (1 + (1 - stability) * 2);
      b.spin = Math.max(0, b.spin - decayRate * dt);

      // Rotation
      const angDir = b.spinDirection === "left" ? -1 : 1;
      b.rotation += angDir * (b.spin / b.maxSpin) * 6 * dt;
      b.angularVelocity = angDir * (b.spin / b.maxSpin) * 15;

      // Feed to renderer — scale positions to server physics space (width * 16 units)
      const scaledBey = { ...b, x: b.x * 16, y: b.y * 16 };
      const beyMap = new Map<string, ServerBeyblade>([[b.id, scaledBey]]);
      const gs: ServerGameState = {
        status: b.spin > 0 ? "in-progress" : "finished",
        mode: "tryout",
        timer: timerRef.current,
        startTime: 0,
        winner: b.spin <= 0 ? b.userId : "",
        matchId: "local",
        arena: arenaConfig.current,
        beyblades: beyMap,
        targetWins: 1, currentGame: 1,
        seriesWins: new Map(), seriesLeader: "",
        spectatorCount: 0,
      } as ServerGameState;

      render(gs, beyMap);

      // HUD update every ~200ms
      hudTick++;
      if (hudTick % 12 === 0) {
        setHud((prev) => ({
          ...prev,
          spin: b.spin,
          maxSpin: b.maxSpin,
          health: b.health,
          timer: timerRef.current,
        }));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [render]);

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    const b = bey.current;
    const cx = arenaConfig.current ? arenaConfig.current.width / 2 : 540;
    const cy = arenaConfig.current ? arenaConfig.current.height / 2 : 540;
    b.x = cx; b.y = cy;
    b.velocityX = 0; b.velocityY = 0;
    b.spin = b.maxSpin;
    b.health = b.maxHealth;
    b.rotation = 0;
    timerRef.current = 0;
    lastTsRef.current = null;
    setHud((h) => ({ ...h, spin: b.maxSpin, health: b.maxHealth, timer: 0 }));
  }, []);

  // ─── Derived HUD values ───────────────────────────────────────────────────────
  const spinPct = hud.maxSpin > 0 ? hud.spin / hud.maxSpin : 0;
  const stability = spinPct;
  const stabilityColor = stability > 0.6 ? C.green : stability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = stability > 0.6 ? "Stable" : stability > 0.3 ? "Wobbling" : "Critical!";
  const spinOut = hud.spin <= 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#000", overflow: "hidden" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* HUD top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 16, pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: hud.loaded ? C.green : C.yellow }} className={hud.loaded ? "pulse" : ""} />
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>
            {hud.loaded ? "LOCAL" : "loading..."}
          </span>
        </div>

        <div style={{ color: C.text, fontFamily: "monospace", fontSize: 24, fontWeight: 700 }}>
          {Math.floor(hud.timer)}s
        </div>

        <Link
          to="/game"
          style={{ pointerEvents: "auto", padding: "4px 12px", fontSize: 12, background: "rgba(0,0,0,0.6)", color: C.muted, borderRadius: 6, border: `1px solid ${C.border}`, textDecoration: "none" }}
        >
          Exit
        </Link>
      </div>

      {/* Camera zoom controls — top-right under Exit */}
      <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      {/* Controls legend — bottom-left, dismissable */}
      <ControlsLegend />

      {/* HUD bottom — beyblade stats */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, pointerEvents: "none" }}>
        <div style={{ maxWidth: 320, margin: "0 auto", background: "rgba(15,23,42,0.85)", borderRadius: 12, border: `1px solid ${C.border}`, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 8 }}>
            <span style={{ fontFamily: "monospace" }}>{settings.username ?? "Player"}</span>
            <span style={{ textTransform: "capitalize", color: `#${(TYPE_COLORS[bey.current.type] ?? 0xffffff).toString(16).padStart(6, "0")}` }}>
              {bey.current.type}
            </span>
          </div>

          {/* Spin bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: C.blue }}>Spin</span>
              <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round(spinPct * 100)}%</span>
            </div>
            <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", background: C.blue, borderRadius: 3, transition: "width 200ms", width: `${spinPct * 100}%` }} />
            </div>
          </div>

          <div style={{ fontSize: 11, textAlign: "center", fontFamily: "monospace", color: stabilityColor }}>{stabilityLabel}</div>
        </div>
      </div>

      {/* Spin-out overlay */}
      {spinOut && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.80)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🌀</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 8 }}>Spin Out!</h2>
            <p style={{ color: C.muted, marginBottom: 24 }}>
              Survived {Math.floor(hud.timer)}s
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{ padding: "12px 24px", background: C.blue, color: C.white, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" }}
              >
                Try Again
              </button>
              <Link to="/game" style={{ padding: "12px 24px", background: C.bg3, color: C.text, borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
