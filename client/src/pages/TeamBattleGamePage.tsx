// [PAGE] TeamBattleGamePage — 2v2 team battle game page.
// Extends the standard battle view with BeySelector HUD + possession message overlay.

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { C } from "@/styles/theme";
import { BeySelector } from "@/components/game/BeySelector";
import { SpecialMoveHUD } from "@/components/game/SpecialMoveHUD";
import { ComboHUD } from "@/components/game/ComboHUD";
import { CameraControls } from "@/components/game/CameraControls";
import { LoadingProgress } from "@/components/LoadingProgress";
import type { ServerBeyblade } from "@/types/game";

const TEAM_BATTLE_ROOM = "team_battle_room";

export function TeamBattleGamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useGame();

  const mode = modeFromPath(location.pathname);
  const spectate = searchParams.get("spectate") === "true";
  const userId = settings.userId ?? "guest";

  const [possessionMsg, setPossessionMsg] = useState<string | null>(null);
  const [myTeam, setMyTeam] = useState<"red" | "blue">("blue");
  const [controlledBeyId, setControlledBeyId] = useState<string | null>(null);

  const colyseusOptions = useMemo(() => ({
    beybladeId: settings.beybladeId ?? "default",
    arenaId: settings.arenaId ?? "default",
    username: settings.username ?? "Player",
    userId,
    spectate,
  }), [settings.beybladeId, settings.arenaId, settings.username, userId, spectate]);

  const {
    connectionState, gameState, beyblades, myBeyblade,
    isSpectating, room, sendInput, loadingStep, loadingError, visualEventQueue,
  } = useColyseus({
    roomName: TEAM_BATTLE_ROOM,
    roomId,
    options: colyseusOptions,
    autoConnect: true,
  });

  const {
    render,
    setControlledBeyblade,
    cameraZoomIn,
    cameraZoomOut,
    cameraZoomReset,
  } = usePixiRenderer(containerRef, mode);

  // Render loop
  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades, visualEventQueue); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, gameState, beyblades]);

  // Camera focus
  useEffect(() => {
    setControlledBeyblade(controlledBeyId ?? myBeyblade?.id ?? null);
  }, [controlledBeyId, myBeyblade?.id, setControlledBeyblade]);

  // Listen for team-specific messages
  useEffect(() => {
    if (!room) return;
    room.onMessage("team-joined", (data: { sessionId: string; team: string }) => {
      if (data.sessionId === room.sessionId) setMyTeam(data.team as "red" | "blue");
    });
    room.onMessage("possession-transferred", (data: { sessionId: string; toBeyId: string }) => {
      if (data.sessionId === room.sessionId) {
        setControlledBeyId(data.toBeyId);
        const bey = beyblades.get(data.toBeyId) as (ServerBeyblade & { username?: string }) | undefined;
        const label = bey?.username ?? data.toBeyId.slice(0, 6);
        setPossessionMsg(`Switched to ${label}`);
        setTimeout(() => setPossessionMsg(null), 1500);
      }
    });
    room.onMessage("game-end", () => navigate(`/game/${mode}/team-battle/lobby`));
  }, [room, navigate, mode, beyblades]);

  useGameInput(sendInput, !spectate && connectionState === "connected");

  // Build BeySelector slots
  const teamSlots = useMemo(() => {
    const slots: Parameters<typeof BeySelector>[0]["slots"] = [];
    beyblades.forEach((bey, sid) => {
      slots.push({
        index: slots.length,
        beyId: sid,
        username: (bey as unknown as ServerBeyblade & { username?: string }).username ?? sid.slice(0, 6),
        health: bey.health,
        maxHealth: bey.maxHealth,
        spin: bey.spin,
        maxSpin: bey.maxSpin,
        isActive: bey.isActive,
        isControlled: controlledBeyId ? controlledBeyId === sid : sid === myBeyblade?.id,
      });
    });
    return slots.slice(0, 4);
  }, [beyblades, controlledBeyId, myBeyblade]);

  const handleBeySelectorSelect = useCallback((index: number) => {
    const DIRECTIONS: Record<number, Partial<Parameters<typeof sendInput>[0]>> = {
      1: { specialTap: true, moveRight: true },
      2: { specialTap: true, moveUp: true },
      3: { specialTap: true, moveLeft: true },
    };
    const dir = DIRECTIONS[index];
    if (dir) sendInput(dir as Parameters<typeof sendInput>[0]);
  }, [sendInput]);

  const showLoading = !gameState || (
    gameState.status !== "in-progress" &&
    gameState.status !== "warmup" &&
    gameState.status !== "finished"
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {showLoading && (
        <LoadingProgress
          currentStep={loadingStep}
          stepProgress={connectionState === "connected" ? 0.5 : 0.2}
          error={loadingError}
        />
      )}

      {/* HUDs */}
      {!isSpectating && myBeyblade && (
        <>
          <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)" }}>
            <BeySelector slots={teamSlots} onSelect={handleBeySelectorSelect} />
          </div>
          <SpecialMoveHUD
            myBeyblade={myBeyblade}
            specialMoveData={null}
            lastSpecialMoveFired={null}
          />
          <ComboHUD lastCombo={null} />
        </>
      )}

      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      </div>

      {/* Team indicator */}
      <div style={{
        position: "absolute", top: 10, left: 10,
        padding: "4px 12px", borderRadius: 8,
        background: myTeam === "blue" ? "#3b82f644" : "#ef444444",
        border: `1px solid ${myTeam === "blue" ? "#3b82f6" : "#ef4444"}`,
        color: myTeam === "blue" ? "#93c5fd" : "#fca5a5",
        fontSize: 12, fontWeight: 700,
      }}>
        {myTeam === "blue" ? "Blue" : "Red"}
      </div>

      {/* Possession notification */}
      {possessionMsg && (
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
          background: "#00000088", borderRadius: 10, padding: "10px 20px",
          color: "#f1f5f9", fontSize: 14, fontWeight: 600, pointerEvents: "none",
        }}>
          Switched to {possessionMsg}
        </div>
      )}
    </div>
  );
}
