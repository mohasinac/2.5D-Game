import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from "@/types/game";
import type { ServerGameState } from "@/types/game";
import { SoundManager } from "@/game/audio/SoundManager";
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
import { LoadingProgress } from "@/components/LoadingProgress";
import { QTEOverlay } from "@/components/game/QTEOverlay";
import { CollisionQTEOverlay } from "@/components/game/CollisionQTEOverlay";
import { SplitScreenCinematic } from "@/components/game/SplitScreenCinematic";
import { Countdown } from "@/components/game/Countdown";
import { LaunchPhase } from "@/components/game/LaunchPhase";
import { TouchControlsGBLayout } from "@/components/game/TouchControlsGBLayout";
import { LAUNCH_DURATION_S } from "@/shared/constants/gameConstants";
import { useLaunchInput } from "@/game/hooks/useLaunchInput";
import type { QTEPromptData } from "@/game/hooks/useColyseus";
import type { SplitScreenCinematicData } from "@/types/game";
import { cn } from "@/lib/cn";
import BurstOverlay from "@/components/game/BurstOverlay";
import LaunchCinematic from "@/components/game/LaunchCinematic";
import VictoryOverlay from "@/components/game/VictoryOverlay";
import KOOverlay from "@/components/game/KOOverlay";

interface AIBattleLocationState {
  beybladeId?: string;
  aiBeybladeId?: string;
  arenaId?: string;
  aiDifficulty?: string;
  bestOf?: 1 | 3 | 5;
  /** Number of AI opponents (default 1, max 7 for load testing). */
  aiCount?: number;
  /** Admin-only AI vs AI mode — admin spectates while two AIs fight. */
  aiVsAi?: boolean;
  aiP1BeybladeId?: string;
  aiP2BeybladeId?: string;
  aiP1Difficulty?: string;
  aiP2Difficulty?: string;
  matchId?: string;
  launcherType?: "string" | "ripcord";
}

const TYPE_FLASH: Record<string, string> = { attack: "#ff4444", defense: "#4488ff", stamina: "#44ff88", balanced: "#ffcc44" };

// Default arena game state — used as fallback before Colyseus connects so the
// renderer initialises and draws the arena background from frame 1 (no black screen).
const DEFAULT_GAME_STATE: ServerGameState = {
  matchId: "default", mode: "ai-battle", status: "waiting",
  timer: 0, startTime: 0, winner: "", beyblades: new Map(),
  arena: {
    id: "default", name: "Standard Arena",
    width: 1080, height: 1080, shape: "circle", theme: "default",
    rotation: 0, wallEnabled: true, wallAngle: 0,
    worldBgType: "none", worldBgColor: "", worldBgImageUrl: "",
    worldBgOpacity: 1.0, worldBgFit: "cover", worldBgBlurPx: 0,
  },
};

