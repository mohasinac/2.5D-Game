import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";

import { Link, useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from "@/types/game";
import type { ServerGameState } from "@/types/game";
import { MODIFIER_MAP } from "@/types/roundModifier";
import { SpecialMoveHUD } from "@/components/game/SpecialMoveHUD";
import { ComboHUD } from "@/components/game/ComboHUD";
import { useCombos } from "@/hooks/useCombos";
import { useSpecialMoves } from "@/hooks/useSpecialMoves";
import { BeyLinkHijackHUD } from "@/components/game/BeyLinkHijackHUD";
import { PartModesHUD } from "@/components/game/PartModesHUD";
import { BXScoreHUD } from "@/components/game/BXScoreHUD";
import FloorHUD from "@/components/game/FloorHUD";
import FloorTransitionOverlay from "@/components/game/FloorTransitionOverlay";
import LinkAlignmentHUD from "@/components/game/LinkAlignmentHUD";
import { CameraControls } from "@/components/game/CameraControls";
import { ControlsLegend } from "@/components/game/ControlsLegend";
import { Countdown } from "@/components/game/Countdown";
import { LaunchPhase } from "@/components/game/LaunchPhase";
import { useLaunchInput } from "@/game/hooks/useLaunchInput";
import { LAUNCH_DURATION_S } from "@/shared/constants/gameConstants";
import { Minimap } from "@/components/game/Minimap";
import { SoundManager } from "@/game/audio/SoundManager";
import { LoadingProgress } from "@/components/LoadingProgress";
import { QTEOverlay } from "@/components/game/QTEOverlay";
import { CollisionQTEOverlay } from "@/components/game/CollisionQTEOverlay";
import { SplitScreenCinematic } from "@/components/game/SplitScreenCinematic";
import type { QTEPromptData } from "@/game/hooks/useColyseus";
import type { SplitScreenCinematicData } from "@/types/game";
import { ELEMENT_ICONS, ELEMENT_COLORS, type ElementType } from "@/types/elementTypes";
import { cn } from "@/lib/cn";
import BurstOverlay from "@/components/game/BurstOverlay";
import LaunchCinematic from "@/components/game/LaunchCinematic";
import VictoryOverlay from "@/components/game/VictoryOverlay";
import KOOverlay from "@/components/game/KOOverlay";
import { BitBeastCinematic } from "@/components/game/BitBeastCinematic";
import { useBitBeastCinematic } from "@/hooks/useBitBeastCinematic";

const TYPE_FLASH: Record<string, string> = { attack: "#ff4444", defense: "#4488ff", stamina: "#44ff88", balanced: "#ffcc44" };

// Default arena game state — used as a fallback before Colyseus connects so the
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

export function BattleGamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, isHydrated, setActiveRoom } = useGame();

  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();

  const mode = modeFromPath(location.pathname);
  const spectate = searchParams.get("spectate") === "true";
  const launcherType = (searchParams.get("launcher") === "ripcord" ? "ripcord" : "string") as "string" | "ripcord";
  const userId = settings.userId ?? "guest";

  const [gameEndData, setGameEndData] = useState<{ winner: string; gameNumber: number; seriesScore: Record<string, number> } | null>(null);
  const [seriesEndData, setSeriesEndData] = useState<{ winner: string; seriesScore: Record<string, number> } | null>(null);
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);
  const [qtePrompt, setQTEPrompt] = useState<QTEPromptData | null>(null);
  const [collisionQTEActive, setCollisionQTEActive] = useState(false);
  const [collisionQTEPowerLocal, setCollisionQTEPowerLocal] = useState(0);
  const [collisionCanFireSpecial, setCollisionCanFireSpecial] = useState(false);
  const [collisionQTEMultiplier, setCollisionQTEMultiplier] = useState(1);
  const [splitScreenData, setSplitScreenData] = useState<SplitScreenCinematicData | null>(null);
  const [splitScreenEliminated, setSplitScreenEliminated] = useState<Set<string>>(new Set());
  const [burstVisible, setBurstVisible] = useState(false);
  const [koVisible, setKoVisible] = useState<{ visible: boolean; type: "ko" | "ring_out" | "outspin" }>({ visible: false, type: "ko" });
  const [victoryVisible, setVictoryVisible] = useState(false);

  const bitBeastCinematic = useBitBeastCinematic(settings.beybladeId ?? null);
  const launchRevealShownRef = useRef(false);

  const isSpectatingRef = useRef(false);
  const handleQTEPrompt = useCallback((data: QTEPromptData) => {
    if (!isSpectatingRef.current) setQTEPrompt(data);
  }, []);
  const handleQTESuccess = useCallback(() => setQTEPrompt(null), []);
  const handleQTEExpired = useCallback(() => setQTEPrompt(null), []);
  const handleSplitScreenCinematic = useCallback((data: SplitScreenCinematicData) => {
    setSplitScreenData(data);
    setSplitScreenEliminated(new Set());
  }, []);

  const colyseusOptions = useMemo(() => ({
    beybladeId: settings.beybladeId ?? "default",
    arenaId: settings.arenaId ?? "default",
    username: settings.username ?? "Player",
    userId,
    spectate,
  }), [settings.beybladeId, settings.arenaId, settings.username, userId, spectate]);

  const { connectionState, gameState, beyblades, myBeyblade, isSpectating, room, connect, disconnect, sendInput, sendQTEInput, beyLinkQTE, beyLinkControlLoss, sendBeyLinkQTEInput, beyLinkHijackQTE, beyLinkHijackBlockQTE, sendHijackBlock, loadingStep, loadingError, visualEventQueue, floorInfo, myFloorIndex, linkAlignments, floorTransition,
    collisionQTEData, collisionQTEPower, collisionQTESpecialPrompt, sendCollisionQTEMash, sendCollisionQTEFireSpecial,
  } =
    useColyseus({
      roomName: roomNameFor(mode, "battle"),
      options: colyseusOptions,
      roomId,   // ensures joinById is used so players land in the correct room
      autoConnect: false,
      onGameEnd: setGameEndData,
      onSeriesEnd: setSeriesEndData,
      onQTEPrompt: handleQTEPrompt,
      onQTESuccess: handleQTESuccess,
      onQTEExpired: handleQTEExpired,
      onSplitScreenCinematic: handleSplitScreenCinematic,
    });

  isSpectatingRef.current = isSpectating;

  // Sync collision QTE state from hook
  useEffect(() => {
    if (collisionQTEData && !isSpectating) {
      setCollisionQTEActive(true);
      setCollisionQTEPowerLocal(0);
      setCollisionCanFireSpecial(false);
    }
  }, [collisionQTEData, isSpectating]);

  useEffect(() => {
    if (!isSpectating) setCollisionQTEPowerLocal(collisionQTEPower);
  }, [collisionQTEPower, isSpectating]);

  useEffect(() => {
    if (collisionQTESpecialPrompt && !isSpectating) {
      setCollisionCanFireSpecial(true);
      setCollisionQTEMultiplier(collisionQTESpecialPrompt.qteMultiplier);
    }
  }, [collisionQTESpecialPrompt, isSpectating]);

  // Handle split-screen participant eliminations + end
  useEffect(() => {
    if (!room) return;
    room.onMessage("split-screen-participant-out", (data: { beyId: string }) => {
      setSplitScreenEliminated(prev => new Set([...prev, data.beyId]));
    });
    room.onMessage("split-screen-end", () => setSplitScreenData(null));
  }, [room]);

  useEffect(() => {
    if (roomId) setActiveRoom(roomId);
    return () => setActiveRoom(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (isHydrated) connect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const {
    render,
    spawnCollisionParticles,
    spawnSpinOutParticles,
    spawnBurstParticles,
    spawnDamageNumber,
    physicsToScreen,
    playSpecialMoveEffect,
    playComboEffect,
    setControlledBeyblade,
    cameraZoomIn,
    cameraZoomOut,
    cameraZoomReset,
    getViewportCm,
  } = usePixiRenderer(containerRef, mode);

  // Sample camera viewport for the minimap. Cheap to read; refresh @ ~4Hz.
  const [viewportCm, setViewportCm] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useEffect(() => {
    const id = setInterval(() => setViewportCm(getViewportCm()), 250);
    return () => clearInterval(id);
  }, [getViewportCm]);

  // Spectator follow target. Defaults to the first non-AI active beyblade.
  const [spectatorFollowId, setSpectatorFollowId] = useState<string | null>(null);
  useEffect(() => {
    if (!isSpectating) return;
    if (spectatorFollowId && beyblades.has(spectatorFollowId)) return;
    const first = Array.from(beyblades.values()).find(b => !b.isAI && b.isActive)
      ?? Array.from(beyblades.values())[0];
    if (first) setSpectatorFollowId(first.id);
  }, [isSpectating, beyblades, spectatorFollowId]);

  // Tell the renderer which bey to follow (camera focus).
  useEffect(() => {
    const id = isSpectating ? spectatorFollowId : (myBeyblade?.id ?? null);
    setControlledBeyblade(id);
    // Optional: notify the server so other clients could be told (used in some UIs).
    if (isSpectating && id && room) {
      try { room.send("spectator:follow", { targetBeybladeId: id }); } catch { /* swallow */ }
    }
  }, [myBeyblade?.id, isSpectating, spectatorFollowId, setControlledBeyblade, room]);

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

  useEffect(() => {
    if (!room) return;
    room.onMessage("collision", (data: any) => {
      const { x: cx, y: cy } = physicsToScreen(data.contactPoint.x, data.contactPoint.y);
      spawnCollisionParticles(cx, cy, 0xff4444, 0x4488ff);
      if (data.damage1 > 0) spawnDamageNumber(cx - 12, cy - 8, data.damage1, 0xff5555);
      if (data.damage2 > 0) spawnDamageNumber(cx + 12, cy - 8, data.damage2, 0x55aaff);
      SoundManager.play("collision");
    });
    room.onMessage("spin-out", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnSpinOutParticles(x, y, TYPE_COLORS[data.type] ?? 0xffffff);
      SoundManager.play("spin-out");
      setKoVisible({ visible: true, type: data.reason === "ring_out" ? "ring_out" : data.reason === "outspin" ? "outspin" : "ko" });
    });
    room.onMessage("burst", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnBurstParticles(x, y);
      SoundManager.play("spin-out");
      setBurstVisible(true);
    });
    room.onMessage("special-move", (data: any) => {
      playSpecialMoveEffect(data.playerId, data.type, data.x, data.y, data.facing);
      SoundManager.play("special-move");
      if (data.playerId === myBeyblade?.id) {
        setLastSpecialMove(data.type);
        bitBeastCinematic.show(data.type, 1800);
      }
    });
    room.onMessage("combo", (data: any) => {
      playComboEffect(data.playerId, data.comboName);
      SoundManager.play("combo");
      if (data.playerId === myBeyblade?.id) {
        setLastCombo({ name: data.comboName, timestamp: Date.now() });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // Auto-dismiss game-end overlay + play victory/defeat sound.
  useEffect(() => {
    if (!gameEndData) return;
    const isWinner = gameEndData.winner === userId;
    SoundManager.play(isWinner ? "victory" : "defeat");
    const id = setTimeout(() => setGameEndData(null), 4000);
    return () => clearTimeout(id);
  }, [gameEndData, userId]);

  useGameInput(sendInput, !isSpectating && connectionState === "connected" && gameState?.status === "in-progress");

  const launchState = useLaunchInput(room ?? null, gameState?.status ?? "", launcherType);

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? "text-theme-green" : myStability > 0.3 ? "text-theme-yellow" : "text-theme-red";
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  const seriesLabel = gameState && (gameState.targetWins ?? 1) > 1
    ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}`
    : "";

  useEffect(() => {
    if (gameState?.status === "launching" && !launchRevealShownRef.current && !isSpectating) {
      launchRevealShownRef.current = true;
      bitBeastCinematic.show("LET IT RIP!", 1500);
    }
  }, [gameState?.status, isSpectating]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gameState?.status === "series-finished" || (gameState?.status === "finished" && !gameEndData)) {
      setVictoryVisible(true);
    }
  }, [gameState?.status, gameEndData]);

  // Once the room has been active (warmup/launching/in-progress) we never re-show
  // the loading overlay — prevents it flashing back between series games.
  const gameEverActiveRef = useRef(false);
  if (
    gameState?.status === "warmup" ||
    gameState?.status === "launching" ||
    gameState?.status === "in-progress"
  ) {
    gameEverActiveRef.current = true;
  }
  const showLoading = loadingStep !== "warmup-ready" && !gameEverActiveRef.current && (
    !gameState || (
      gameState.status !== "in-progress" &&
      gameState.status !== "warmup" &&
      gameState.status !== "launching" &&
      gameState.status !== "finished" &&
      gameState.status !== "series-finished"
    )
  );

  return (
    <div className="min-w-[320px] max-w-[1920px] w-full mx-auto relative h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="game-canvas-container" />

      {showLoading && (
        <LoadingProgress
          currentStep={loadingStep}
          stepProgress={connectionState === "connected" ? 0.5 : 0.2}
          error={loadingError}
        />
      )}

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between pointer-events-none z-[60] flex-wrap p-[clamp(8px,2vw,16px)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className={cn("w-2.5 h-2.5 rounded-full", connectionState === "connected" ? "bg-theme-green pulse" : "bg-theme-red")}
            />
            <span className="font-mono uppercase text-theme-muted text-[clamp(9px,1.5vw,11px)]">
              {isSpectating ? "SPECTATING" : connectionState}
            </span>
            {isSpectating && (
              <span
                className="rounded-full border px-2 py-0.5 bg-purple-27 text-theme-purple border-purple-33 text-[clamp(9px,1.5vw,11px)]"
              >
                SPECTATING
              </span>
            )}
          </div>
          {/* Active round modifier badges */}
          {(gameState?.activeModifierIds?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1">
              {(gameState!.activeModifierIds as unknown as string[]).map((id: string) => {
                const mod = MODIFIER_MAP.get(id);
                if (!mod) return null;
                return (
                  <span
                    key={id}
                    data-testid={`modifier-badge-${id}`}
                    title={mod.description}
                    className="flex items-center gap-1 rounded-full border font-mono px-[7px] py-0.5 bg-black/70 text-theme-yellow border-yellow-40 text-[clamp(9px,1.2vw,11px)]"
                  >
                    {mod.icon && <span>{mod.icon}</span>}
                    {mod.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center">
          {gameState && (
            <div className="font-mono font-bold text-theme-text text-[clamp(14px,3vw,24px)]">
              {Math.ceil(Math.max(0, gameState.timer))}s
            </div>
          )}
          {seriesLabel && (
            <div className="font-mono text-theme-muted text-[clamp(10px,1.5vw,12px)]">{seriesLabel}</div>
          )}
          <div className="font-mono text-theme-muted text-[clamp(9px,1.5vw,11px)]">
            {alivePlayers.length}/{playerList.length} alive
          </div>
          {gameState && (gameState.spectatorCount ?? 0) > 0 && (
            <div className="text-theme-purple text-[clamp(9px,1.5vw,11px)]">{gameState.spectatorCount} watching</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 items-end">
          <Link
            to="/game"
            className="rounded-md border no-underline min-h-[32px] flex items-center pointer-events-auto bg-black/60 text-theme-muted border-border-c p-[clamp(3px,0.5vw,4px)_clamp(8px,1vw,12px)] text-[clamp(9px,1.2vw,12px)]"
          >
            Exit
          </Link>
          {/* Series wins scoreboard */}
          {gameState && (gameState.targetWins ?? 1) > 1 && playerList.length > 0 && (
            <div className="rounded-lg bg-black/[0.65] text-theme-text p-[clamp(4px,1vw,10px)] text-[clamp(10px,1.5vw,12px)]">
              {playerList.map((p) => (
                <div key={p.id} className="flex gap-1.5 items-center">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-theme-muted max-w-[clamp(60px,12vw,100px)]">
                    {p.username}
                  </span>
                  <span className="font-bold font-mono">
                    {gameState.seriesWins?.get(p.userId) ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pre-match countdown (3-2-1 → Let It Rip!) */}
      {gameState && (
        <Countdown status={gameState.status} timer={gameState.timer} />
      )}

      {/* Launch phase overlay */}
      {gameState?.status === "launching" && !gameEndData && (
        <LaunchPhase
          launchTimer={gameState.launchTimer ?? LAUNCH_DURATION_S}
          launchTilt={isSpectating ? 0 : launchState.tilt}
          launchPosition={isSpectating ? 0.5 : launchState.position}
          launchPower={isSpectating ? 0 : launchState.power}
          chargingStarted={isSpectating ? false : launchState.chargingStarted}
          launched={isSpectating ? false : launchState.launched}
          failed={isSpectating ? false : (myBeyblade?.launchFailed ?? false)}
          isSpectating={isSpectating}
          myBeyId={myBeyblade?.id ?? null}
          beyblades={beyblades}
          arena={gameState.arena}
          launcherType={launcherType}
        />
      )}
      {/* Minimap — toggle with M key; reads from beyGhosts (Phase 27) */}
      <Minimap
        gameState={gameState}
        beyGhosts={gameState?.beyGhosts}
        selfId={myBeyblade?.id ?? null}
        viewportCm={viewportCm}
        floorInfo={floorInfo}
        myFloorIndex={myFloorIndex}
      />

      {/* Camera zoom controls — top-right under Exit */}
      <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      {/* Controls legend — bottom-left, dismissable */}
      <ControlsLegend
        controlLockedUntilMs={myBeyblade?.controlLockedUntilMs}
        lockSource={myBeyblade?.controlLockSource}
      />

      {/* Spectator: show all player bars; click a row to follow that beyblade. */}
      {isSpectating && playerList.length > 0 && (
        <div className="absolute flex flex-col gap-1.5 pointer-events-auto z-10 max-h-[60vh] overflow-y-auto top-[60px] right-[clamp(8px,2vw,16px)]">
          <div className="text-[10px] uppercase tracking-[0.06em] mb-0.5 text-theme-muted">
            Watching — click to follow
          </div>
          {playerList.map((p) => {
            const hpPct = (p.health / Math.max(1, p.maxHealth)) * 100;
            const hpBarClass = p.health / Math.max(1, p.maxHealth) > 0.5 ? "bg-theme-green" : "bg-theme-red";
            return (
              <div
                key={p.id}
                onClick={() => setSpectatorFollowId(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSpectatorFollowId(p.id); }}
                className={cn(
                  "rounded-lg border cursor-pointer p-[8px_12px] min-w-[clamp(120px,20vw,200px)]",
                  spectatorFollowId === p.id ? "bg-green-20 border-theme-green" : "bg-[rgba(15,23,42,0.85)] border-border-c",
                  p.isActive ? "opacity-100" : "opacity-50"
                )}
              >
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-theme-muted max-w-[clamp(60px,12vw,100px)]">{p.username}</span>
                  <span className="text-[10px] hud-type-text" style={{ "--tc": `#${(TYPE_COLORS[p.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}` } as React.CSSProperties}>{p.type}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-bg3">
                  <div
                    className={`h-full rounded-full transition-[width] duration-150 w-pct ${hpBarClass}`}
                    style={{ "--pct": `${hpPct}%` } as React.CSSProperties}
                  />
                </div>
                {!p.isActive && <p className="text-[10px] mt-1 font-bold text-center text-theme-red">OUT</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Non-spectator opponent health bars */}
      {!isSpectating && playerList.length > 1 && (
        <div className="absolute flex flex-col gap-1.5 pointer-events-none z-10 max-h-[60vh] overflow-y-auto top-[60px] right-[clamp(8px,2vw,16px)]">
          {playerList
            .filter((p) => p.userId !== userId)
            .map((opp) => {
              const oppHpPct = (opp.health / Math.max(1, opp.maxHealth)) * 100;
              const oppHpBarClass = opp.health / Math.max(1, opp.maxHealth) > 0.5 ? "bg-theme-green" : opp.health / Math.max(1, opp.maxHealth) > 0.25 ? "bg-theme-yellow" : "bg-theme-red";
              return (
                <div
                  key={opp.id}
                  className={cn(
                    "rounded-lg border bg-[rgba(15,23,42,0.85)] p-[8px_12px] min-w-[clamp(120px,20vw,200px)]",
                    opp.isActive ? "opacity-100 border-border-c" : "opacity-50 border-bg3"
                  )}
                >
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-theme-muted max-w-[clamp(60px,12vw,100px)]">{opp.username}</span>
                    <span className="text-[10px] hud-type-text" style={{ "--tc": `#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}` } as React.CSSProperties}>{opp.type}</span>
                  </div>
                  {(opp as any).elementTypes?.length > 0 && (
                    <div className="flex gap-[3px] mb-1">
                      {((opp as any).elementTypes as ElementType[]).map((et: ElementType) => (
                        <span key={et} title={et} className="text-[11px] rounded hud-type-border hud-type-text hud-type-bg border px-1 py-0" style={{ "--tc": ELEMENT_COLORS[et] } as React.CSSProperties}>
                          {ELEMENT_ICONS[et]}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-full h-2 rounded-full overflow-hidden bg-bg3">
                    <div
                      className={`h-full rounded-full transition-[width] duration-150 w-pct ${oppHpBarClass}`}
                      style={{ "--pct": `${oppHpPct}%` } as React.CSSProperties}
                    />
                  </div>
                  {!opp.isActive && <p className="text-center text-[10px] mt-1 font-bold text-theme-red">ELIMINATED</p>}
                </div>
              );
            })}
        </div>
      )}

      {/* My stats bottom */}
      {myBeyblade && !isSpectating && (() => {
        const myHpPct = (myBeyblade.health / Math.max(1, myBeyblade.maxHealth)) * 100;
        const myHpBarClass = myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.5 ? "bg-theme-green" : myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.25 ? "bg-theme-yellow" : "bg-theme-red";
        const mySpinPct = (myBeyblade.spin / Math.max(1, myBeyblade.maxSpin)) * 100;
        return (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 p-[clamp(8px,2vw,16px)]">
            <div className="mx-auto rounded-xl border bg-[rgba(15,23,42,0.85)] border-border-c p-[clamp(8px,2vw,12px)] [max-width:min(320px,90vw)]">
              <div className="flex justify-between mb-1 text-theme-muted text-[clamp(10px,1.5vw,12px)]">
                <span className="font-mono">{myBeyblade.username} (you)</span>
                <div className="flex items-center gap-1">
                  {((myBeyblade as any).elementTypes as ElementType[] | undefined)?.map((et: ElementType) => (
                    <span key={et} title={et} className="text-[12px] hud-type-text" style={{ "--tc": ELEMENT_COLORS[et] } as React.CSSProperties}>{ELEMENT_ICONS[et]}</span>
                  ))}
                  <span className="capitalize hud-type-text" style={{ "--tc": `#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6, "0")}` } as React.CSSProperties}>{myBeyblade.type}</span>
                </div>
              </div>
              <div className="mb-1.5">
                <div className="flex justify-between mb-1 text-[clamp(9px,1.5vw,11px)]">
                  <span className="text-theme-red">HP</span>
                  <span className="font-mono text-theme-text">{Math.round(myHpPct)}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-bg3">
                  <div
                    className={`h-full rounded-full transition-[width] duration-150 w-pct ${myHpBarClass}`}
                    style={{ "--pct": `${myHpPct}%` } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className="mb-1.5">
                <div className="flex justify-between mb-1 text-[clamp(9px,1.5vw,11px)]">
                  <span className="text-theme-blue">Spin</span>
                  <span className="font-mono text-theme-text">{Math.round(mySpinPct)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-bg3">
                  <div
                    className="h-full rounded-full transition-[width] duration-150 bg-theme-blue w-pct"
                    style={{ "--pct": `${mySpinPct}%` } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className={cn("text-center font-mono text-[clamp(9px,1.5vw,11px)]", stabilityColor)}>{stabilityLabel}</div>
            </div>
          </div>
        );
      })()}

      {/* SpecialMoveHUD */}
      {myBeyblade && !isSpectating && (() => {
        const move = resolveSpecialMove((myBeyblade as any).specialMoveId, myBeyblade.type);
        if (!move) return null;
        return (
          <SpecialMoveHUD
            myBeyblade={myBeyblade}
            specialMoveData={{
              id: move.id,
              name: move.name,
              iconEmoji: move.iconEmoji,
              visual: { screenFlashColor: TYPE_FLASH[myBeyblade.type] ?? "#ffffff" },
            }}
            lastSpecialMoveFired={lastSpecialMove}
          />
        );
      })()}

      {/* ComboHUD */}
      <ComboHUD
        lastCombo={lastCombo}
        attachedComboIds={myBeyblade?.comboIds}
        cooldowns={mapToRecord(myBeyblade?.comboCooldowns)}
        power={myBeyblade?.power}
        comboMap={comboMap}
      />

      {/* BXScoreHUD — only visible on scoring-mode arenas */}
      <BXScoreHUD
        scoringMode={(gameState as any)?.scoringMode}
        pointsTarget={(gameState as any)?.pointsTarget}
        playerPoints={(gameState as any)?.playerPoints}
        beyblades={beyblades as any}
        myUserId={userId}
      />

      {/* BeyLink QTE prompts: escape trap, hijack initiation, attacker block, control-loss banner */}
      {!isSpectating && (
        <BeyLinkHijackHUD
          hijackQTE={beyLinkHijackQTE}
          hijackBlockQTE={beyLinkHijackBlockQTE}
          onBlock={sendHijackBlock}
          escapeQTE={beyLinkQTE}
          onEscape={sendBeyLinkQTEInput}
          controlLoss={beyLinkControlLoss}
        />
      )}

      {/* PartModesHUD — only renders if myBeyblade has activePartConfigs (2.5D). */}
      {!isSpectating && myBeyblade && (
        <PartModesHUD myBeyblade={myBeyblade as any} room={room as any} />
      )}

      {/* Floor-group HUD — only shown when arena belongs to a multi-floor group */}
      {floorInfo.length > 1 && (
        <FloorHUD
          totalFloors={floorInfo.length}
          currentFloorIndex={myFloorIndex}
          floors={floorInfo}
        />
      )}

      {/* Floor transition overlay — shown while bey crosses a corridor/ramp/pit/portal/trampoline */}
      {floorTransition && (
        <FloorTransitionOverlay
          {...floorTransition}
          visible={true}
        />
      )}

      {/* Link alignment HUD — shown at bottom center when links are misaligned */}
      {linkAlignments.length > 0 && linkAlignments.some(l => l.alignmentStatus !== "always_open") && (
        <LinkAlignmentHUD links={linkAlignments} />
      )}

      {/* Game-end inter-game overlay */}
      {gameEndData && (
        <div className="fixed inset-0 flex items-center justify-center z-[80] bg-black/75">
          <div className="text-center">
            <p className="text-[14px] font-semibold mb-1 text-theme-yellow">Game {gameEndData.gameNumber} Complete</p>
            <p className="text-[22px] font-black text-theme-text">
              {playerList.find((p) => p.userId === gameEndData.winner)?.username ?? gameEndData.winner} wins!
            </p>
            <div className="mt-3 flex gap-4 justify-center">
              {Object.entries(gameEndData.seriesScore).map(([uid, wins]) => {
                const player = playerList.find((p) => p.userId === uid);
                return (
                  <div key={uid} className="text-center">
                    <p className="text-[12px] text-theme-muted">{player?.username ?? uid}</p>
                    <p className="text-[28px] font-black font-mono text-theme-text">{wins}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[12px] mt-3 text-theme-faint">Next game starting...</p>
          </div>
        </div>
      )}

      {/* Series-end overlay */}
      {(gameState?.status === "series-finished" || seriesEndData) && !gameEndData && (
        <div className="fixed inset-0 flex items-center justify-center z-[80] bg-black/[0.88]">
          <div className="text-center max-w-[400px]">
            <div className="text-[64px] mb-3">
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "🏆" : "💀"}
            </div>
            <h2 className="text-[36px] font-black mb-3 tracking-tight text-theme-text">
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "VICTORY!" : "DEFEATED"}
            </h2>
            {gameState?.targetWins && gameState.targetWins > 1 && (
              <div className="flex gap-6 justify-center mb-5">
                {playerList.map((p) => (
                  <div key={p.id} className="text-center">
                    <p className="text-[12px] text-theme-muted">{p.username}</p>
                    <p className="text-[32px] font-black font-mono text-theme-text">
                      {gameState.seriesWins?.get(p.userId) ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Link to="/game/battle/lobby" className="px-6 py-3 rounded-xl font-bold no-underline bg-theme-red text-white">
                Play Again
              </Link>
              <Link to="/game" className="px-6 py-3 rounded-xl font-bold no-underline bg-bg3 text-theme-text">
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Single-game finished overlay (BO1 only) */}
      {gameState?.status === "finished" && !gameEndData && !seriesEndData && (gameState.targetWins ?? 1) <= 1 && (
        <div className="fixed inset-0 flex items-center justify-center z-[80] bg-black/85">
          <div className="text-center max-w-[420px]">
            <div className="text-[60px] mb-4">
              {gameState.winner === userId ? "🏆" : isSpectating ? "🏁" : "💀"}
            </div>
            <h2 className="text-[40px] font-black tracking-tight mb-2 text-theme-text">
              {isSpectating
                ? `${playerList.find((p) => p.userId === gameState.winner)?.username ?? "?"} wins!`
                : gameState.winner === userId ? "VICTORY!" : "DEFEATED"}
            </h2>
            <div className="flex gap-3 justify-center">
              <Link to="/game/battle/lobby" className="px-6 py-3 rounded-xl font-bold no-underline bg-theme-red text-white">
                {isSpectating ? "Lobby" : "Play Again"}
              </Link>
              <Link to="/game" className="px-6 py-3 rounded-xl font-bold no-underline bg-bg3 text-theme-text">
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* QTE Overlay (Phase Y) */}
      {!isSpectating && (
        <QTEOverlay
          prompt={qtePrompt}
          onKeyPress={sendQTEInput}
          onDismiss={() => setQTEPrompt(null)}
        />
      )}

      {/* Collision QTE Power Meter (Phase 29) */}
      {!isSpectating && collisionQTEActive && (
        <CollisionQTEOverlay
          active={collisionQTEActive}
          power={collisionQTEPowerLocal}
          maxPower={150}
          canFireSpecial={collisionCanFireSpecial}
          qteMultiplier={collisionQTEMultiplier}
          currentSP={myBeyblade?.power ?? 0}
          onMash={sendCollisionQTEMash}
          onFireSpecial={() => {
            sendCollisionQTEFireSpecial();
            setCollisionCanFireSpecial(false);
            setCollisionQTEActive(false);
          }}
        />
      )}

      {/* Split-screen cinematic (Phase 29 — collision-triggered) */}
      {splitScreenData && (
        <SplitScreenCinematic
          data={splitScreenData}
          eliminatedBeyIds={splitScreenEliminated}
          onEnd={() => setSplitScreenData(null)}
        />
      )}

      {/* Anime overlays */}
      <BurstOverlay visible={burstVisible} onComplete={() => setBurstVisible(false)} />
      <KOOverlay visible={koVisible.visible} type={koVisible.type} onComplete={() => setKoVisible({ visible: false, type: "ko" })} />
      <LaunchCinematic active={gameState?.status === "launching" && !gameEndData} power={myBeyblade?.launchPower ?? 0} />
      <BitBeastCinematic imageUrl={bitBeastCinematic.imageUrl} moveName={bitBeastCinematic.moveName} visible={bitBeastCinematic.visible} />
      <VictoryOverlay
        visible={victoryVisible}
        winnerName={playerList.find((b) => b.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? ""}
        winnerType={playerList.find((b) => b.userId === (seriesEndData?.winner ?? gameState?.winner))?.type ?? "balanced"}
        onDismiss={() => setVictoryVisible(false)}
      />

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div className="fixed inset-0 flex items-center justify-center z-[80] bg-black/85">
          <div className="text-center">
            <div className="spin w-12 h-12 rounded-full mx-auto mb-4 border-4 border-theme-red border-t-transparent" />
            <p className="text-theme-text">
              {connectionState === "connecting" ? "Joining battle..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <div className="mt-4">
                <p className="text-[13px] mb-2 text-theme-faint">Could not join room</p>
                <Link to="/game/battle/lobby" className="block px-4 py-2 rounded-lg no-underline text-[13px] bg-theme-red text-white">
                  Back to Lobby
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
