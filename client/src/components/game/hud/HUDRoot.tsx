// Phase 28 HUD — HUDRoot: composes TopBar, AbilityIcons, SPBar, OpponentPanel per rendererMode.

import type { ServerGameState, ServerBeyblade, ServerBeyGhost, RendererMode } from "@/types/game";
import { TopBar } from "./TopBar";
import { AbilityIcons } from "./AbilityIcons";
import { SPBar } from "./SPBar";
import { OpponentPanel } from "./OpponentPanel";

interface HUDRootProps {
  gameState: ServerGameState;
  myId: string;
  myBey: ServerBeyblade | null;
}

function deriveMode(gameState: ServerGameState): RendererMode {
  const raw = gameState.arena?.rendererMode;
  if (raw === "3d" || raw === "2d" || raw === "2.5d") return raw;
  return "2.5d";
}

export function HUDRoot({ gameState, myId, myBey }: HUDRootProps) {
  const mode = deriveMode(gameState);
  const timerSec = gameState.timer ?? 0;

  const spinPct = myBey
    ? Math.round((myBey.spin / Math.max(1, myBey.maxSpin)) * 100)
    : 0;

  const username = myBey?.username ?? "—";
  const beyType = myBey?.type ?? "balanced";

  const beyGhosts: Map<string, ServerBeyGhost> | undefined = gameState.beyGhosts as
    | Map<string, ServerBeyGhost>
    | undefined;

  // 3-slot ability placeholder — real bindings wired from comboIds/specialMoveId in a later pass
  const abilitySlots: [
    { label: string; cooldownMs: number; maxCooldownMs: number; color?: string },
    { label: string; cooldownMs: number; maxCooldownMs: number; color?: string },
    { label: string; cooldownMs: number; maxCooldownMs: number; color?: string },
  ] = [
    { label: "J", cooldownMs: 0, maxCooldownMs: 0, color: "#ff6655" },
    { label: "K", cooldownMs: 0, maxCooldownMs: 0, color: "#4488ff" },
    { label: "L", cooldownMs: 0, maxCooldownMs: 0, color: "#44dd88" },
  ];

  return (
    <>
      {/* TopBar — always visible */}
      <TopBar
        username={username}
        timerSec={timerSec}
        beyType={beyType}
        spinPct={spinPct}
      />

      {/* SPBar — bottom-left in 2D/2.5D */}
      {mode !== "3d" && (
        <div
          style={{ position: "absolute", bottom: "1.5rem", left: "1rem" }}
          className="z-50 pointer-events-none"
        >
          <SPBar spinPct={spinPct} />
        </div>
      )}

      {/* AbilityIcons — bottom-center in 2D/2.5D */}
      {mode !== "3d" && (
        <AbilityIcons slots={abilitySlots} />
      )}

      {/* OpponentPanel — right side; uses beyGhosts */}
      <OpponentPanel myId={myId} beyGhosts={beyGhosts} />
    </>
  );
}
