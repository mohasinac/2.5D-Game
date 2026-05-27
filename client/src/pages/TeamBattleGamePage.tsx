// [PAGE] TeamBattleGamePage — 2v2 team battle game page.
// Extends the standard battle view with BeySelector HUD + possession message overlay.

import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { BeySelector } from "@/components/game/BeySelector";
import { SpecialMoveHUD } from "@/components/game/SpecialMoveHUD";
import { ComboHUD } from "@/components/game/ComboHUD";
import { BeyLinkHijackHUD } from "@/components/game/BeyLinkHijackHUD";
import { CameraControls } from "@/components/game/CameraControls";
import { TouchControlsGBLayout } from "@/components/game/TouchControlsGBLayout";
import { LoadingProgress } from "@/components/LoadingProgress";
import type { ServerBeyblade, ServerGameState } from "@/types/game";

const TEAM_BATTLE_ROOM = "team_battle_room";

// Default arena game state — used as fallback before Colyseus connects so the
// renderer initialises and draws the arena background from frame 1 (no black screen).
const DEFAULT_GAME_STATE: ServerGameState = {
  matchId: "default", mode: "single-battle-pvp", status: "waiting",
  timer: 0, startTime: 0, winner: "", beyblades: new Map(),
  arena: {
    id: "default", name: "Standard Arena",
    width: 1080, height: 1080, shape: "circle", theme: "default",
    rotation: 0, wallEnabled: true, wallAngle: 0,
    worldBgType: "none", worldBgColor: "", worldBgImageUrl: "",
    worldBgOpacity: 1.0, worldBgFit: "cover", worldBgBlurPx: 0,
  },
};

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
    isSpectating, room, sendInput, beyLinkHijackQTE, beyLinkHijackBlockQTE, sendHijackBlock,
    loadingStep, loadingError, visualEventQueue,
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

  // Render loop — use refs for rapidly-updating state to avoid recreating rAF every tick
  const gameStateRef = useRef(gameState);
  const beybladesRef = useRef(beyblades);
  const visualEventQueueRef = useRef(visualEventQueue);
  gameStateRef.current = gameState;
  beybladesRef.current = beyblades;
  visualEventQueueRef.current = visualEventQueue;

  useEffect(() => {
    let raf: number;
    // Use DEFAULT_GAME_STATE as fallback so the renderer builds the arena on frame 1
    // even before Colyseus connects — eliminates black screen during connection.
    const loop = () => { render(gameStateRef.current ?? DEFAULT_GAME_STATE, beybladesRef.current, visualEventQueueRef.current); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, navigate, mode]);

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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0" />

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
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <BeySelector slots={teamSlots} onSelect={handleBeySelectorSelect} />
          </div>
          <SpecialMoveHUD
            myBeyblade={myBeyblade}
            specialMoveData={null}
            lastSpecialMoveFired={null}
          />
          <ComboHUD lastCombo={null} />
          {!isSpectating && (
            <BeyLinkHijackHUD
              hijackQTE={beyLinkHijackQTE}
              hijackBlockQTE={beyLinkHijackBlockQTE}
              onBlock={sendHijackBlock}
            />
          )}
        </>
      )}

      <div className="absolute" style={{ top: 10, right: 10 }}>
        <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      </div>

      {/* Team indicator */}
      <div
        className={`absolute py-1 px-3 rounded-lg text-[12px] font-bold ${myTeam === "blue" ? "text-[#93c5fd] bg-blue-27 border border-[#3b82f6]" : "text-[#fca5a5] bg-red-20 border border-[#ef4444]"}`}
        style={{ top: 10, left: 10 }}
      >
        {myTeam === "blue" ? "Blue" : "Red"}
      </div>

      {/* Possession notification */}
      {possessionMsg && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/[0.53] rounded-[10px] py-[10px] px-5 text-[#f1f5f9] text-[14px] font-semibold pointer-events-none">
          Switched to {possessionMsg}
        </div>
      )}
      <TouchControlsGBLayout />
    </div>
  );
}
