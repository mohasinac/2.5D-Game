/**
 * BeybladeSystemPreview — three-panel 2.5D preview container.
 * Composes SideProfileView + TopDownView + IsometricView + ComputedStatsPanel.
 */

import { useState, useEffect, useRef } from "react";
import { SideProfileView } from "./SideProfileView";
import { TopDownView } from "./TopDownView";
import { IsometricView } from "./IsometricView";
import { ExplodedView } from "./ExplodedView";
import { ComputedStatsPanel } from "./ComputedStatsPanel";
import { PreviewAdapter } from "@/game/renderer/PreviewAdapter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { ServerBeyblade, ServerGameState } from "@/types/game";

type PreviewTab = "3panel" | "exploded" | "side" | "top" | "iso" | "live" | "stats";

const TABS: Array<{ key: PreviewTab; label: string }> = [
  { key: "3panel",   label: "All Panels" },
  { key: "exploded", label: "Exploded" },
  { key: "side",     label: "Side" },
  { key: "top",      label: "Top-Down" },
  { key: "iso",      label: "Isometric" },
  { key: "live",     label: "Live (In-Game)" },
  { key: "stats",    label: "Stats" },
];

// Construct a minimal ServerGameState + Beyblade map representing this system
// spinning in an empty test arena. Reuses the in-game PixiJS renderer so the
// preview is pixel-identical to what players actually see.
function buildLivePreviewState(resolved: ResolvedBeybladeSystem | null | undefined): {
  state: ServerGameState | null;
  beys: Map<string, ServerBeyblade>;
} {
  if (!resolved) return { state: null, beys: new Map() };

  const system = resolved.system;
  // Heuristic type bucket — chosen by attackRing tag if available, else "balanced".
  const type: ServerBeyblade["type"] = "balanced";

  // Arena uses standard 1080×1080 px dimensions (same as real game).
  // Beyblade x/y must be in physics space (arena_px * PHYSICS_SCALE=16).
  // Center of 1080×1080 arena = 540 arena_px → 540*16 = 8640 physics units.
  const PREVIEW_ARENA_PX = 1080;
  const PHYSICS_SCALE = 16;
  const centerPhys = (PREVIEW_ARENA_PX / 2) * PHYSICS_SCALE; // 8640

  const bey: ServerBeyblade = {
    id: "preview", userId: "preview", username: system.displayName,
    x: centerPhys, y: centerPhys, rotation: 0,
    velocityX: 0, velocityY: 0, angularVelocity: 12,
    health: 1000, maxHealth: 1000,
    stamina: 1000, maxStamina: 1000,
    spin: 2000, maxSpin: 2000,
    isActive: true, isAI: false,
    type,
    radius: 5, actualSize: 120,
    isInvulnerable: false,
    damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: system.spinDirection,
    power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
  };

  const state = {
    matchId: "preview",
    mode: "tryout" as const,
    status: "in-progress",
    currentGame: 1, targetWins: 1, timer: 0, startTime: 0,
    winner: "", seriesLeader: "", spectatorCount: 0,
    arena: {
      id: "preview-arena", name: "Preview",
      width: PREVIEW_ARENA_PX, height: PREVIEW_ARENA_PX,
      shape: "circle", theme: "metrocity", rotation: 0,
      gravity: 0, airResistance: 0.01, surfaceFriction: 0.01,
      wallEnabled: false, wallBaseDamage: 0, wallRecoilDistance: 0,
      wallHasSpikes: false, wallSpikeDamageMultiplier: 1,
      wallHasSprings: false, wallSpringRecoilMultiplier: 1,
      wallAngle: 0,
      loopCount: 0, obstacleCount: 0, pitCount: 0, turretCount: 0, waterBodyCount: 0,
    } as ServerGameState["arena"],
    beyblades: new Map([["preview", bey]]),
  };

  return { state: state as unknown as ServerGameState, beys: state.beyblades };
}

interface Props {
  resolved: ResolvedBeybladeSystem | null | undefined;
}

export function BeybladeSystemPreview({ resolved }: Props) {
  const [tab, setTab] = useState<PreviewTab>("3panel");
  const liveTickRef = useRef(0);
  const [, force] = useState(0);

  // While the Live tab is open, animate by re-rendering at ~30fps so the
  // beyblade visibly spins. PreviewAdapter will redraw each time.
  useEffect(() => {
    if (tab !== "live") return;
    const interval = setInterval(() => {
      liveTickRef.current = (liveTickRef.current + 1) % 1_000_000;
      force(liveTickRef.current);
    }, 33);
    return () => clearInterval(interval);
  }, [tab]);

  const livePreview = tab === "live" ? buildLivePreviewState(resolved) : null;
  // Mutate rotation each frame so the rendered beyblade spins.
  if (livePreview?.state) {
    const bey = livePreview.beys.get("preview");
    if (bey) bey.rotation = (liveTickRef.current * 0.3) % (Math.PI * 2);
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Tab strip */}
      <div className="flex gap-0.5 px-3 pt-1.5 border-b border-border bg-bg1 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-2.5 py-[5px] text-[11px] rounded-t-[5px] cursor-pointer border ${
              tab === t.key
                ? "bg-bg0 text-text border-border -mb-px border-b-bg0"
                : "bg-transparent text-muted border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 bg-bg0">
        {tab === "3panel" && (
          <div className="flex gap-3 items-start flex-wrap">
            {/* Exploded view — primary anchor on the left */}
            <ExplodedView resolved={resolved} width={340} />

            {/* Other panels — analytical views stacked on the right */}
            <div className="flex flex-col gap-3 flex-1 min-w-[280px]">
              <div className="flex gap-3 flex-wrap">
                <div>
                  <div className="text-[10px] text-faint mb-1">Side Profile</div>
                  <SideProfileView resolved={resolved} />
                </div>
                <div>
                  <TopDownView resolved={resolved} showMovementPath />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <IsometricView resolved={resolved} />
                <div className="flex-1 min-w-[200px] bg-bg1 border border-border rounded-[8px]">
                  <div className="text-[10px] text-faint px-3.5 pt-2">Computed Stats</div>
                  <ComputedStatsPanel resolved={resolved} />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "exploded" && <ExplodedView resolved={resolved} width={360} />}
        {tab === "side"  && <SideProfileView resolved={resolved} width={320} height={380} />}
        {tab === "top"   && <TopDownView resolved={resolved} showMovementPath />}
        {tab === "iso"   && <IsometricView resolved={resolved} />}
        {tab === "live"  && livePreview && (
          <div className="flex gap-3 flex-wrap">
            <div className="w-[480px] h-[480px] bg-bg1 border border-border rounded-[8px] overflow-hidden">
              <div className="text-[10px] text-faint px-3.5 pt-2 pb-1">
                Live preview — drives the in-game PixiJS renderer with this system
              </div>
              <PreviewAdapter
                gameState={livePreview.state}
                beyblades={livePreview.beys}
                width={480}
                height={444}
              />
            </div>
          </div>
        )}
        {tab === "stats" && (
          <div className="bg-bg1 border border-border rounded-[8px] max-w-xs">
            <ComputedStatsPanel resolved={resolved} />
          </div>
        )}
      </div>
    </div>
  );
}
