import { useRef, useEffect, useState, useMemo } from "react";
import { TouchControls } from "@/components/game/TouchControls";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from "@/types/game";
import { SoundManager } from "@/game/audio/SoundManager";
import { C, alpha } from "@/styles/theme";
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
import { useLaunchInput } from "@/game/hooks/useLaunchInput";
import type { QTEPromptData } from "@/game/hooks/useColyseus";
import type { SplitScreenCinematicData } from "@/types/game";

interface AIBattleLocationState {
  beybladeId?: string;
  aiBeybladeId?: string;
  arenaId?: string;
  aiDifficulty?: string;
  bestOf?: 1 | 3 | 5;
  /** Admin-only AI vs AI mode — admin spectates while two AIs fight. */
  aiVsAi?: boolean;
  aiP1BeybladeId?: string;
  aiP2BeybladeId?: string;
  aiP1Difficulty?: string;
  aiP2Difficulty?: string;
  matchId?: string;
}

const TYPE_FLASH: Record<string, string> = { attack: "#ff4444", defense: "#4488ff", stamina: "#44ff88", balanced: "#ffcc44" };

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

  const colyseusOptions = useMemo(() => ({
    beybladeId:   loc.beybladeId   ?? settings.beybladeId ?? "default",
    aiBeybladeId: loc.aiBeybladeId ?? "default",
    arenaId:      loc.arenaId      ?? settings.arenaId    ?? "default",
    aiDifficulty: loc.aiDifficulty ?? "medium",
    bestOf:       loc.bestOf       ?? 1,
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
      onQTEPrompt: (data) => { if (!spectate) setQTEPrompt(data); },
      onQTESuccess: () => setQTEPrompt(null),
      onQTEExpired: () => setQTEPrompt(null),
      onSplitScreenCinematic: (data) => { setSplitScreenData(data); setSplitScreenEliminated(new Set()); },
    });

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

  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades, visualEventQueue); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, gameState, beyblades]);

  useEffect(() => {
    if (!room) return;
    room.onMessage("collision", (data: any) => {
      // Server sends physics-space coordinates — convert to screen space first
      const { x: cx, y: cy } = physicsToScreen(data.contactPoint.x, data.contactPoint.y);
      spawnCollisionParticles(cx, cy, 0xff4444, 0x44aaff);
      if (data.damage1 > 0) spawnDamageNumber(cx - 12, cy - 8, data.damage1, 0xff5555);
      if (data.damage2 > 0) spawnDamageNumber(cx + 12, cy - 8, data.damage2, 0x55aaff);
      SoundManager.play("collision");
    });
    room.onMessage("spin-out", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnSpinOutParticles(x, y, TYPE_COLORS[data.type] ?? 0xffffff);
    });
    room.onMessage("burst", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnBurstParticles(x, y);
    });
    room.onMessage("special-move", (data: any) => {
      playSpecialMoveEffect(data.playerId, data.type, data.x, data.y, data.facing);
      if (data.playerId === myBeyblade?.id) {
        setLastSpecialMove(data.type);
      }
    });
    room.onMessage("combo", (data: any) => {
      playComboEffect(data.playerId, data.comboName);
      if (data.playerId === myBeyblade?.id) {
        setLastCombo({ name: data.comboName, timestamp: Date.now() });
      }
    });
  }, [room, spawnCollisionParticles, spawnSpinOutParticles, spawnBurstParticles, spawnDamageNumber, physicsToScreen, playSpecialMoveEffect, playComboEffect]);

  // Auto-dismiss game-end overlay
  useEffect(() => {
    if (!gameEndData) return;
    const id = setTimeout(() => setGameEndData(null), 4000);
    return () => clearTimeout(id);
  }, [gameEndData]);

  useGameInput(sendInput, !isSpectating && connectionState === "connected" && gameState?.status === "in-progress");

  const launchState = useLaunchInput(room ?? null, gameState?.status ?? "");

  const myStability    = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";

  const allBeyblades = Array.from(beyblades.values());
  const aiBey = allBeyblades.find((b) => b.userId === "__ai__" || b.isAI);

  const isSeries = gameState && (gameState.targetWins ?? 1) > 1;
  const seriesLabel = isSeries ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}` : "";

  const timerSeconds = (gameState?.timer != null && isFinite(gameState.timer))
    ? Math.ceil(Math.max(0, gameState.timer))
    : null;

  const showLoading = !gameState || (gameState.status !== "in-progress" && gameState.status !== "warmup" && gameState.status !== "launching" && gameState.status !== "finished" && gameState.status !== "series-finished");

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#000", overflow: "hidden" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {showLoading && (
        <LoadingProgress
          currentStep={loadingStep}
          stepProgress={connectionState === "connected" ? 0.5 : 0.2}
          error={loadingError}
        />
      )}

      {/* HUD top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "clamp(8px, 2vw, 16px)", pointerEvents: "none", zIndex: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted, fontFamily: "monospace" }}>{isSpectating ? "SPECTATING" : "VS AI"}</span>
          </div>
          {isSpectating && (
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", background: alpha(C.purple, 0.27), color: C.purple, padding: "2px 8px", borderRadius: 99, border: `1px solid ${alpha(C.purple, 0.33)}` }}>
              SPECTATING
            </span>
          )}
          {/* Active round modifier badges */}
          {(gameState?.activeModifierIds?.length ?? 0) > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {(gameState!.activeModifierIds as unknown as string[]).map((id: string) => {
                const mod = MODIFIER_MAP.get(id);
                if (!mod) return null;
                return (
                  <span
                    key={id}
                    data-testid={`modifier-badge-${id}`}
                    title={mod.description}
                    style={{
                      fontSize: "clamp(9px, 1.2vw, 11px)",
                      background: "rgba(0,0,0,0.7)",
                      color: C.yellow,
                      padding: "2px 7px",
                      borderRadius: 99,
                      border: `1px solid ${alpha(C.yellow, 0.4)}`,
                      fontFamily: "monospace",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    {mod.icon && <span>{mod.icon}</span>}
                    {mod.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          {timerSeconds !== null && (
            <div style={{ color: C.text, fontFamily: "monospace", fontSize: "clamp(14px, 3vw, 24px)", fontWeight: 700 }}>
              {timerSeconds}s
            </div>
          )}
          {seriesLabel && (
            <div style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: C.muted, fontFamily: "monospace" }}>{seriesLabel}</div>
          )}
          {gameState && (gameState.spectatorCount ?? 0) > 0 && (
            <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.purple }}>{gameState.spectatorCount} watching</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <Link
            to="/game/ai-battle"
            style={{ pointerEvents: "auto", padding: "clamp(3px, 0.5vw, 4px) clamp(8px, 1vw, 12px)", fontSize: "clamp(9px, 1.2vw, 12px)", background: "rgba(0,0,0,0.6)", color: C.muted, borderRadius: 6, border: `1px solid ${C.border}`, textDecoration: "none", marginTop: "clamp(20px, 3vw, 28px)" }}
          >
            Exit
          </Link>
          {/* Series score */}
          {isSeries && allBeyblades.length > 0 && (
            <div style={{ background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "clamp(4px, 1vw, 10px)", fontSize: "clamp(10px, 1.5vw, 12px)", color: C.text }}>
              {allBeyblades.map((p) => (
                <div key={p.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: C.muted, maxWidth: "clamp(60px, 12vw, 100px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.username}
                  </span>
                  <span style={{ fontWeight: 700, fontFamily: "monospace" }}>
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
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(8px, 2vw, 16px)", pointerEvents: "none", zIndex: 10 }}>
          <div style={{ maxWidth: "min(480px, 90vw)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
            <StatCard beyblade={myBeyblade} label="YOU" accentColor={C.blue} stabilityColor={stabilityColor} stabilityLabel={stabilityLabel} />
            <div style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 900, color: C.faint, textAlign: "center" }}>VS</div>
            {aiBey ? (
              <StatCard beyblade={aiBey} label="CPU" accentColor={C.red} stabilityColor={getBeybladeStability(aiBey) > 0.4 ? C.green : C.red} stabilityLabel={aiBey.username} />
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* Spectator view */}
      {isSpectating && allBeyblades.length > 0 && (
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, padding: "0 clamp(8px, 2vw, 16px)", pointerEvents: "auto", zIndex: 10 }}>
          <div style={{ maxWidth: "min(480px, 90vw)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
            {allBeyblades.filter((b) => !b.isAI).slice(0, 1).map((b) => (
              <div key={b.id} onClick={() => setSpectatorFollowId(b.id)} style={{ cursor: "pointer", outline: spectatorFollowId === b.id ? `2px solid ${C.green}` : "none", borderRadius: 8 }}>
                <StatCard beyblade={b} label="PLAYER" accentColor={C.blue} stabilityColor={getBeybladeStability(b) > 0.4 ? C.green : C.red} stabilityLabel={b.username} />
              </div>
            ))}
            <div style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 900, color: C.faint, textAlign: "center" }}>VS</div>
            {aiBey ? (
              <div onClick={() => setSpectatorFollowId(aiBey.id)} style={{ cursor: "pointer", outline: spectatorFollowId === aiBey.id ? `2px solid ${C.green}` : "none", borderRadius: 8 }}>
                <StatCard beyblade={aiBey} label="CPU" accentColor={C.red} stabilityColor={getBeybladeStability(aiBey) > 0.4 ? C.green : C.red} stabilityLabel={aiBey.username} />
              </div>
            ) : <div />}
          </div>
          <div style={{ textAlign: "center", color: C.muted, fontSize: 10, marginTop: 6 }}>Click to follow</div>
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
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", zIndex: 40 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: C.yellow, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Game {gameEndData.gameNumber} Complete</p>
            <p style={{ color: C.text, fontSize: 22, fontWeight: 900 }}>
              {allBeyblades.find((p) => p.userId === gameEndData.winner)?.username ?? gameEndData.winner} wins!
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
              {Object.entries(gameEndData.seriesScore).map(([uid, wins]) => {
                const player = allBeyblades.find((p) => p.userId === uid);
                return (
                  <div key={uid} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: C.muted }}>{player?.username ?? uid}</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>{wins}</p>
                  </div>
                );
              })}
            </div>
            <p style={{ color: C.faint, fontSize: 12, marginTop: 12 }}>Next game starting...</p>
          </div>
        </div>
      )}

      {/* Series-end / single-game finished overlay */}
      {(gameState?.status === "series-finished" || gameState?.status === "finished" || seriesEndData) && !gameEndData && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", zIndex: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "🏆" : isSpectating ? "🏁" : "💀"}
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: (seriesEndData?.winner ?? gameState?.winner) === userId ? C.yellow : C.red, marginBottom: 8 }}>
              {isSpectating
                ? `${allBeyblades.find((p) => p.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? "?"} wins!`
                : (seriesEndData?.winner ?? gameState?.winner) === userId ? "Victory!" : "Defeated!"}
            </h2>
            {isSeries && (
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16 }}>
                {allBeyblades.map((b) => (
                  <div key={b.id} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: C.muted }}>{b.username}</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>
                      {gameState.seriesWins?.get(b.userId) ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => navigate("/game/ai-battle")}
                style={{ padding: "12px 28px", background: C.purple, color: C.white, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" }}
              >
                Play Again
              </button>
              <Link to="/game" style={{ padding: "12px 28px", background: C.bg3, color: C.text, borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
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
          launchTimer={gameState.launchTimer ?? 5}
          launchTilt={isSpectating ? 0 : launchState.tilt}
          launchPosition={isSpectating ? 0.5 : launchState.position}
          launchPower={isSpectating ? 0 : launchState.power}
          chargingStarted={isSpectating ? false : launchState.chargingStarted}
          launched={isSpectating ? false : launchState.launched}
          failed={isSpectating ? false : (myBeyblade?.launchFailed ?? false)}
          isSpectating={isSpectating}
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

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", zIndex: 20 }}>
          <div style={{ textAlign: "center" }}>
            {connectionState !== "error" ? (
              <div className="spin" style={{ width: 48, height: 48, border: `4px solid ${C.purple}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px" }} />
            ) : (
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            )}
            <p style={{ color: C.text }}>
              {connectionState === "error" ? "Could not connect to game server" : "Loading AI battle..."}
            </p>
            {connectionState === "error" && (
              <button onClick={connect} style={{ marginTop: 16, padding: "8px 20px", background: C.purple, color: C.white, borderRadius: 8, cursor: "pointer", border: "none" }}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}
      {!isSpectating && <TouchControls />}
    </div>
  );
}

