/**
 * BeybladeSystemPreview — three-panel 2.5D preview container.
 * Composes SideProfileView + TopDownView + IsometricView + ComputedStatsPanel.
 */

import { useState, useEffect, useRef } from "react";
import { C } from "@/styles/theme";
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

  const bey: ServerBeyblade = {
    id: "preview", userId: "preview", username: system.displayName,
    x: 540, y: 540, rotation: 0,
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
      id: "preview-arena", name: "Preview", width: 50, height: 50,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {/* Tab strip */}
      <div style={{ display: "flex", gap: 2, padding: "6px 12px 0", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "5px 10px", fontSize: 11, borderRadius: "5px 5px 0 0", cursor: "pointer",
              background: tab === t.key ? C.bg0 : "transparent",
              color: tab === t.key ? C.text : C.muted,
              border: `1px solid ${tab === t.key ? C.border : "transparent"}`,
              borderBottom: tab === t.key ? `1px solid ${C.bg0}` : "none",
              marginBottom: tab === t.key ? -1 : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, background: C.bg0 }}>
        {tab === "3panel" && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Exploded view — primary anchor on the left */}
            <ExplodedView resolved={resolved} width={340} />

            {/* Other panels — analytical views stacked on the right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 10, color: C.faint, marginBottom: 4 }}>Side Profile</div>
                  <SideProfileView resolved={resolved} />
                </div>
                <div>
                  <TopDownView resolved={resolved} showMovementPath />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <IsometricView resolved={resolved} />
                <div style={{ flex: 1, minWidth: 200, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.faint, padding: "8px 14px 0" }}>Computed Stats</div>
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
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{
              width: 480, height: 480, background: C.bg1,
              border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{ fontSize: 10, color: C.faint, padding: "8px 14px 4px" }}>
                Live preview — drives the in-game PixiJS renderer with this system
              </div>
              <PreviewAdapter
                mode="2.5d"
                gameState={livePreview.state}
                beyblades={livePreview.beys}
                width={480}
                height={444}
              />
            </div>
          </div>
        )}
        {tab === "stats" && (
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, maxWidth: 320 }}>
            <ComputedStatsPanel resolved={resolved} />
          </div>
        )}
      </div>
    </div>
  );
}
