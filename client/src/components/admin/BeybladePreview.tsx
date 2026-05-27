// BeybladePreview — admin preview using the game's PixiJS renderer (PreviewAdapter).
// Replaces the previous standalone PIXI.Application approach so both the admin preview
// and in-game view share a single rendering code path (BeybladeGameRenderer).
//
// Animation: a setInterval fires at ~30fps and advances the rotation on the synthetic
// ServerBeyblade, causing PreviewAdapter to call render() on each tick.
//
// clickMode: a transparent overlay div captures pointer events; the click x/y relative
// to the center of the canvas gives the angle used for contact-point placement.

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import { PreviewAdapter } from "@/game/renderer/PreviewAdapter";
import type { BeybladeStats } from "@/types/beybladeStats";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

const PREVIEW_ARENA_PX = 1080;
const PHYSICS_SCALE    = 16;
const CENTER_PHYS      = (PREVIEW_ARENA_PX / 2) * PHYSICS_SCALE; // 8640

function buildPreviewState(
  bey: BeybladeStats,
  rotation: number,
): { state: ServerGameState; beyblades: Map<string, ServerBeyblade> } {
  // BeybladeType: "attack" | "defense" | "stamina" | "balanced" — all valid for ServerBeyblade.
  const beyType: ServerBeyblade["type"] = bey.type as ServerBeyblade["type"];

  const serverBey: ServerBeyblade = {
    id: "preview", userId: "preview",
    username: bey.displayName ?? "Preview",
    x: CENTER_PHYS, y: CENTER_PHYS, rotation,
    velocityX: 0, velocityY: 0, angularVelocity: 12,
    health: 1000, maxHealth: 1000,
    stamina: 1000, maxStamina: 1000,
    spin: 2000, maxSpin: 2000,
    isActive: true, isAI: false,
    type: beyType,
    radius: bey.radius ?? 5, actualSize: 120,
    isInvulnerable: false,
    damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: bey.spinDirection ?? "right",
    imageUrl: bey.imageUrl,
    power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
  };

  const beyblades = new Map<string, ServerBeyblade>([["preview", serverBey]]);

  const state: ServerGameState = {
    matchId: "preview", mode: "tryout", status: "in-progress",
    currentGame: 1, targetWins: 1, timer: 0, startTime: 0,
    winner: "", seriesLeader: "", spectatorCount: 0,
    arena: {
      id: "preview-arena", name: "Preview Arena",
      width: PREVIEW_ARENA_PX, height: PREVIEW_ARENA_PX,
      shape: "circle", theme: "metrocity",
      rotation: 0, wallEnabled: false, wallAngle: 0,
      worldBgType: "none", worldBgColor: "", worldBgImageUrl: "",
      worldBgOpacity: 1, worldBgFit: "cover", worldBgBlurPx: 0,
    } as ServerGameState["arena"],
    beyblades,
  };

  return { state, beyblades };
}

interface BeybladePreviewProps {
  beyblade: BeybladeStats;
  onCanvasClick?: (angle: number) => void;
  clickMode?: boolean;
}

export default function BeybladePreview({ beyblade, onCanvasClick, clickMode = false }: BeybladePreviewProps) {
  const tickRef = useRef(0);
  const [tick, setTick] = useState(0);

  // 30fps animation: advance tick → new rotation → PreviewAdapter re-renders.
  useEffect(() => {
    if (clickMode) return; // pause spin while placing contact points
    const id = setInterval(() => {
      tickRef.current = (tickRef.current + 1) % 1_000_000;
      setTick(tickRef.current);
    }, 33);
    return () => clearInterval(id);
  }, [clickMode]);

  // Spin direction: right = clockwise (+), left = counter-clockwise (-)
  const dir = (beyblade.spinDirection ?? "right") === "left" ? -1 : 1;
  const rotation = clickMode ? 0 : (tick * 0.06 * dir) % (Math.PI * 2);

  const { state, beyblades } = buildPreviewState(beyblade, rotation);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickMode || !onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Angle from the centre of the canvas — same formula as the old custom canvas.
    const x = (e.clientX - rect.left) - rect.width / 2;
    const y = (e.clientY - rect.top) - rect.height / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    onCanvasClick(angle);
  }, [clickMode, onCanvasClick]);

  return (
    <div className="bg-bg2 rounded-xl p-4 border border-border-c">
      <div className="text-sm font-semibold text-theme-text mb-3">Live Preview</div>

      {/* Canvas wrapper — captures clicks for contact-point placement in clickMode */}
      <div className="flex justify-center mb-3">
        <div
          className={cn(
            "relative rounded-lg border-2 border-border-c overflow-hidden",
            clickMode ? "cursor-crosshair" : "cursor-default",
          )}
          style={{ width: 280, height: 280 }}
          onClick={handleClick}
        >
          <PreviewAdapter
            mode="2d"
            gameState={state}
            beyblades={beyblades}
            width={280}
            height={280}
          />
        </div>
      </div>

      {clickMode && (
        <p className="text-xs text-theme-blue text-center mb-3">
          Click on the canvas to place a point (spinning paused)
        </p>
      )}

      {/* Stats panel */}
      <div className="text-xs text-theme-faint flex flex-col gap-1">
        {([
          ["Name",    beyblade.displayName || "Unnamed"],
          ["Type",    beyblade.type],
          ["Spin",    beyblade.spinDirection],
          ["Radius",  `${beyblade.radius} cm`],
          ["Mass",    `${beyblade.mass}g`],
          ...(beyblade.speed != null        ? [["Speed",     String(beyblade.speed)]]                : []),
          ...(beyblade.rotationSpeed != null ? [["Rot. Speed", `${beyblade.rotationSpeed}°/s`]]       : []),
        ] as [string, string][]).map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span>{k}:</span>
            <span className="text-theme-text capitalize">{v}</span>
          </div>
        ))}
      </div>

      {/* Contact-points badge */}
      {(beyblade.pointsOfContact?.length ?? 0) > 0 && (
        <div className="mt-2.5 bg-bg3 rounded-lg p-2.5 text-[11px] text-theme-faint">
          <span className="font-semibold text-theme-muted">Contact points: </span>
          <span>{beyblade.pointsOfContact.length} active</span>
        </div>
      )}
    </div>
  );
}