function StatCard({ beyblade, label, accentColor, stabilityColor, stabilityLabel }: {
  beyblade: any; label: string; accentColor: string; stabilityColor: string; stabilityLabel: string;
}) {
  const hp   = Math.round(beyblade.health ?? 0);
  const maxHp = Math.max(1, beyblade.maxHealth ?? beyblade.maxStamina ?? 100);
  const spin = Math.round(Math.min(100, ((beyblade.spin ?? 0) / Math.max(1, beyblade.maxSpin ?? 1)) * 100));

  return (
    <div style={{ background: "rgba(15,23,42,0.85)", borderRadius: 12, border: `1px solid ${accentColor}44`, padding: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
          <span style={{ color: C.red }}>HP</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{hp}</span>
        </div>
        <div style={{ height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, background: hp / maxHp > 0.5 ? C.green : hp / maxHp > 0.25 ? C.yellow : C.red, width: `${Math.min(100, (hp / maxHp) * 100)}%`, transition: "width 150ms" }} />
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
          <span style={{ color: C.blue }}>Spin</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{spin}%</span>
        </div>
        <div style={{ height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, background: C.blue, width: `${spin}%`, transition: "width 150ms" }} />
        </div>
      </div>
      <div style={{ fontSize: 9, color: stabilityColor, fontFamily: "monospace", marginTop: 6 }}>{stabilityLabel}</div>
    </div>
  );
}
