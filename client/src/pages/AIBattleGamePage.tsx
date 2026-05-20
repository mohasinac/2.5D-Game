import { useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import { C } from "@/styles/theme";

export function AIBattleGamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useGame();
  const { currentUser } = useAuth();

  const roomId    = location.state?.roomId    as string | undefined;
  const sessionId = location.state?.sessionId as string | undefined;

  const { connectionState, gameState, beyblades, myBeyblade, room, connect, disconnect, sendInput } =
    useColyseus({
      roomName: "ai_battle_room",
      options: {
        beybladeId: settings.beybladeId ?? "default",
        arenaId:    settings.arenaId    ?? "default",
        username:   settings.username   ?? "Player",
        userId:     currentUser?.uid    ?? settings.userId ?? "guest",
      },
      autoConnect: false,
    });

  const { render, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber } =
    usePixiRenderer(containerRef);

  useEffect(() => {
    connect();
    return () => { disconnect(); };
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => { render(gameState, beyblades); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, gameState, beyblades]);

  useEffect(() => {
    if (!room) return;
    room.onMessage("collision", (data: any) => {
      spawnCollisionParticles(data.contactPoint.x, data.contactPoint.y, 0xff4444, 0x44aaff);
      if (data.damage1 > 0) spawnDamageNumber(data.contactPoint.x - 12, data.contactPoint.y - 8, data.damage1, 0xff5555);
      if (data.damage2 > 0) spawnDamageNumber(data.contactPoint.x + 12, data.contactPoint.y - 8, data.damage2, 0x55aaff);
    });
    room.onMessage("spin-out", (data: any) => {
      spawnSpinOutParticles(data.x, data.y, TYPE_COLORS[data.type] ?? 0xffffff);
    });
  }, [room, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber]);

  useGameInput(sendInput, connectionState === "connected");

  const myStability    = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";

  // Determine opponent (the AI beyblade)
  const allBeyblades = Array.from(beyblades.values());
  const aiBey = allBeyblades.find(b => b.userId === "__ai__");

  const isFinished = gameState?.status === "finished";
  const playerWon  = isFinished && gameState?.winner === (currentUser?.uid ?? settings.userId);

  return (
    <div style={{ position:"relative", width:"100%", height:"100vh", background:"#000", overflow:"hidden" }}>
      <div ref={containerRef} style={{ position:"absolute", inset:0 }} />

      {/* HUD top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:16, pointerEvents:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
          <span style={{ fontSize:11, color:C.muted, fontFamily:"monospace" }}>VS AI</span>
        </div>

        {gameState && (
          <div style={{ color:C.text, fontFamily:"monospace", fontSize:24, fontWeight:700 }}>
            {Math.ceil(gameState.timer)}s
          </div>
        )}

        <Link
          to="/game/ai"
          style={{ pointerEvents:"auto", padding:"4px 12px", fontSize:12, background:"rgba(0,0,0,0.6)", color:C.muted, borderRadius:6, border:`1px solid ${C.border}`, textDecoration:"none" }}
        >
          Exit
        </Link>
      </div>

      {/* HUD bottom — player vs AI comparison */}
      {myBeyblade && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:16, pointerEvents:"none" }}>
          <div style={{ maxWidth:480, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"center" }}>

            {/* Player stats */}
            <StatCard beyblade={myBeyblade} label="YOU" accentColor={C.blue} stabilityColor={stabilityColor} stabilityLabel={stabilityLabel} />

            <div style={{ fontSize:18, fontWeight:900, color:C.faint, textAlign:"center" }}>VS</div>

            {/* AI stats */}
            {aiBey ? (
              <StatCard beyblade={aiBey} label="CPU" accentColor={C.red} stabilityColor={getBeybladeStability(aiBey) > 0.4 ? C.green : C.red} stabilityLabel={aiBey.username} />
            ) : (
              <div />
            )}
          </div>
          <p style={{ textAlign:"center", color:C.faint, fontSize:11, marginTop:8 }}>
            WASD: Move · J: Attack · K: Defend · L: Dodge · I: Jump · Space: Charge/Special
          </p>
        </div>
      )}

      {/* Game over overlay */}
      {isFinished && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.8)" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:72, marginBottom:16 }}>{playerWon ? "🏆" : "💀"}</div>
            <h2 style={{ fontSize:32, fontWeight:900, color: playerWon ? C.yellow : C.red, marginBottom:8 }}>
              {playerWon ? "Victory!" : "Defeated!"}
            </h2>
            <p style={{ color:C.muted, marginBottom:28 }}>
              {playerWon ? "You defeated the AI!" : "The AI won this round."}
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button
                onClick={() => navigate("/game/ai")}
                style={{ padding:"12px 28px", background:C.purple, color:C.white, borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", border:"none" }}
              >
                Play Again
              </button>
              <Link to="/game" style={{ padding:"12px 28px", background:C.bg3, color:C.text, borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none" }}>
                Menu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Connecting overlay */}
      {connectionState !== "connected" && gameState === null && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.85)" }}>
          <div style={{ textAlign:"center" }}>
            <div className="spin" style={{ width:48, height:48, border:`4px solid ${C.purple}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto 16px" }} />
            <p style={{ color:C.text }}>Loading AI battle...</p>
            {connectionState === "error" && (
              <button onClick={connect} style={{ marginTop:16, padding:"8px 20px", background:C.purple, color:C.white, borderRadius:8, cursor:"pointer", border:"none" }}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ beyblade, label, accentColor, stabilityColor, stabilityLabel }: {
  beyblade: any; label: string; accentColor: string; stabilityColor: string; stabilityLabel: string;
}) {
  const hp   = Math.round(beyblade.health);
  const spin = Math.round((beyblade.spin / beyblade.maxSpin) * 100);

  return (
    <div style={{ background:"rgba(15,23,42,0.85)", borderRadius:12, border:`1px solid ${accentColor}44`, padding:10 }}>
      <div style={{ fontSize:10, fontWeight:700, color:accentColor, letterSpacing:"0.1em", marginBottom:6 }}>{label}</div>

      <div style={{ marginBottom:4 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:2 }}>
          <span style={{ color:C.red }}>HP</span>
          <span style={{ color:C.text, fontFamily:"monospace" }}>{hp}</span>
        </div>
        <div style={{ height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:3, background: hp > 50 ? C.green : hp > 25 ? C.yellow : C.red, width:`${Math.min(100, hp)}%`, transition:"width 150ms" }} />
        </div>
      </div>

      <div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:2 }}>
          <span style={{ color:C.blue }}>Spin</span>
          <span style={{ color:C.text, fontFamily:"monospace" }}>{spin}%</span>
        </div>
        <div style={{ height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:3, background:C.blue, width:`${spin}%`, transition:"width 150ms" }} />
        </div>
      </div>

      <div style={{ fontSize:9, color:stabilityColor, fontFamily:"monospace", marginTop:6 }}>{stabilityLabel}</div>
    </div>
  );
}
