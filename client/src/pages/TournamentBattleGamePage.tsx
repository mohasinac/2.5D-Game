import { useRef, useEffect, useState, useMemo } from "react";
import { TouchControls } from "@/components/game/TouchControls";
import { Link, useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from "@/types/game";
import { SoundManager } from "@/game/audio/SoundManager";
import { C, alpha } from "@/styles/theme";
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
import { Countdown } from "@/components/game/Countdown";
import { LaunchPhase } from "@/components/game/LaunchPhase";
import { useLaunchInput } from "@/game/hooks/useLaunchInput";

const ROUND_NAMES: Record<number, string> = { 1: "Round 1", 2: "Semifinals", 3: "Final" };
const TYPE_FLASH: Record<string, string> = { attack: "#ff4444", defense: "#4488ff", stamina: "#44ff88", balanced: "#ffcc44" };

export function TournamentBattleGamePage() {
  const { tournamentId, matchId } = useParams<{ tournamentId: string; matchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { settings } = useGame();
  const { currentUser } = useAuth();
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();

  const mode = modeFromPath(location.pathname);
  const spectate = searchParams.get("spectate") === "true";
  const userId = currentUser?.uid ?? settings.userId ?? "guest";

  const [colyseusRoomId, setColyseusRoomId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load bracket doc to get colyseusRoomId
  useEffect(() => {
    if (!matchId) return;
    getDoc(doc(db, COLLECTIONS.TOURNAMENT_BRACKETS, matchId)).then((snap) => {
      if (!snap.exists()) { setLoadError("Match not found."); return; }
      const data = snap.data();
      if (!data.colyseusRoomId) { setLoadError("Room not open yet."); return; }
      setColyseusRoomId(data.colyseusRoomId);
    }).catch(() => setLoadError("Failed to load match."));
  }, [matchId]);

  const [gameEndData, setGameEndData] = useState<{ winner: string; gameNumber: number; seriesScore: Record<string, number> } | null>(null);
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);
  const [seriesEndData, setSeriesEndData] = useState<{ winner: string; seriesScore: Record<string, number> } | null>(null);

  const colyseusOptions = useMemo(() => ({
    spectate,
    tournamentId,
    matchId,
    userId,
    username: settings.username ?? "Player",
    beybladeId: settings.beybladeId ?? "default",
  }), [spectate, tournamentId, matchId, userId, settings.username, settings.beybladeId]);

  const { connectionState, gameState, beyblades, myBeyblade, isSpectating, room, connect, disconnect, sendInput, beyLinkQTE, beyLinkControlLoss, sendBeyLinkQTEInput, beyLinkHijackQTE, beyLinkHijackBlockQTE, sendHijackBlock, loadingStep, loadingError, visualEventQueue, floorInfo, myFloorIndex, linkAlignments, floorTransition } =
    useColyseus({
      roomName: roomNameFor(mode, "tournament"),
      roomId: colyseusRoomId ?? undefined,
      options: colyseusOptions,
      autoConnect: false,
      onGameEnd: setGameEndData,
      onSeriesEnd: setSeriesEndData,
    });

  // Connect once we have the room ID
  useEffect(() => {
    if (colyseusRoomId) connect();
    return () => { disconnect(); };
  }, [colyseusRoomId]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const spectatorFollowIdRef = useRef<string | null>(null);
  useEffect(() => { spectatorFollowIdRef.current = spectatorFollowId; }, [spectatorFollowId]);

  useEffect(() => {
    if (isSpectating) {
      if (spectatorFollowIdRef.current && beyblades.has(spectatorFollowIdRef.current)) {
        setControlledBeyblade(spectatorFollowIdRef.current);
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
  }, [myBeyblade?.id, isSpectating, beyblades, setControlledBeyblade]);

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

  // Dismiss game-end overlay after 4 seconds
  useEffect(() => {
    if (!gameEndData) return;
    const id = setTimeout(() => setGameEndData(null), 4000);
    return () => clearTimeout(id);
  }, [gameEndData]);

  useGameInput(sendInput, !isSpectating && connectionState === "connected" && gameState?.status === "in-progress");
  const launchState = useLaunchInput(room ?? null, gameState?.status ?? "");

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  const roundLabel = gameState?.roundNumber ? (ROUND_NAMES[gameState.roundNumber] ?? `Round ${gameState.roundNumber}`) : "";
  const seriesLabel = gameState && (gameState.targetWins ?? 1) > 1
    ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}`
    : "";

  if (loadError) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: C.red, fontSize: 18, marginBottom: 16 }}>{loadError}</p>
          <Link to={`/game/tournament/${tournamentId}`} style={{ color: C.blue, textDecoration: "none" }}>
            Back to Lobby
          </Link>
        </div>
      </div>
    );
  }

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
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted, fontFamily: "monospace" }}>
              {isSpectating ? "SPECTATING" : "CONNECTED"}
            </span>
          </div>
          {gameState?.tournamentName && (
            <span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: C.yellow, fontWeight: 700 }}>{gameState.tournamentName}</span>
          )}
          {roundLabel && (
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted }}>{roundLabel}</span>
          )}
        </div>

        {/* Center: timer + series */}
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
            <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.purple }}>
              {gameState.spectatorCount} watching
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <Link
            to={`/game/tournament/${tournamentId}`}
            style={{ pointerEvents: "auto", padding: "clamp(3px, 0.5vw, 4px) clamp(8px, 1vw, 12px)", fontSize: "clamp(9px, 1.2vw, 12px)", background: "rgba(0,0,0,0.6)", color: C.muted, borderRadius: 6, border: `1px solid ${C.border}`, textDecoration: "none" }}
          >
            Lobby
          </Link>
          {isSpectating && (
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", background: alpha(C.purple, 0.27), color: C.purple, padding: "2px 8px", borderRadius: 99, border: `1px solid ${alpha(C.purple, 0.33)}` }}>
              SPECTATING
            </span>
          )}
          {/* Series wins */}
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

      {/* Camera zoom controls — top-right under Exit */}
      <CameraControls onZoomIn={cameraZoomIn} onZoomOut={cameraZoomOut} onZoomReset={cameraZoomReset} />
      {/* Controls legend — bottom-left, dismissable */}
      <ControlsLegend
        controlLockedUntilMs={myBeyblade?.controlLockedUntilMs}
        lockSource={myBeyblade?.controlLockSource}
      />

      {/* Spectator all-player list — click to follow */}
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
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(9px, 1.5vw, 11px)", marginBottom: 6 }}>
                <span style={{ color: C.muted, overflow: "hidden", maxWidth: "clamp(60px, 12vw, 100px)", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.username}{p.isAI ? " (AI)" : ""}
                </span>
              </div>
              <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 150ms",
                  width: `${(p.health / Math.max(1, p.maxHealth)) * 100}%`,
                  background: p.health / Math.max(1, p.maxHealth) > 0.5 ? C.green : p.health / Math.max(1, p.maxHealth) > 0.25 ? C.yellow : C.red,
                }} />
              </div>
              {!p.isActive && <p style={{ color: C.red, fontSize: 10, marginTop: 4, fontWeight: 700, textAlign: "center" }}>OUT</p>}
            </div>
          ))}
        </div>
      )}

      {/* Non-spectator opponent bars */}
      {!isSpectating && myBeyblade && playerList.length > 1 && (
        <div style={{ position: "absolute", top: 60, right: "clamp(8px, 2vw, 16px)", display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none", zIndex: 10, maxHeight: "60vh", overflowY: "auto" }}>
          {playerList.filter((p) => p.userId !== userId).map((opp) => (
            <div key={opp.id} style={{
              background: "rgba(15,23,42,0.85)", borderRadius: 8, border: `1px solid ${opp.isActive ? C.border : C.bg3}`,
              padding: "8px 12px", minWidth: "clamp(120px, 20vw, 200px)", opacity: opp.isActive ? 1 : 0.5,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(9px, 1.5vw, 11px)", marginBottom: 6 }}>
                <span style={{ color: C.muted, overflow: "hidden", maxWidth: "clamp(60px, 12vw, 100px)", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {opp.username}{opp.isAI ? " (AI)" : ""}
                </span>
                <span style={{ color: `#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}`, fontSize: "clamp(8px, 1.2vw, 10px)" }}>{opp.type}</span>
              </div>
              <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 150ms",
                  width: `${(opp.health / Math.max(1, opp.maxHealth)) * 100}%`,
                  background: opp.health / Math.max(1, opp.maxHealth) > 0.5 ? C.green : C.red,
                }} />
              </div>
              {!opp.isActive && <p style={{ color: C.red, fontSize: 10, marginTop: 4, fontWeight: 700, textAlign: "center" }}>ELIMINATED</p>}
            </div>
          ))}
        </div>
      )}

      {/* My stats bottom */}
      {myBeyblade && !isSpectating && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(8px, 2vw, 16px)", pointerEvents: "none", zIndex: 10 }}>
          <div style={{ maxWidth: "min(320px, 90vw)", margin: "0 auto", background: "rgba(15,23,42,0.85)", borderRadius: 12, border: `1px solid ${C.border}`, padding: "clamp(8px, 2vw, 12px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 1.5vw, 12px)", color: C.muted, marginBottom: 8 }}>
              <span style={{ fontFamily: "monospace" }}>{myBeyblade.username} (you)</span>
              <span style={{ textTransform: "capitalize", color: `#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6, "0")}` }}>{myBeyblade.type}</span>
            </div>
            <Bar label="HP" value={myBeyblade.health} max={myBeyblade.maxHealth} color={myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.5 ? C.green : myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.25 ? C.yellow : C.red} />
            <Bar label="Spin" value={myBeyblade.spin} max={myBeyblade.maxSpin} color={C.blue} />
            <div style={{ fontSize: "clamp(9px, 1.5vw, 11px)", textAlign: "center", fontFamily: "monospace", color: stabilityColor, marginTop: 4 }}>{stabilityLabel}</div>
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
            <p style={{ color: C.yellow, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Game {gameEndData.gameNumber} Complete
            </p>
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
            <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
            <p style={{ color: C.yellow, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Tournament Match Over</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: C.text, marginBottom: 20 }}>
              {playerList.find((p) => p.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? seriesEndData?.winner ?? gameState?.winner} wins!
            </h2>
            {gameState?.targetWins && gameState.targetWins > 1 && (
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 24 }}>
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
            <Link
              to={`/game/tournament/${tournamentId}`}
              style={{ display: "inline-block", padding: "12px 28px", background: C.yellow, color: C.bg0, borderRadius: 12, fontWeight: 700, textDecoration: "none" }}
            >
              Back to Lobby
            </Link>
          </div>
        </div>
      )}

      {/* 3-2-1 countdown + "Let It Rip!" flash */}
      {gameState && (
        <Countdown status={gameState.status} timer={gameState.timer} />
      )}

      {/* Launch phase overlay */}
      {gameState?.status === "launching" && !isSpectating && (
        <LaunchPhase
          launchTimer={gameState.launchTimer ?? 5}
          launchTilt={launchState.tilt}
          launchPosition={launchState.position}
          launchPower={launchState.power}
          chargingStarted={launchState.chargingStarted}
          launched={launchState.launched}
          failed={myBeyblade?.launchFailed ?? false}
          isSpectating={false}
        />
      )}
      {gameState?.status === "launching" && isSpectating && (
        <LaunchPhase
          launchTimer={gameState.launchTimer ?? 5}
          launchTilt={0}
          launchPosition={0.5}
          launchPower={0}
          chargingStarted={false}
          launched={false}
          failed={false}
          isSpectating={true}
        />
      )}

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && !loadError && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", zIndex: 50 }}>
          <div style={{ textAlign: "center" }}>
            <div className="spin" style={{ width: 48, height: 48, border: `4px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px" }} />
            <p style={{ color: C.text }}>
              {!colyseusRoomId ? "Loading match..." : connectionState === "connecting" ? "Joining tournament room..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <div style={{ marginTop: 16 }}>
                <p style={{ color: C.faint, fontSize: 13, marginBottom: 8 }}>Could not join room</p>
                <Link to={`/game/tournament/${tournamentId}`} style={{ display: "block", padding: "8px 16px", background: C.yellow, color: C.bg0, borderRadius: 8, textDecoration: "none", fontSize: 13 }}>
                  Back to Lobby
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {!isSpectating && <TouchControls />}
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
        <span style={{ color }}>{label}</span>
        <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round(value)}</span>
      </div>
      <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, transition: "width 150ms", width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
