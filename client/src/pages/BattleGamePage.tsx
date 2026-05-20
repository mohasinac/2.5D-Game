import { useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import { C } from "@/styles/theme";

export function BattleGamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, isHydrated, setActiveRoom } = useGame();

  const { connectionState, gameState, beyblades, myBeyblade, room, connect, disconnect, sendInput } =
    useColyseus({
      roomName: "battle_room",
      options: {
        beybladeId: settings.beybladeId ?? "default",
        arenaId: settings.arenaId ?? "default",
        username: settings.username ?? "Player",
        userId: settings.userId,
        roomId,
      },
      // Connect only after persisted settings are hydrated so we join with the
      // correct beybladeId / userId rather than the pre-load defaults.
      autoConnect: false,
    });

  // Save the active room so the menu can offer a "resume" link on reload.
  useEffect(() => {
    if (roomId) setActiveRoom(roomId);
    return () => setActiveRoom(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Connect once settings have been restored from encrypted storage.
  useEffect(() => {
    if (isHydrated) connect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const { render, spawnCollisionParticles, spawnSpinOutParticles } = usePixiRenderer(containerRef);

  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, gameState, beyblades]);

  useEffect(() => {
    if (!room) return;
    room.onMessage("collision", (data: any) => {
      spawnCollisionParticles(data.contactPoint.x, data.contactPoint.y, 0xff4444, 0x4488ff);
    });
    room.onMessage("spin-out", (data: any) => {
      spawnSpinOutParticles(data.x, data.y, TYPE_COLORS[data.type] ?? 0xffffff);
    });
  }, [room, spawnCollisionParticles, spawnSpinOutParticles]);

  useGameInput(sendInput, connectionState === "connected" && gameState?.status === "playing");

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";
  const playerList = Array.from(beyblades.values());
  const alivePlayers = playerList.filter((b) => b.isActive);

  return (
    <div style={{ position:"relative", width:"100%", height:"100vh", background:"#000", overflow:"hidden" }}>
      <div ref={containerRef} style={{ position:"absolute", inset:0 }} />

      {/* HUD top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:16, pointerEvents:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
          <span style={{ fontSize:11, color:C.muted, fontFamily:"monospace", textTransform:"uppercase" }}>{connectionState}</span>
        </div>

        <div style={{ textAlign:"center" }}>
          {gameState && (
            <div style={{ color:C.text, fontFamily:"monospace", fontSize:24, fontWeight:700 }}>
              {Math.ceil(gameState.timer)}s
            </div>
          )}
          <div style={{ fontSize:11, color:C.muted, fontFamily:"monospace" }}>
            {alivePlayers.length}/{playerList.length} alive
          </div>
        </div>

        <Link
          to="/game"
          style={{ pointerEvents:"auto", padding:"4px 12px", fontSize:12, background:"rgba(0,0,0,0.6)", color:C.muted, borderRadius:6, border:`1px solid ${C.border}`, textDecoration:"none" }}
        >
          Exit
        </Link>
      </div>

      {/* Opponent health bars (top right) */}
      {playerList.length > 1 && (
        <div style={{ position:"absolute", top:60, right:16, display:"flex", flexDirection:"column", gap:6, pointerEvents:"none" }}>
          {playerList
            .filter((p) => p.userId !== settings.userId)
            .map((opp) => (
              <div
                key={opp.id}
                style={{
                  background:"rgba(15,23,42,0.85)", borderRadius:8, border:`1px solid ${opp.isActive ? C.border : C.bg3}`,
                  padding:"8px 12px", minWidth:150, opacity: opp.isActive ? 1 : 0.5,
                }}
              >
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:6 }}>
                  <span style={{ color:C.muted, fontFamily:"monospace", overflow:"hidden", maxWidth:90, textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{opp.username}</span>
                  <span style={{ color:`#${(TYPE_COLORS[opp.type] ?? 0xaaaaaa).toString(16).padStart(6,"0")}`, fontSize:10 }}>{opp.type}</span>
                </div>
                <div style={{ width:"100%", height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", borderRadius:3, transition:"width 150ms",
                    width:`${(opp.health / 100) * 100}%`,
                    background: opp.health > 50 ? C.green : opp.health > 25 ? C.yellow : C.red,
                  }} />
                </div>
                {!opp.isActive && (
                  <p style={{ color:C.red, textAlign:"center", fontSize:10, marginTop:4, fontWeight:700 }}>ELIMINATED</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* My stats (bottom) */}
      {myBeyblade && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:16, pointerEvents:"none" }}>
          <div style={{ maxWidth:320, margin:"0 auto", background:"rgba(15,23,42,0.85)", borderRadius:12, border:`1px solid ${C.border}`, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:8 }}>
              <span style={{ fontFamily:"monospace" }}>{myBeyblade.username} (you)</span>
              <span style={{ textTransform:"capitalize", color:`#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6,"0")}` }}>{myBeyblade.type}</span>
            </div>
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                <span style={{ color:C.red }}>HP</span>
                <span style={{ color:C.text, fontFamily:"monospace" }}>{Math.round(myBeyblade.health)}</span>
              </div>
              <div style={{ width:"100%", height:6, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:3, transition:"width 150ms",
                  width:`${(myBeyblade.health / 100) * 100}%`,
                  background: myBeyblade.health > 50 ? C.green : myBeyblade.health > 25 ? C.yellow : C.red,
                }} />
              </div>
            </div>
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                <span style={{ color:C.blue }}>Spin</span>
                <span style={{ color:C.text, fontFamily:"monospace" }}>{Math.round((myBeyblade.spin / myBeyblade.maxSpin) * 100)}%</span>
              </div>
              <div style={{ width:"100%", height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", background:C.blue, borderRadius:3, transition:"width 150ms", width:`${(myBeyblade.spin / myBeyblade.maxSpin) * 100}%` }} />
              </div>
            </div>
            <div style={{ fontSize:11, textAlign:"center", fontFamily:"monospace", color:stabilityColor }}>{stabilityLabel}</div>
          </div>
          <p style={{ textAlign:"center", color:C.faint, fontSize:11, marginTop:8 }}>
            WASD/Arrows: Move · J: Attack · K: Defend · L: Dodge · I: Jump · Space: Charge/Special
          </p>
        </div>
      )}

      {/* Game over overlay */}
      {gameState?.status === "finished" && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.85)", zIndex:50 }}>
          <div style={{ textAlign:"center", maxWidth:420 }}>
            <div style={{ fontSize:60, marginBottom:16 }}>
              {gameState.winner === settings.userId ? "🏆" : "💀"}
            </div>
            <h2 style={{ fontSize:40, fontWeight:900, color:C.text, letterSpacing:"-0.02em", marginBottom:8 }}>
              {gameState.winner === settings.userId ? "VICTORY!" : "DEFEATED"}
            </h2>

            <div style={{ background:C.bg1, borderRadius:12, border:`1px solid ${C.border}`, marginBottom:24, overflow:"hidden" }}>
              {playerList
                .sort((a, b) => b.damageDealt - a.damageDealt)
                .map((p, i) => (
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom: i < playerList.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize:20 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                    <span style={{ flex:1, color:C.text, fontWeight:500 }}>{p.username}</span>
                    <span style={{ color:C.muted, fontSize:13, fontFamily:"monospace" }}>{Math.round(p.damageDealt)} dmg</span>
                    <span style={{ fontSize:12, color: p.isActive ? C.green : C.red }}>{p.isActive ? "Survived" : "KO"}</span>
                  </div>
                ))}
            </div>

            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <Link to="/game/battle/lobby" style={{ padding:"12px 24px", background:C.red, color:C.white, borderRadius:12, fontWeight:700, textDecoration:"none" }}>
                Play Again
              </Link>
              <Link to="/game" style={{ padding:"12px 24px", background:C.bg3, color:C.text, borderRadius:12, fontWeight:700, textDecoration:"none" }}>
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Countdown overlay */}
      {gameState?.status === "countdown" && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.65)", zIndex:50 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:120, fontWeight:900, color:C.text, fontFamily:"monospace" }}>
              {Math.ceil(gameState.timer)}
            </div>
            <p style={{ color:C.muted, marginTop:16, fontSize:20 }}>Get ready!</p>
          </div>
        </div>
      )}

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.85)", zIndex:50 }}>
          <div style={{ textAlign:"center" }}>
            <div className="spin" style={{ width:48, height:48, border:`4px solid ${C.red}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto 16px" }} />
            <p style={{ color:C.text }}>
              {connectionState === "connecting" ? "Joining battle..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <div style={{ marginTop:16 }}>
                <p style={{ color:C.faint, fontSize:13, marginBottom:8 }}>Could not join room</p>
                <Link to="/game/battle/lobby" style={{ display:"block", padding:"8px 16px", background:C.red, color:C.white, borderRadius:8, textDecoration:"none", fontSize:13 }}>
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
