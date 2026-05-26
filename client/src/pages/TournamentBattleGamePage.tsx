import React, { useRef, useEffect, useState, useMemo } from "react";
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
  const stabilityColorClass = myStability > 0.6 ? "text-theme-green" : myStability > 0.3 ? "text-theme-yellow" : "text-theme-red";
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  const roundLabel = gameState?.roundNumber ? (ROUND_NAMES[gameState.roundNumber] ?? `Round ${gameState.roundNumber}`) : "";
  const seriesLabel = gameState && (gameState.targetWins ?? 1) > 1
    ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}`
    : "";

  if (loadError) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-theme-red text-[18px] mb-4">{loadError}</p>
          <Link to={`/game/tournament/${tournamentId}`} className="text-theme-blue no-underline">
            Back to Lobby
          </Link>
        </div>
      </div>
    );
  }

  const showLoading = !gameState || (gameState.status !== "in-progress" && gameState.status !== "warmup" && gameState.status !== "launching" && gameState.status !== "finished" && gameState.status !== "series-finished");

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {showLoading && (
        <LoadingProgress
          currentStep={loadingStep}
          stepProgress={connectionState === "connected" ? 0.5 : 0.2}
          error={loadingError}
        />
      )}

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-[clamp(8px,2vw,16px)] pointer-events-none z-10 flex-wrap">
        {/* Left */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionState === "connected" ? "bg-theme-green pulse" : "bg-theme-red"}`} />
            <span className="text-[clamp(9px,1.5vw,11px)] text-theme-muted font-mono">
              {isSpectating ? "SPECTATING" : "CONNECTED"}
            </span>
          </div>
          {gameState?.tournamentName && (
            <span className="text-[clamp(10px,1.5vw,12px)] text-theme-yellow font-bold">{gameState.tournamentName}</span>
          )}
          {roundLabel && (
            <span className="text-[clamp(9px,1.5vw,11px)] text-theme-muted">{roundLabel}</span>
          )}
        </div>

        {/* Center: timer + series */}
        <div className="text-center">
          {gameState && (
            <div className="text-theme-text font-mono text-[clamp(14px,3vw,24px)] font-bold">
              {Math.ceil(Math.max(0, gameState.timer))}s
            </div>
          )}
          {seriesLabel && (
            <div className="text-[clamp(10px,1.5vw,12px)] text-theme-muted font-mono">{seriesLabel}</div>
          )}
          <div className="text-[clamp(9px,1.5vw,11px)] text-theme-muted font-mono">
            {alivePlayers.length}/{playerList.length} alive
          </div>
          {gameState && (gameState.spectatorCount ?? 0) > 0 && (
            <div className="text-[clamp(9px,1.5vw,11px)] text-theme-purple">
              {gameState.spectatorCount} watching
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col gap-1.5 items-end">
          <Link
            to={`/game/tournament/${tournamentId}`}
            className="pointer-events-auto py-[clamp(3px,0.5vw,4px)] px-[clamp(8px,1vw,12px)] text-[clamp(9px,1.2vw,12px)] bg-black/60 text-theme-muted rounded-[6px] border border-border-c no-underline"
          >
            Lobby
          </Link>
          {isSpectating && (
            <span className="text-[clamp(9px,1.5vw,11px)] bg-purple-27 text-theme-purple py-0.5 px-2 rounded-[99px] border border-purple-33">
              SPECTATING
            </span>
          )}
          {/* Series wins */}
          {gameState && (gameState.targetWins ?? 1) > 1 && playerList.length > 0 && (
            <div className="bg-black/[0.65] rounded-lg p-[clamp(4px,1vw,10px)] text-[clamp(10px,1.5vw,12px)] text-theme-text">
              {playerList.map((p) => (
                <div key={p.id} className="flex gap-1.5 items-center">
                  <span className="text-theme-muted max-w-[clamp(60px,12vw,100px)] overflow-hidden text-ellipsis whitespace-nowrap">
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

      {/* Spectator all-player list — click to follow */}
      {isSpectating && playerList.length > 0 && (
        <div className="absolute top-[60px] right-[clamp(8px,2vw,16px)] flex flex-col gap-1.5 pointer-events-auto z-10 max-h-[60vh] overflow-y-auto">
          <div className="text-[10px] text-theme-muted uppercase tracking-[0.06em] mb-0.5">
            Watching — click to follow
          </div>
          {playerList.map((p) => {
            const hpPct = (p.health / Math.max(1, p.maxHealth)) * 100;
            const hpColor = p.health / Math.max(1, p.maxHealth) > 0.5 ? "bg-theme-green" : p.health / Math.max(1, p.maxHealth) > 0.25 ? "bg-theme-yellow" : "bg-theme-red";
            return (
              <div
                key={p.id}
                onClick={() => setSpectatorFollowId(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSpectatorFollowId(p.id); }}
                className={`rounded-lg border p-[8px_12px] min-w-[clamp(120px,20vw,200px)] cursor-pointer ${spectatorFollowId === p.id ? "bg-green-10 border-theme-green" : "bg-[rgba(15,23,42,0.85)] border-border-c"} ${p.isActive ? "opacity-100" : "opacity-50"}`}
              >
                <div className="flex justify-between text-[clamp(9px,1.5vw,11px)] mb-1.5">
                  <span className="text-theme-muted overflow-hidden max-w-[clamp(60px,12vw,100px)] text-ellipsis whitespace-nowrap">
                    {p.username}{p.isAI ? " (AI)" : ""}
                  </span>
                </div>
                <div className="w-full h-[5px] bg-bg3 rounded-[3px] overflow-hidden">
                  <div
                    className={`h-full rounded-[3px] transition-[width] duration-150 ${hpColor} w-pct`}
                    style={{ "--pct": `${hpPct}%` } as React.CSSProperties}
                  />
                </div>
                {!p.isActive && <p className="text-theme-red text-[10px] mt-1 font-bold text-center">OUT</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Non-spectator opponent bars */}
      {!isSpectating && myBeyblade && playerList.length > 1 && (
        <div className="absolute top-[60px] right-[clamp(8px,2vw,16px)] flex flex-col gap-1.5 pointer-events-none z-10 max-h-[60vh] overflow-y-auto">
          {playerList.filter((p) => p.userId !== userId).map((opp) => {
            const hpRatio = opp.health / Math.max(1, opp.maxHealth);
            const hpPct = hpRatio * 100;
            const hpColor = hpRatio > 0.5 ? "bg-theme-green" : "bg-theme-red";
            return (
              <div key={opp.id} className={`bg-[rgba(15,23,42,0.85)] rounded-lg border p-[8px_12px] min-w-[clamp(120px,20vw,200px)] ${opp.isActive ? "opacity-100 border-border-c" : "opacity-50 border-bg3"}`}>
                <div className="flex justify-between text-[clamp(9px,1.5vw,11px)] mb-1.5">
                  <span className="text-theme-muted overflow-hidden max-w-[clamp(60px,12vw,100px)] text-ellipsis whitespace-nowrap">
                    {opp.username}{opp.isAI ? " (AI)" : ""}
                  </span>
                  {/* Dynamic runtime hex color — rule 4 exception */}
                  <span className="text-[clamp(8px,1.2vw,10px)] hud-type-text" style={{ "--tc": `#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}` } as React.CSSProperties}>{opp.type}</span>
                </div>
                <div className="w-full h-[5px] bg-bg3 rounded-[3px] overflow-hidden">
                  <div
                    className={`h-full rounded-[3px] transition-[width] duration-150 ${hpColor} w-pct`}
                    style={{ "--pct": `${hpPct}%` } as React.CSSProperties}
                  />
                </div>
                {!opp.isActive && <p className="text-theme-red text-[10px] mt-1 font-bold text-center">ELIMINATED</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* My stats bottom */}
      {myBeyblade && !isSpectating && (() => {
        const hpRatio = myBeyblade.health / Math.max(1, myBeyblade.maxHealth);
        const hpBarColor = hpRatio > 0.5 ? "bg-theme-green" : hpRatio > 0.25 ? "bg-theme-yellow" : "bg-theme-red";
        return (
          <div className="absolute bottom-0 left-0 right-0 p-[clamp(8px,2vw,16px)] pointer-events-none z-10">
            <div className="mx-auto bg-[rgba(15,23,42,0.85)] rounded-[12px] border border-border-c p-[clamp(8px,2vw,12px)] [max-width:min(320px,90vw)]">
              <div className="flex justify-between text-[clamp(10px,1.5vw,12px)] text-theme-muted mb-2">
                <span className="font-mono">{myBeyblade.username} (you)</span>
                {/* Dynamic runtime hex color — rule 4 exception */}
                <span className="capitalize hud-type-text" style={{ "--tc": `#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6, "0")}` } as React.CSSProperties}>{myBeyblade.type}</span>
              </div>
              <Bar label="HP" value={myBeyblade.health} max={myBeyblade.maxHealth} barColorClass={hpBarColor} />
              <Bar label="Spin" value={myBeyblade.spin} max={myBeyblade.maxSpin} barColorClass="bg-theme-blue" />
              <div className={`text-[clamp(9px,1.5vw,11px)] text-center font-mono mt-1 ${stabilityColorClass}`}>{stabilityLabel}</div>
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-40">
          <div className="text-center">
            <p className="text-theme-yellow text-[14px] font-semibold mb-1">
              Game {gameEndData.gameNumber} Complete
            </p>
            <p className="text-theme-text text-[22px] font-black">
              {playerList.find((p) => p.userId === gameEndData.winner)?.username ?? gameEndData.winner} wins!
            </p>
            <div className="mt-3 flex gap-4 justify-center">
              {Object.entries(gameEndData.seriesScore).map(([uid, wins]) => {
                const player = playerList.find((p) => p.userId === uid);
                return (
                  <div key={uid} className="text-center">
                    <p className="text-[12px] text-theme-muted">{player?.username ?? uid}</p>
                    <p className="text-[28px] font-black text-theme-text font-mono">{wins}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-theme-faint text-[12px] mt-3">Next game starting...</p>
          </div>
        </div>
      )}

      {/* Series-end overlay */}
      {(gameState?.status === "series-finished" || seriesEndData) && !gameEndData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/[0.88] z-50">
          <div className="text-center max-w-[400px]">
            <div className="text-[64px] mb-3">🏆</div>
            <p className="text-theme-yellow font-bold text-[16px] mb-1">Tournament Match Over</p>
            <h2 className="text-[36px] font-black text-theme-text mb-5">
              {playerList.find((p) => p.userId === (seriesEndData?.winner ?? gameState?.winner))?.username ?? seriesEndData?.winner ?? gameState?.winner} wins!
            </h2>
            {gameState?.targetWins && gameState.targetWins > 1 && (
              <div className="flex gap-5 justify-center mb-6">
                {playerList.map((p) => (
                  <div key={p.id} className="text-center">
                    <p className="text-[12px] text-theme-muted">{p.username}</p>
                    <p className="text-[32px] font-black text-theme-text font-mono">
                      {gameState.seriesWins?.get(p.userId) ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to={`/game/tournament/${tournamentId}`}
              className="inline-block py-3 px-7 bg-theme-yellow text-bg0 rounded-[12px] font-bold no-underline"
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
      {gameState?.status === "launching" && (
        <LaunchPhase
          launchTimer={gameState.launchTimer ?? 5}
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
        />
      )}

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 z-50">
          <div className="text-center">
            <div className="spin w-12 h-12 border-4 border-theme-yellow border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-theme-text">
              {!colyseusRoomId ? "Loading match..." : connectionState === "connecting" ? "Joining tournament room..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <div className="mt-4">
                <p className="text-theme-faint text-[13px] mb-2">Could not join room</p>
                <Link to={`/game/tournament/${tournamentId}`} className="block py-2 px-4 bg-theme-yellow text-bg0 rounded-lg no-underline text-[13px]">
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

function Bar({ label, value, max, barColorClass }: { label: string; value: number; max: number; barColorClass: string }) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-theme-muted">{label}</span>
        <span className="text-theme-text font-mono">{Math.round(value)}</span>
      </div>
      <div className="w-full h-[5px] bg-bg3 rounded-[3px] overflow-hidden">
        <div
          className={`h-full rounded-[3px] transition-[width] duration-150 w-pct ${barColorClass}`}
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
