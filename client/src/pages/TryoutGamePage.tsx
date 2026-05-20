import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGameInput } from "@/game/hooks/useGameInput";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import { useGame } from "@/contexts/GameContext";
import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import { C } from "@/styles/theme";

export function TryoutGamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useGame();

  const { connectionState, gameState, beyblades, myBeyblade, room, connect, disconnect, sendInput } =
    useColyseus({
      roomName: "tryout_room",
      options: {
        beybladeId: settings.beybladeId ?? "default",
        arenaId: settings.arenaId ?? "default",
        username: settings.username ?? "Player",
        userId: settings.userId,
      },
      autoConnect: false,
    });

  const { render, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber } = usePixiRenderer(containerRef);

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
      const cx = data.contactPoint.x;
      const cy = data.contactPoint.y;
      spawnCollisionParticles(cx, cy, 0xff4444, 0x4488ff);
      // Floating damage numbers for each beyblade that took damage
      if (data.damage1 > 0) spawnDamageNumber(cx - 12, cy - 8, data.damage1, 0xff5555);
      if (data.damage2 > 0) spawnDamageNumber(cx + 12, cy - 8, data.damage2, 0xff5555);
    });
    room.onMessage("spin-out", (data: any) => {
      spawnSpinOutParticles(data.x, data.y, TYPE_COLORS[data.type] ?? 0xffffff);
    });
  }, [room, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber]);

  useGameInput(sendInput, connectionState === "connected");

  const myStability = myBeyblade ? getBeybladeStability(myBeyblade) : 0;
  const stabilityColor = myStability > 0.6 ? C.green : myStability > 0.3 ? C.yellow : C.red;
  const stabilityLabel = myStability > 0.6 ? "Stable" : myStability > 0.3 ? "Wobbling" : "Critical!";

  return (
    <div style={{ position:"relative", width:"100%", height:"100vh", background:"#000", overflow:"hidden" }}>
      <div ref={containerRef} style={{ position:"absolute", inset:0 }} />

      {/* HUD top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:16, pointerEvents:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: connectionState === "connected" ? C.green : C.red }} className={connectionState === "connected" ? "pulse" : ""} />
          <span style={{ fontSize:11, color:C.muted, fontFamily:"monospace", textTransform:"uppercase" }}>{connectionState}</span>
        </div>

        {gameState && (
          <div style={{ color:C.text, fontFamily:"monospace", fontSize:24, fontWeight:700 }}>
            {Math.ceil(gameState.timer)}s
          </div>
        )}

        <Link
          to="/game"
          style={{ pointerEvents:"auto", padding:"4px 12px", fontSize:12, background:"rgba(0,0,0,0.6)", color:C.muted, borderRadius:6, border:`1px solid ${C.border}`, textDecoration:"none" }}
        >
          Exit
        </Link>
      </div>

      {/* HUD bottom — my stats */}
      {myBeyblade && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:16, pointerEvents:"none" }}>
          <div style={{ maxWidth:320, margin:"0 auto", background:"rgba(15,23,42,0.85)", borderRadius:12, border:`1px solid ${C.border}`, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:8 }}>
              <span style={{ fontFamily:"monospace" }}>{myBeyblade.username}</span>
              <span style={{ textTransform:"capitalize", color:`#${(TYPE_COLORS[myBeyblade.type] ?? 0xffffff).toString(16).padStart(6,"0")}` }}>
                {myBeyblade.type}
              </span>
            </div>

            {/* HP bar */}
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

            {/* Spin bar */}
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                <span style={{ color:C.blue }}>Spin</span>
                <span style={{ color:C.text, fontFamily:"monospace" }}>
                  {Math.round((myBeyblade.spin / myBeyblade.maxSpin) * 100)}%
                </span>
              </div>
              <div style={{ width:"100%", height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", background:C.blue, borderRadius:3, transition:"width 150ms", width:`${(myBeyblade.spin / myBeyblade.maxSpin) * 100}%` }} />
              </div>
            </div>

            {/* Power bar */}
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                <span style={{ color:C.yellow }}>Power</span>
                <span style={{ color:C.text, fontFamily:"monospace" }}>{Math.round((myBeyblade as any).power ?? 0)}%</span>
              </div>
              <div style={{ width:"100%", height:5, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:3, transition:"width 150ms",
                  width:`${(myBeyblade as any).power ?? 0}%`,
                  background: (myBeyblade as any).power >= 50 ? C.yellow : C.muted,
                }} />
              </div>
            </div>

            {/* State flags */}
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:6 }}>
              {(myBeyblade as any).isAirborne && <span style={{ fontSize:9, fontFamily:"monospace", background:C.blue+"33", color:C.blue, borderRadius:4, padding:"1px 5px" }}>AIRBORNE</span>}
              {(myBeyblade as any).isDefending && <span style={{ fontSize:9, fontFamily:"monospace", background:C.green+"33", color:C.green, borderRadius:4, padding:"1px 5px" }}>DEFENDING</span>}
              {(myBeyblade as any).attackBuffTimer > 0 && <span style={{ fontSize:9, fontFamily:"monospace", background:C.red+"33", color:C.red, borderRadius:4, padding:"1px 5px" }}>ATTACK+</span>}
              {(myBeyblade as any).stunTimer > 0 && <span style={{ fontSize:9, fontFamily:"monospace", background:C.yellow+"33", color:C.yellow, borderRadius:4, padding:"1px 5px" }}>STUNNED</span>}
            </div>

            <div style={{ fontSize:11, textAlign:"center", fontFamily:"monospace", color:stabilityColor }}>
              {stabilityLabel}
            </div>
          </div>
          <p style={{ textAlign:"center", color:C.faint, fontSize:11, marginTop:8 }}>
            WASD/Arrows: Move · J: Attack · K: Defend · L: Dodge · I: Jump · Space: Charge/Special
          </p>
        </div>
      )}

      {/* Game over overlay */}
      {gameState?.status === "finished" && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.75)" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🌀</div>
            <h2 style={{ fontSize:28, fontWeight:900, color:C.text, marginBottom:8 }}>Tryout Complete!</h2>
            <p style={{ color:C.muted, marginBottom:24 }}>
              Survived {Math.round(gameState.timer)}s with {Math.round(myBeyblade?.damageDealt ?? 0)} damage dealt
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button
                onClick={() => { disconnect(); setTimeout(connect, 100); }}
                style={{ padding:"12px 24px", background:C.blue, color:C.white, borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer" }}
              >
                Play Again
              </button>
              <Link to="/game" style={{ padding:"12px 24px", background:C.bg3, color:C.text, borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none" }}>
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
            <div className="spin" style={{ width:48, height:48, border:`4px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto 16px" }} />
            <p style={{ color:C.text }}>
              {connectionState === "connecting" ? "Entering arena..." : "Connection lost"}
            </p>
            {connectionState === "error" && (
              <button onClick={connect} style={{ marginTop:16, padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, cursor:"pointer" }}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
