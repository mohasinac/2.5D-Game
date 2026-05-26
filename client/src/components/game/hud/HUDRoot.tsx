import type { ServerGameState, ServerBeyblade, ServerBeyGhost, RendererMode } from "@/types/game";
import { TopBar } from "./TopBar";
import { AbilityIcons } from "./AbilityIcons";
import { PlayerPanel } from "./PlayerPanel";
import { OpponentPanel } from "./OpponentPanel";
import { BottomStaminaBars } from "./BottomStaminaBars";

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
  const myTeamId = (myBey as any)?.teamId ?? "";

  const beyGhosts = gameState.beyGhosts as Map<string, ServerBeyGhost> | undefined;

  // Resolve allies from beyGhosts (same teamId, not self)
  const allies: { id: string; username: string; beyType: string; spinPct: number }[] = [];
  if (myTeamId && beyGhosts) {
    beyGhosts.forEach((ghost, id) => {
      if (id === myId) return;
      if (ghost.teamId === myTeamId) {
        allies.push({ id, username: ghost.username, beyType: ghost.beyType, spinPct: ghost.spin_pct });
      }
    });
  }

  // Resolve opponents from beyGhosts (not self, not ally)
  const opponentList: { spinPct: number; beyType: string; username: string }[] = [];
  if (beyGhosts) {
    beyGhosts.forEach((ghost, id) => {
      if (id === myId) return;
      if (myTeamId && ghost.teamId === myTeamId) return; // skip allies
      opponentList.push({
        spinPct: ghost.spin_pct,
        beyType: ghost.beyType,
        username: ghost.username,
      });
    });
  }

  const seriesWins = gameState.seriesWins?.get(myId);
  const targetWins = gameState.targetWins;

  // 3-slot ability placeholder
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
      {/* Centered top bar — timer, tournament info, modifiers */}
      <TopBar
        timerSec={timerSec}
        status={gameState.status}
        tournamentName={gameState.tournamentName}
        roundLabel={gameState.roundNumber ? `Round ${gameState.roundNumber}` : undefined}
        modifiers={gameState.activeModifierIds}
        spectatorCount={gameState.spectatorCount}
      />

      {/* Top-left — player corner card + allies */}
      <PlayerPanel
        username={username}
        beyType={beyType}
        spinPct={spinPct}
        allies={allies}
        seriesWins={seriesWins}
        targetWins={targetWins}
      />

      {/* Top-right — opponent panel (1v1 full card, multi = compact rows) */}
      <OpponentPanel
        myId={myId}
        myTeamId={myTeamId}
        beyGhosts={beyGhosts}
        maxVisible={8}
      />

      {/* Bottom — GBA-style horizontal stamina bars */}
      <BottomStaminaBars
        mySpinPct={spinPct}
        myType={beyType}
        opponents={opponentList}
      />

      {/* Bottom-center — ability slots (2D / 2.5D mode only) */}
      {mode !== "3d" && (
        <AbilityIcons slots={abilitySlots} />
      )}
    </>
  );
}
