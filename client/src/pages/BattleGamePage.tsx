import { useRef, useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import { C } from "@/styles/theme";
import { SpecialMoveHUD } from "@/components/game/SpecialMoveHUD";
import { ComboHUD } from "@/components/game/ComboHUD";

export function BattleGamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, isHydrated, setActiveRoom } = useGame();

  const spectate = searchParams.get("spectate") === "true";
  const userId = settings.userId ?? "guest";

  const [gameEndData, setGameEndData] = useState<{ winner: string; gameNumber: number; seriesScore: Record<string, number> } | null>(null);
  const [seriesEndData, setSeriesEndData] = useState<{ winner: string; seriesScore: Record<string, number> } | null>(null);
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);

  const colyseusOptions = useMemo(() => ({
    beybladeId: settings.beybladeId ?? "default",
    arenaId: settings.arenaId ?? "default",
    username: settings.username ?? "Player",
    userId,
    spectate,
  }), [settings.beybladeId, settings.arenaId, settings.username, userId, spectate]);

  const { connectionState, gameState, beyblades, myBeyblade, isSpectating, room, connect, disconnect, sendInput } =
    useColyseus({
      roomName: "battle_room",
      options: colyseusOptions,
      roomId,   // ensures joinById is used so players land in the correct room
      autoConnect: false,
      onGameEnd: setGameEndData,
      onSeriesEnd: setSeriesEndData,
    });

  useEffect(() => {
    if (roomId) setActiveRoom(roomId);
    return () => setActiveRoom(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (isHydrated) connect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const { render, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber, physicsToScreen } = usePixiRenderer(containerRef);

  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades); raf = requestAnimationFrame(loop); };
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
    });
    room.onMessage("spin-out", (data: any) => {
      const { x, y } = physicsToScreen(data.x, data.y);
      spawnSpinOutParticles(x, y, TYPE_COLORS[data.type] ?? 0xffffff);
    });
    room.onMessage("special-move", (data: any) => {
      rendererRef.current?.playSpecialMoveEffect?.(data.playerId, data.type, data.x, data.y, data.facing);
      if (data.playerId === myBeyblade?.id) {
        setLastSpecialMove(data.type);
      }
    });
    room.onMessage("combo", (data: any) => {
      rendererRef.current?.playComboEffect?.(data.playerId, data.comboName);
      if (data.playerId === myBeyblade?.id) {
        setLastCombo({ name: data.comboName, timestamp: Date.now() });
      }
    });
  }, [room, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber, physicsToScreen]);

  // Auto-dismiss game-end overlay
  useEffect(() => {
    if (!gameEndData) return;
    const id = setTimeout(() => setGameEndData(null), 4000);
    return () => clearTimeout(id);
  }, [gameEndData]);

  useGameInput(sendInput, !isSpectating && connectionState === "connected" && gameState?.status === "in-progress");

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  const seriesLabel = gameState && (gameState.targetWins ?? 1) > 1
    ? `Game ${gameState.currentGame}/${(gameState.targetWins ?? 1) * 2 - 1}`
    : "";

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#000", overflow: "hidden" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* HUD top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "clamp(8px, 2vw, 16px)", pointerEvents: "none", zIndex: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
          <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>
            {isSpectating ? "SPECTATING" : connectionState}
          </span>
          {isSpectating && (
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", background: C.purple + "44", color: C.purple, padding: "2px 8px", borderRadius: 99, border: `1px solid ${C.purple}55` }}>
              SPECTATING
            </span>
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
            style={{ pointerEvents: "auto", padding: "4px 12px", fontSize: 12, background: "rgba(0,0,0,0.6)", color: C.muted, borderRadius: 6, border: `1px solid ${C.border}`, textDecoration: "none" }}
          >
            Exit
          </Link>
          {/* Series wins scoreboard */}
          {gameState && (gameState.targetWins ?? 1) > 1 && playerList.length > 0 && (
            <div style={{ background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: C.text }}>
              {playerList.map((p) => (
                <div key={p.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: C.muted, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

      {/* Spectator: show all player bars */}
      {isSpectating && playerList.length > 0 && (
        <div style={{ position: "absolute", top: 60, right: 16, display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none", zIndex: 10 }}>
          {playerList.map((p) => (
            <div key={p.id} style={{
              background: "rgba(15,23,42,0.85)", borderRadius: 8, border: `1px solid ${C.border}`,
              padding: "8px 12px", minWidth: 150, opacity: p.isActive ? 1 : 0.5,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: C.muted, overflow: "hidden", maxWidth: 90, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.username}</span>
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
        <div style={{ position: "absolute", top: 60, right: 16, display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none", zIndex: 10 }}>
          {playerList
            .filter((p) => p.userId !== userId)
            .map((opp) => (
              <div key={opp.id} style={{
                background: "rgba(15,23,42,0.85)", borderRadius: 8, border: `1px solid ${opp.isActive ? C.border : C.bg3}`,
                padding: "8px 12px", minWidth: 150, opacity: opp.isActive ? 1 : 0.5,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: C.muted, overflow: "hidden", maxWidth: 90, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opp.username}</span>
                  <span style={{ color: `#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6, "0")}`, fontSize: 10 }}>{opp.type}</span>
                </div>
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
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, pointerEvents: "none", zIndex: 10 }}>
          <div style={{ maxWidth: 320, margin: "0 auto", background: "rgba(15,23,42,0.85)", borderRadius: 12, border: `1px solid ${C.border}`, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 8 }}>
              <span style={{ fontFamily: "monospace" }}>{myBeyblade.username} (you)</span>
              <span style={{ textTransform: "capitalize", color: `#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6, "0")}` }}>{myBeyblade.type}</span>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: C.red }}>HP</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round((myBeyblade.health / Math.max(1, myBeyblade.maxHealth)) * 100)}</span>
              </div>
              <div style={{ width: "100%", height: 6, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, transition: "width 150ms", width: `${(myBeyblade.health / Math.max(1, myBeyblade.maxHealth)) * 100}%`, background: myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.5 ? C.green : myBeyblade.health / Math.max(1, myBeyblade.maxHealth) > 0.25 ? C.yellow : C.red }} />
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: C.blue }}>Spin</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round((myBeyblade.spin / Math.max(1, myBeyblade.maxSpin)) * 100)}%</span>
              </div>
              <div style={{ width: "100%", height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: C.blue, borderRadius: 3, transition: "width 150ms", width: `${(myBeyblade.spin / Math.max(1, myBeyblade.maxSpin)) * 100}%` }} />
              </div>
            </div>
            <div style={{ fontSize: 11, textAlign: "center", fontFamily: "monospace", color: stabilityColor }}>{stabilityLabel}</div>
          </div>
          <p style={{ textAlign: "center", color: C.faint, fontSize: 11, marginTop: 8 }}>
            WASD/Arrows: Move · J: Attack · K: Defend · L: Dodge · I: Jump · Space: Charge/Special
          </p>
        </div>
      )}

      {/* SpecialMoveHUD */}
      {myBeyblade && !isSpectating && (
        <SpecialMoveHUD
          myBeyblade={myBeyblade}
          specialMoveData={{
            id: myBeyblade.type,
            name: ["stampede-rush", "gyro-anchor", "spin-recovery", "tactical-burst"][["attack", "defense", "stamina", "balanced"].indexOf(myBeyblade.type)] || "Unknown",
            iconEmoji: ["⚡", "🛡️", "♻️", "💫"][["attack", "defense", "stamina", "balanced"].indexOf(myBeyblade.type)] || "✨",
            visual: {
              screenFlashColor: ["#ff4444", "#4488ff", "#44ff88", "#ffcc44"][["attack", "defense", "stamina", "balanced"].indexOf(myBeyblade.type)] || "#ffffff",
            },
          }}
          lastSpecialMoveFired={lastSpecialMove}
        />
      )}

      {/* ComboHUD */}
      <ComboHUD lastCombo={lastCombo} />

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

      {/* Warmup overlay */}
      {gameState?.status === "warmup" && !gameEndData && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", zIndex: 50 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>
              {Math.ceil(Math.max(0, gameState.timer))}
            </div>
            <p style={{ color: C.muted, marginTop: 16, fontSize: 20 }}>Get ready!</p>
          </div>
        </div>
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
