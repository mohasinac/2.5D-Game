import { useRef, useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from "@/types/game";
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
import { Countdown } from "@/components/game/Countdown";
import { LaunchPhase } from "@/components/game/LaunchPhase";
import { useLaunchInput } from "@/game/hooks/useLaunchInput";
import { Minimap } from "@/components/game/Minimap";
import { SoundManager } from "@/game/audio/SoundManager";
import { LoadingProgress } from "@/components/LoadingProgress";
import { QTEOverlay } from "@/components/game/QTEOverlay";
import { CollisionQTEOverlay } from "@/components/game/CollisionQTEOverlay";
import { SplitScreenCinematic } from "@/components/game/SplitScreenCinematic";
import type { QTEPromptData } from "@/game/hooks/useColyseus";
import type { SplitScreenCinematicData } from "@/types/game";
import { ELEMENT_ICONS, ELEMENT_COLORS, type ElementType } from "@/types/elementTypes";

const TYPE_FLASH: Record<string, string> = { attack: "#ff4444", defense: "#4488ff", stamina: "#44ff88", balanced: "#ffcc44" };

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
      onQTEPrompt: (data) => { if (!isSpectating) setQTEPrompt(data); },
      onQTESuccess: () => setQTEPrompt(null),
      onQTEExpired: () => setQTEPrompt(null),
      onSplitScreenCinematic: (data) => { setSplitScreenData(data); setSplitScreenEliminated(new Set()); },
    });

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

  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades, visualEventQueue); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, gameState, beyblades]);

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
    });
    room.onMessage("burst", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnBurstParticles(x, y);
      SoundManager.play("spin-out"); // reuse spin-out SFX until burst_sfx is available
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
  }, [room, spawnCollisionParticles, spawnSpinOutParticles, spawnBurstParticles, spawnDamageNumber, physicsToScreen, playSpecialMoveEffect, playComboEffect]);

  // Auto-dismiss game-end overlay + play victory/defeat sound.
  useEffect(() => {
    if (!gameEndData) return;
    const isWinner = gameEndData.winner === userId;
    SoundManager.play(isWinner ? "victory" : "defeat");
    const id = setTimeout(() => setGameEndData(null), 4000);
    return () => clearTimeout(id);
  }, [gameEndData, userId]);

  useGameInput(sendInput, !isSpectating && connectionState === "connected" && gameState?.status === "in-progress");

  const launchState = useLaunchInput(room ?? null, gameState?.status ?? "");

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  const seriesLabel = gameState && (gameState.targetWins ?? 1) > 1
    ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}`
    : "";

  // Show the loading overlay until the room reports gameplay status.
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
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>
              {isSpectating ? "SPECTATING" : connectionState}
            </span>
            {isSpectating && (
              <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", background: alpha(C.purple, 0.27), color: C.purple, padding: "2px 8px", borderRadius: 99, border: `1px solid ${alpha(C.purple, 0.33)}` }}>
                SPECTATING
              </span>
            )}
          </div>
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
          {gameState && (
            <div style={{ color: C.text, fontFamily: "monospace", fontSize: "clamp(14px, 3vw, 24px)", fontWeight: 700 }}>
              {Math.ceil(Math.max(0, gameState.timer))}s
            </div>
          )}
          {seriesLabel && (
            <div style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: C.muted, fontFamily: "monospace" }}>{seriesLabel}</div>
          )}
          <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted, fontFamily: "monospace" }}>
            {alivePlayers.length}/{playerList.length} alive
          </div>
          {gameState && (gameState.spectatorCount ?? 0) > 0 && (
            <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.purple }}>{gameState.spectatorCount} watching</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <Link
            to="/game"
            style={{ pointerEvents: "auto", padding: "clamp(3px, 0.5vw, 4px) clamp(8px, 1vw, 12px)", fontSize: "clamp(9px, 1.2vw, 12px)", background: "rgba(0,0,0,0.6)", color: C.muted, borderRadius: 6, border: `1px solid ${C.border}`, textDecoration: "none" }}
          >
            Exit
          </Link>
          {/* Series wins scoreboard */}
          {gameState && (gameState.targetWins ?? 1) > 1 && playerList.length > 0 && (
            <div style={{ background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "clamp(4px, 1vw, 10px)", fontSize: "clamp(10px, 1.5vw, 12px)", color: C.text }}>
              {playerList.map((p) => (
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

      {/* Pre-match countdown (3-2-1 → Let It Rip!) */}
      {gameState && (
        <Countdown status={gameState.status} timer={gameState.timer} />
      )}

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
        <div style={{ position: "absolute", top: 60, right: "clamp(8px, 2vw, 16px)", display: "flex", flexDirection: "column", gap: 6, pointerEvents: "auto", zIndex: 10, maxHeight: "60vh", overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
            Watching — click to follow
          </div>
          {playerList.map((p) => (
            <div
              key={p.id}
              onClick={() => setSpectatorFollowId(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSpectatorFollowId(p.id); }}
              style={{
                background: spectatorFollowId === p.id ? "rgba(34,197,94,0.18)" : "rgba(15,23,42,0.85)",
                borderRadius: 8,
                border: `1px solid ${spectatorFollowId === p.id ? C.green : C.border}`,
                padding: "8px 12px", minWidth: "clamp(120px, 20vw, 200px)",
                opacity: p.isActive ? 1 : 0.5,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: C.muted, overflow: "hidden", maxWidth: "clamp(60px, 12vw, 100px)", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.username}</span>
                <span style={{ color: `#${(TYPE_COLORS[p.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}`, fontSize: 10 }}>{p.type}</span>
              </div>
              <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 150ms",
                  width: `${(p.health / Math.max(1, p.maxHealth)) * 100}%`,
                  background: p.health / Math.max(1, p.maxHealth) > 0.5 ? C.green : C.red,
                }} />
              </div>
              {!p.isActive && <p style={{ color: C.red, fontSize: 10, marginTop: 4, fontWeight: 700, textAlign: "center" }}>OUT</p>}
            </div>
          ))}
        </div>
      )}

      {/* Non-spectator opponent health bars */}
      {!isSpectating && playerList.length > 1 && (
        <div style={{ position: "absolute", top: 60, right: "clamp(8px, 2vw, 16px)", display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none", zIndex: 10, maxHeight: "60vh", overflowY: "auto" }}>
          {playerList
            .filter((p) => p.userId !== userId)
            .map((opp) => (
              <div key={opp.id} style={{
                background: "rgba(15,23,42,0.85)", borderRadius: 8, border: `1px solid ${opp.isActive ? C.border : C.bg3}`,
                padding: "8px 12px", minWidth: "clamp(120px, 20vw, 200px)", opacity: opp.isActive ? 1 : 0.5,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: C.muted, overflow: "hidden", maxWidth: "clamp(60px, 12vw, 100px)", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opp.username}</span>
                  <span style={{ color: `#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}`, fontSize: 10 }}>{opp.type}</span>
                </div>
                {(opp as any).elementTypes?.length > 0 && (
                  <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                    {((opp as any).elementTypes as ElementType[]).map((et: ElementType) => (
                      <span key={et} title={et} style={{ fontSize: 11, color: ELEMENT_COLORS[et], background: `${ELEMENT_COLORS[et]}22`, border: `1px solid ${ELEMENT_COLORS[et]}55`, borderRadius: 4, padding: "0px 4px" }}>
                        {ELEMENT_ICONS[et]}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, transition: "width 150ms",
                    width: `${(opp.health / Math.max(1, opp.maxHealth)) * 100}%`,
                    background: opp.health / Math.max(1, opp.maxHealth) > 0.5 ? C.green : opp.health / Math.max(1, opp.maxHealth) > 0.25 ? C.yellow : C.red,
                  }} />
                </div>
                {!opp.isActive && <p style={{ color: C.red, textAlign: "center", fontSize: 10, marginTop: 4, fontWeight: 700 }}>ELIMINATED</p>}
              </div>
            ))}
        </div>
      )}

      {/* My stats bottom */}
      {myBeyblade && !isSpectating && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(8px, 2vw, 16px)", pointerEvents: "none", zIndex: 10 }}>
          <div style={{ maxWidth: "min(320px, 90vw)", margin: "0 auto", background: "rgba(15,23,42,0.85)", borderRadius: 12, border: `1px solid ${C.border}`, padding: "clamp(8px, 2vw, 12px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 1.5vw, 12px)", color: C.muted, marginBottom: 4 }}>
              <span style={{ fontFamily: "monospace" }}>{myBeyblade.username} (you)</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {((myBeyblade as any).elementTypes as ElementType[] | undefined)?.map((et: ElementType) => (
                  <span key={et} title={et} style={{ fontSize: 12, color: ELEMENT_COLORS[et] }}>{ELEMENT_ICONS[et]}</span>
                ))}
                <span style={{ textTransform: "capitalize", color: `#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6, "0")}` }}>{myBeyblade.type}</span>
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(9px, 1.5vw, 11px)", marginBottom: 4 }}>
                <span style={{ color: C.red }}>HP</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round((myBeyblade.health / Math.max(1, myBeyblade.maxHealth)) * 100)}</span>
              </div>
              <div style={{ width: "100%", height: 6, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, transition: "width 150ms", width: `${(myBeyblade.health / Math.max(1, myBeyblade.maxHealth)) * 100}%`, background: myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.5 ? C.green : myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.25 ? C.yellow : C.red }} />
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(9px, 1.5vw, 11px)", marginBottom: 4 }}>
                <span style={{ color: C.blue }}>Spin</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round((myBeyblade.spin / Math.max(1, myBeyblade.maxSpin)) * 100)}%</span>
              </div>
              <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: C.blue, borderRadius: 3, transition: "width 150ms", width: `${(myBeyblade.spin / Math.max(1, myBeyblade.maxSpin)) * 100}%` }} />
              </div>
            </div>
            <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", textAlign: "center", fontFamily: "monospace", color: stabilityColor }}>{stabilityLabel}</div>
          </div>
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
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", zIndex: 40 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: C.yellow, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Game {gameEndData.gameNumber} Complete</p>
            <p style={{ color: C.text, fontSize: 22, fontWeight: 900 }}>
              {playerList.find((p) => p.userId === gameEndData.winner)?.username ?? gameEndData.winner} wins!
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
              {Object.entries(gameEndData.seriesScore).map(([uid, wins]) => {
                const player = playerList.find((p) => p.userId === uid);
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

      {/* Series-end overlay */}
      {(gameState?.status === "series-finished" || seriesEndData) && !gameEndData && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", zIndex: 50 }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "🏆" : "💀"}
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: C.text, marginBottom: 12, letterSpacing: "-0.02em" }}>
              {(seriesEndData?.winner ?? gameState?.winner) === userId ? "VICTORY!" : "DEFEATED"}
            </h2>
            {gameState?.targetWins && gameState.targetWins > 1 && (
              <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 20 }}>
                {playerList.map((p) => (
                  <div key={p.id} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: C.muted }}>{p.username}</p>
                    <p style={{ fontSize: 32, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>
                      {gameState.seriesWins?.get(p.userId) ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link to="/game/battle/lobby" style={{ padding: "12px 24px", background: C.red, color: C.white, borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
                Play Again
              </Link>
              <Link to="/game" style={{ padding: "12px 24px", background: C.bg3, color: C.text, borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Single-game finished overlay (BO1 only) */}
      {gameState?.status === "finished" && !gameEndData && !seriesEndData && (gameState.targetWins ?? 1) <= 1 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", zIndex: 50 }}>
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>
              {gameState.winner === userId ? "🏆" : isSpectating ? "🏁" : "💀"}
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: C.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
              {isSpectating
                ? `${playerList.find((p) => p.userId === gameState.winner)?.username ?? "?"} wins!`
                : gameState.winner === userId ? "VICTORY!" : "DEFEATED"}
            </h2>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link to="/game/battle/lobby" style={{ padding: "12px 24px", background: C.red, color: C.white, borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
                {isSpectating ? "Lobby" : "Play Again"}
              </Link>
              <Link to="/game" style={{ padding: "12px 24px", background: C.bg3, color: C.text, borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
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

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", zIndex: 50 }}>
          <div style={{ textAlign: "center" }}>
            <div className="spin" style={{ width: 48, height: 48, border: `4px solid ${C.red}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px" }} />
            <p style={{ color: C.text }}>
              {connectionState === "connecting" ? "Joining battle..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <div style={{ marginTop: 16 }}>
                <p style={{ color: C.faint, fontSize: 13, marginBottom: 8 }}>Could not join room</p>
                <Link to="/game/battle/lobby" style={{ display: "block", padding: "8px 16px", background: C.red, color: C.white, borderRadius: 8, textDecoration: "none", fontSize: 13 }}>
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