export function AIBattleGamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();
  const { settings } = useGame();
  const { currentUser } = useAuth();

  const mode = modeFromPath(location.pathname);
  const querySpectate = searchParams.get("spectate") === "true";
  const userId = currentUser?.uid ?? settings.userId ?? "guest";

  const loc = (location.state ?? {}) as AIBattleLocationState;
  // AI-vs-AI rooms have no human seat — the admin watches as a spectator.
  const spectate = querySpectate || loc.aiVsAi === true;

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

  const isSpectatingRef = useRef(spectate);
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
    beybladeId:   loc.beybladeId   ?? settings.beybladeId ?? "default",
    aiBeybladeId: loc.aiBeybladeId ?? "default",
    arenaId:      loc.arenaId      ?? settings.arenaId    ?? "default",
    aiDifficulty: loc.aiDifficulty ?? "medium",
    bestOf:       loc.bestOf       ?? 1,
    aiCount:      loc.aiCount,
    username:     settings.username ?? "Player",
    userId,
    spectate,
    // AI-vs-AI extension — passed through to AIBattleRoom.
    aiVsAi:          loc.aiVsAi === true,
    aiP1BeybladeId:  loc.aiP1BeybladeId,
    aiP2BeybladeId:  loc.aiP2BeybladeId,
    aiP1Difficulty:  loc.aiP1Difficulty,
    aiP2Difficulty:  loc.aiP2Difficulty,
    matchId:         loc.matchId,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const { connectionState, gameState, beyblades, myBeyblade, isSpectating, room, connect, disconnect, sendInput, sendQTEInput, beyLinkQTE, beyLinkControlLoss, sendBeyLinkQTEInput, beyLinkHijackQTE, beyLinkHijackBlockQTE, sendHijackBlock, loadingStep, loadingError, visualEventQueue, floorInfo, myFloorIndex, linkAlignments, floorTransition,
    collisionQTEData, collisionQTEPower, collisionQTESpecialPrompt, sendCollisionQTEMash, sendCollisionQTEFireSpecial,
  } =
    useColyseus({
      roomName: roomNameFor(mode, "aiBattle"),
      options: colyseusOptions,
      autoConnect: false,
      onGameEnd: setGameEndData,
      onSeriesEnd: setSeriesEndData,
      onQTEPrompt: handleQTEPrompt,
      onQTESuccess: handleQTESuccess,
      onQTEExpired: handleQTEExpired,
      onSplitScreenCinematic: handleSplitScreenCinematic,
    });

  isSpectatingRef.current = isSpectating || spectate;

  useEffect(() => {
    if (collisionQTEData && !spectate) {
      setCollisionQTEActive(true);
      setCollisionQTEPowerLocal(0);
      setCollisionCanFireSpecial(false);
    }
  }, [collisionQTEData, spectate]);

  useEffect(() => {
    if (!spectate) setCollisionQTEPowerLocal(collisionQTEPower);
  }, [collisionQTEPower, spectate]);

  useEffect(() => {
    if (collisionQTESpecialPrompt && !spectate) {
      setCollisionCanFireSpecial(true);
      setCollisionQTEMultiplier(collisionQTESpecialPrompt.qteMultiplier);
    }
  }, [collisionQTESpecialPrompt, spectate]);

  useEffect(() => {
    if (!room) return;
    room.onMessage("split-screen-participant-out", (data: { beyId: string }) => {
      setSplitScreenEliminated(prev => new Set([...prev, data.beyId]));
    });
    room.onMessage("split-screen-end", () => setSplitScreenData(null));
  }, [room]);

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
  } = usePixiRenderer(containerRef, mode);

  const [spectatorFollowId, setSpectatorFollowId] = useState<string | null>(null);

  useEffect(() => {
    if (isSpectating) {
      if (spectatorFollowId && beyblades.has(spectatorFollowId)) {
        setControlledBeyblade(spectatorFollowId);
      } else {
        const first = Array.from(beyblades.values()).find(b => !b.isAI && b.isActive)
          ?? Array.from(beyblades.values())[0];
        if (first) {
          setSpectatorFollowId(first.id);
          setControlledBeyblade(first.id);
        }
      }
    } else {
      setControlledBeyblade(myBeyblade?.id ?? null);
    }
  }, [myBeyblade?.id, isSpectating, beyblades, setControlledBeyblade /* spectatorFollowId intentionally not in deps to avoid loop */]);

  useEffect(() => {
    connect();
    return () => { disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      spawnCollisionParticles(cx, cy, 0xff4444, 0x44aaff);
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

  const launcherType = loc.launcherType ?? "string";
  const launchState = useLaunchInput(room ?? null, gameState?.status ?? "", launcherType);

  const myStability    = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColorClass = myStability > 0.6 ? "text-theme-green" : myStability > 0.3 ? "text-theme-yellow" : "text-theme-red";
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";

  const allBeyblades = Array.from(beyblades.values());
  const aiBey = allBeyblades.find((b) => b.userId === "__ai__" || b.isAI);
  // For multi-AI battles (aiCount > 1) collect all AI opponents.
  const allAiBeys = allBeyblades.filter((b) => b.isAI);

  const isSeries = gameState && (gameState.targetWins ?? 1) > 1;
  const seriesLabel = isSeries ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}` : "";

  const timerSeconds = (gameState?.timer != null && isFinite(gameState.timer))
    ? Math.ceil(Math.max(0, gameState.timer))
    : null;

  useEffect(() => {
    if (gameState?.status === "series-finished" || (gameState?.status === "finished" && !gameEndData)) {
      setVictoryVisible(true);
    }
  }, [gameState?.status, gameEndData]);

  const showLoading = !gameState || (gameState.status !== "in-progress" && gameState.status !== "warmup" && gameState.status !== "launching" && gameState.status !== "finished" && gameState.status !== "series-finished");

  return (
    <div className="min-w-[400px] max-w-[1920px] w-full mx-auto relative h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,100vh)] h-[min(100vw,100vh)]" />

      {showLoading && (
        <LoadingProgress
          currentStep={loadingStep}
          stepProgress={connectionState === "connected" ? 0.5 : 0.2}
          error={loadingError}
        />
      )}

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between pointer-events-none z-10 flex-wrap p-[clamp(8px,2vw,16px)]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className={cn("w-2 h-2 rounded-full", connectionState === "connected" ? "bg-theme-green pulse" : "bg-theme-red")}
            />
            <span className="font-mono text-theme-muted text-[clamp(9px,1.5vw,11px)]">
              {isSpectating ? "SPECTATING" : "VS AI"}
            </span>
          </div>
          {isSpectating && (
            <span
              className="rounded-full border px-2 py-0.5 bg-purple-27 text-theme-purple border-purple-33 text-[clamp(9px,1.5vw,11px)]"
            >
              SPECTATING
            </span>
          )}
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
          {timerSeconds !== null && (
            <div className="font-mono font-bold text-theme-text text-[clamp(14px,3vw,24px)]">
              {timerSeconds}s
            </div>
          )}
          {seriesLabel && (
            <div className="font-mono text-theme-muted text-[clamp(10px,1.5vw,12px)]">{seriesLabel}</div>
          )}
          {gameState && (gameState.spectatorCount ?? 0) > 0 && (
            <div className="text-theme-purple text-[clamp(9px,1.5vw,11px)]">{gameState.spectatorCount} watching</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 items-end">
          <Link
            to="/game/ai-battle"
            className="pointer-events-auto rounded-md border no-underline bg-black/60 text-theme-muted border-border-c p-[clamp(3px,0.5vw,4px)_clamp(8px,1vw,12px)] text-[clamp(9px,1.2vw,12px)] mt-[clamp(20px,3vw,28px)]"
          >
            Exit
          </Link>
          {/* Series score */}
          {isSeries && allBeyblades.length > 0 && (
            <div className="rounded-lg bg-black/[0.65] text-theme-text p-[clamp(4px,1vw,10px)] text-[clamp(10px,1.5vw,12px)]">
              {allBeyblades.map((p) => (
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

      {/* Camera zoom controls — top-right under Exit */}
      <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      {/* Controls legend — bottom-left, dismissable */}
      <ControlsLegend
        controlLockedUntilMs={myBeyblade?.controlLockedUntilMs}
        lockSource={myBeyblade?.controlLockSource}
      />

      {/* HUD bottom */}
      {myBeyblade && !isSpectating && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 p-[clamp(8px,2vw,16px)]">
          {allAiBeys.length <= 1 ? (
            // Classic 1v1 layout
            <div className="mx-auto grid gap-3 items-center [max-width:min(480px,90vw)] grid-cols-[1fr_auto_1fr]">
              <StatCard beyblade={myBeyblade} label="YOU" accentColorClass="text-theme-blue" accentBorderClass="border-theme-blue/30" stabilityColorClass={stabilityColorClass} stabilityLabel={stabilityLabel} />
              <div className="font-black text-theme-faint text-center text-[clamp(14px,2vw,18px)]">VS</div>
              {aiBey ? (
                <StatCard beyblade={aiBey} label="CPU" accentColorClass="text-theme-red" accentBorderClass="border-theme-red/30" stabilityColorClass={getBeybladeStability(aiBey) > 0.4 ? "text-theme-green" : "text-theme-red"} stabilityLabel={aiBey.username} />
              ) : (
                <div />
              )}
            </div>
          ) : (
            // Multi-AI layout: YOU on left, opponents scroll on right
            <div className="mx-auto flex gap-2.5 items-end [max-width:min(720px,96vw)]">
              <StatCard beyblade={myBeyblade} label="YOU" accentColorClass="text-theme-blue" accentBorderClass="border-theme-blue/30" stabilityColorClass={stabilityColorClass} stabilityLabel={stabilityLabel} />
              <div className="font-black text-theme-faint self-center px-1 text-[clamp(12px,1.8vw,16px)]">
                VS {allAiBeys.length}
              </div>
              <div className="flex gap-1.5 overflow-x-auto flex-1 items-end">
                {allAiBeys.map((ai, idx) => (
                  <div key={ai.id} className="min-w-0 flex-none">
                    <StatCard
                      beyblade={ai}
                      label={`CPU${idx + 1}`}
                      accentColorClass="text-theme-red"
                      accentBorderClass="border-theme-red/30"
                      stabilityColorClass={getBeybladeStability(ai) > 0.4 ? "text-theme-green" : "text-theme-red"}
                      stabilityLabel={ai.username}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Spectator view */}
      {isSpectating && allBeyblades.length > 0 && (
        <div className="absolute bottom-4 left-0 right-0 pointer-events-auto z-10 px-[clamp(8px,2vw,16px)]">
          <div className="mx-auto grid gap-3 items-center [max-width:min(480px,90vw)] grid-cols-[1fr_auto_1fr]">
            {allBeyblades.filter((b) => !b.isAI).slice(0, 1).map((b) => (
              <div
                key={b.id}
                onClick={() => setSpectatorFollowId(b.id)}
                className={`cursor-pointer rounded-lg ${spectatorFollowId === b.id ? "outline outline-2 outline-theme-green" : ""}`}
              >
                <StatCard beyblade={b} label="PLAYER" accentColorClass="text-theme-blue" accentBorderClass="border-theme-blue/30" stabilityColorClass={getBeybladeStability(b) > 0.4 ? "text-theme-green" : "text-theme-red"} stabilityLabel={b.username} />
              </div>
            ))}
            <div className="font-black text-theme-faint text-center text-[clamp(14px,2vw,18px)]">VS</div>
            {aiBey ? (
              <div
                onClick={() => setSpectatorFollowId(aiBey.id)}
                className={`cursor-pointer rounded-lg ${spectatorFollowId === aiBey.id ? "outline outline-2 outline-theme-green" : ""}`}
              >
                <StatCard beyblade={aiBey} label="CPU" accentColorClass="text-theme-red" accentBorderClass="border-theme-red/30" stabilityColorClass={getBeybladeStability(aiBey) > 0.4 ? "text-theme-green" : "text-theme-red"} stabilityLabel={aiBey.username} />
              </div>
            ) : <div />}
          </div>
          <div className="text-center text-theme-muted text-[10px] mt-1.5">Click to follow</div>
        </div>
      )}

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

      {/* PartModesHUD — player-switchable 2.5D part configurations.
          Renders nothing when myBeyblade has no part configs (non-2.5D matches). */}
      {!isSpectating && myBeyblade && (
        <PartModesHUD myBeyblade={myBeyblade as any} room={room as any} />
      )}

      {floorInfo.length > 1 && (
        <FloorHUD totalFloors={floorInfo.length} currentFloorIndex={myFloorIndex} floors={floorInfo} />
      )}
      {floorTransition && <FloorTransitionOverlay {...floorTransition} visible={true} />}
      {linkAlignments.length > 0 && linkAlignments.some(l => l.alignmentStatus !== "always_open") && (
        <LinkAlignmentHUD links={linkAlignments} />
      )}

      {/* Game-end inter-game overlay */}
      {gameEndData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-40">
          <div className="text-center">
            <p className="text-[14px] font-semibold mb-1 text-theme-yellow">Game {gameEndData.gameNumber} Complete</p>
            <p className="text-[22px] font-black text-theme-text">
              {allBeyblades.find((p) => p.userId === gameEndData.winner)?.username ?? gameEndData.winner} wins!
            </p>
            <div className="mt-3 flex gap-4 justify-center">
              {Object.entries(gameEndData.seriesScore).map(([uid, wins]) => {
                const player = allBeyblades.find((p) => p.userId === uid);
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

      {/* Series-end / single-game finished overlay */}
      {(gameState?.status === "series-finished" || gameState?.status === "finished" || seriesEndData) && !gameEndData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center">
            <div className="text-[72px] mb-4">
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "🏆" : isSpectating ? "🏁" : "💀"}
            </div>
            <h2
              className={`text-[32px] font-black mb-2 ${(seriesEndData?.winner ?? gameState?.winner) === userId ? "text-theme-yellow" : "text-theme-red"}`}
            >
              {isSpectating
                ? `${allBeyblades.find((p) => p.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? "?"} wins!`
                : (seriesEndData?.winner ?? gameState?.winner) === userId ? "Victory!" : "Defeated!"}
            </h2>
            {isSeries && (
              <div className="flex gap-4 justify-center mb-4">
                {allBeyblades.map((b) => (
                  <div key={b.id} className="text-center">
                    <p className="text-[12px] text-theme-muted">{b.username}</p>
                    <p className="text-[28px] font-black font-mono text-theme-text">
                      {gameState.seriesWins?.get(b.userId) ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/game/ai-battle")}
                className="px-7 py-3 bg-theme-purple text-white rounded-[10px] font-bold text-[14px] cursor-pointer border-none"
              >
                Play Again
              </button>
              <Link to="/game" className="px-7 py-3 bg-bg3 text-theme-text rounded-[10px] font-bold text-[14px] no-underline">
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pre-match countdown (3-2-1 → Let It Rip!) */}
      {gameState && <Countdown status={gameState.status} timer={gameState.timer} />}

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

      {/* QTE Overlay (Phase Y) */}
      {!spectate && (
        <QTEOverlay
          prompt={qtePrompt}
          onKeyPress={sendQTEInput}
          onDismiss={() => setQTEPrompt(null)}
        />
      )}

      {/* Collision QTE Power Meter (Phase 29) */}
      {!spectate && collisionQTEActive && (
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
      <VictoryOverlay
        visible={victoryVisible}
        winnerName={allBeyblades.find((b) => b.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? ""}
        winnerType={allBeyblades.find((b) => b.userId === (seriesEndData?.winner ?? gameState?.winner))?.type ?? "balanced"}
        onDismiss={() => setVictoryVisible(false)}
      />

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 z-20">
          <div className="text-center">
            {connectionState !== "error" ? (
              <div
                className="spin w-12 h-12 rounded-full mx-auto mb-4 border-4 border-theme-purple border-t-transparent"
              />
            ) : (
              <div className="text-[40px] mb-4">⚠️</div>
            )}
            <p className="text-theme-text">
              {connectionState === "error" ? "Could not connect to game server" : "Loading AI battle..."}
            </p>
            {connectionState === "error" && (
              <button
                onClick={connect}
                className="mt-4 px-5 py-2 bg-theme-purple text-white rounded-lg cursor-pointer border-none"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
      <TouchControlsGBLayout />
    </div>
  );
}

function StatCard({ beyblade, label, accentColorClass, accentBorderClass, stabilityColorClass, stabilityLabel }: {
  beyblade: any; label: string; accentColorClass: string; accentBorderClass: string; stabilityColorClass: string; stabilityLabel: string;
}) {
  const hp   = Math.round(beyblade.health ?? 0);
  const maxHp = Math.max(1, beyblade.maxHealth ?? beyblade.maxStamina ?? 100);
  const spin = Math.round(Math.min(100, ((beyblade.spin ?? 0) / Math.max(1, beyblade.maxSpin ?? 1)) * 100));

  const hpPct = Math.min(100, (hp / maxHp) * 100);
  const hpBarClass = hp / maxHp > 0.5 ? "bg-theme-green" : hp / maxHp > 0.25 ? "bg-theme-yellow" : "bg-theme-red";
  return (
    <div className={`rounded-xl p-2.5 bg-[rgba(15,23,42,0.85)] border ${accentBorderClass}`}>
      <div className={`text-[10px] font-bold tracking-[0.1em] mb-1.5 ${accentColorClass}`}>{label}</div>
      <div className="mb-1">
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="text-theme-red">HP</span>
          <span className="text-theme-text font-mono">{hp}</span>
        </div>
        <div className="h-2 bg-bg3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-150 w-pct ${hpBarClass}`}
            style={{ "--pct": `${hpPct}%` } as React.CSSProperties}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="text-theme-blue">Spin</span>
          <span className="text-theme-text font-mono">{spin}%</span>
        </div>
        <div className="h-2 bg-bg3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-theme-blue transition-[width] duration-150 w-pct"
            style={{ "--pct": `${spin}%` } as React.CSSProperties}
          />
        </div>
      </div>
      <div className={`text-[9px] font-mono mt-1.5 ${stabilityColorClass}`}>{stabilityLabel}</div>
    </div>
  );
}
