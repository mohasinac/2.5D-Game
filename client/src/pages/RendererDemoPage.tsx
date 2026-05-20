import { useRef, useEffect, useState } from "react";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";
import { C } from "@/styles/theme";

const W = 1080, H = 1080;

function makeMock(id: string, type: ServerBeyblade["type"], spin: number): ServerBeyblade {
  return {
    id, userId: id, username: id === "b1" ? "StormPegasus" : id === "b2" ? "RockLeone" : "EarthVirgo",
    x: 0, y: 0, rotation: 0, velocityX: 0, velocityY: 0, angularVelocity: 15,
    health: 100, maxHealth: 100, stamina: 1000, maxStamina: 1000,
    spin, maxSpin: 2000, isActive: true, isAI: false, type,
    radius: 4, actualSize: 52, isInvulnerable: false,
    damageDealt: 0, damageReceived: 0, collisions: 0, spinDirection: "right",
    power: 0, isAirborne: false, airborneTimer: 0, isDefending: false,
    attackBuffTimer: 0, dodgeBuffTimer: 0, stunTimer: 0, comboExecuting: false,
  };
}

const THEMES = ["metrocity","forest","mountains","desert","sea","futuristic","prehistoric"] as const;

export function RendererDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<BeybladeGameRenderer | null>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ t: 0, spins: [1800,1800,1800] as [number,number,number], theme: "futuristic" });

  const [theme, setTheme] = useState("futuristic");
  const [spinLoss, setSpinLoss] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = new BeybladeGameRenderer(el);
    rendererRef.current = r;
    r.init().catch(console.error);
    return () => { cancelAnimationFrame(animRef.current); r.destroy(); rendererRef.current = null; };
  }, []);

  useEffect(() => {
    const loop = () => {
      const r = rendererRef.current;
      if (!r) { animRef.current = requestAnimationFrame(loop); return; }
      const s = stateRef.current;
      s.t += 0.015;
      const cx = W / 2, cy = H / 2, orbitR = Math.min(cx, cy) * 0.35;
      const beyblades = new Map<string, ServerBeyblade>();
      ([
        { id:"b1", type:"attack" as const, offset:0 },
        { id:"b2", type:"defense" as const, offset:(Math.PI*2)/3 },
        { id:"b3", type:"stamina" as const, offset:(Math.PI*4)/3 },
      ] as const).forEach(({ id, type, offset }, i) => {
        s.spins[i] = Math.max(10, s.spins[i] - spinLoss / 60);
        const bey = makeMock(id, type, s.spins[i]);
        bey.x = cx + Math.cos(s.t + offset) * orbitR;
        bey.y = cy + Math.sin(s.t + offset) * orbitR;
        const spd = type === "attack" ? 18 : type === "defense" ? 10 : 6;
        bey.rotation = s.t * spd;
        bey.angularVelocity = (s.spins[i] / 2000) * spd;
        beyblades.set(id, bey);
      });
      r.render({
        status:"in-progress", mode:"single-battle-pvp", timer:180, startTime:Date.now(),
        winner:"", matchId:"demo",
        arena:{ id:"demo", name:"Demo", width:W, height:H, shape:"circle", theme:s.theme },
        beyblades,
      }, beyblades);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [spinLoss]);

  const changeTheme = (t: string) => {
    setTheme(t);
    stateRef.current.theme = t;
    if (rendererRef.current) (rendererRef.current as any).arenaRadius = 0;
  };

  const burst = () => {
    const r = rendererRef.current;
    if (!r) return;
    const cx = W/2, cy = H/2, d = Math.min(cx,cy)*0.35;
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI*2*i)/3;
      r.spawnCollisionParticles(cx+Math.cos(a)*d, cy+Math.sin(a)*d,
        [0xff4444,0x4488ff,0x44ff88][i], [0xffaa00,0x00ffaa,0xff00aa][i]);
    }
  };
  const spinOut = () => {
    rendererRef.current?.spawnSpinOutParticles(W/2, H/2, 0xff4444);
    stateRef.current.spins = [80, 150, 60];
  };
  const reset = () => { stateRef.current.spins = [1800, 1800, 1800]; };

  const sideW = 260;

  return (
    <div style={{ minHeight:"100vh", background:C.bg0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:960 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:C.text, letterSpacing:"-0.02em" }}>2.5D Renderer Demo</h1>
          <p style={{ color:C.muted, fontSize:13, marginTop:4 }}>PixiJS WebGL · 3 beyblades · Live stability effects</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`1fr ${sideW}px`, gap:20 }}>
          {/* Canvas */}
          <div ref={containerRef} style={{ background:"#000", borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", aspectRatio:"16/10", minHeight:340 }} />

          {/* Controls */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Theme */}
            <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Arena Theme</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {THEMES.map(t => (
                  <button key={t} onClick={() => changeTheme(t)} style={{
                    padding:"6px 8px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                    background: theme===t ? C.blue+"33" : "transparent",
                    border: `1px solid ${theme===t ? C.blue : C.border}`,
                    color: theme===t ? C.text : C.muted,
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Spin decay */}
            <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Spin Decay Speed</div>
              <input type="range" min={0} max={20} step={1} value={spinLoss} onChange={e => setSpinLoss(+e.target.value)} style={{ accentColor:C.blue }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.faint, marginTop:4 }}>
                <span>None</span><span style={{ color:C.text, fontFamily:"monospace" }}>{spinLoss}/s</span><span>Fast</span>
              </div>
              <p style={{ fontSize:11, color:C.faint, marginTop:8 }}>Watch beyblades tilt as spin drops below 40%</p>
            </div>

            {/* Effects */}
            <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Effects</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={burst} style={{ padding:"10px", borderRadius:10, background:C.redDark, color:C.white, fontWeight:600, fontSize:13 }}>💥 Collision Burst</button>
                <button onClick={spinOut} style={{ padding:"10px", borderRadius:10, background:C.orange, color:C.white, fontWeight:600, fontSize:13 }}>🌀 Spin-Out Effect</button>
                <button onClick={reset} style={{ padding:"10px", borderRadius:10, background:"transparent", color:C.muted, border:`1px solid ${C.border}`, fontWeight:600, fontSize:13 }}>↺ Reset Spins</button>
              </div>
            </div>

            {/* Legend */}
            <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>2.5D Effects Active</div>
              {[
                ["#ef4444","Attack — fastest spin streak"],
                ["#4488ff","Defense — solid gyro lock feel"],
                ["#44ff88","Stamina — slowest, longest spin"],
              ].map(([c,l]) => <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:12, color:C.muted }}><span style={{ color:c, fontSize:8 }}>●</span>{l}</div>)}
              <div style={{ borderTop:`1px solid ${C.border}`, marginTop:8, paddingTop:8, fontSize:11, color:C.faint, display:"flex", flexDirection:"column", gap:4 }}>
                <span>↕ Y-scale: 0.85 dying → 1.0 full spin</span>
                <span>↗ Skew tilt when spin &lt; 40%</span>
                <span>◐ Alpha motion blur on fast spin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
