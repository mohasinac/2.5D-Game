import { useRef, useEffect, useState } from "react";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

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
  // Gate: don't start the render loop until PixiJS has fully initialised.
  const [rendererReady, setRendererReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = new BeybladeGameRenderer(el);
    rendererRef.current = r;
    r.init()
      .then(() => setRendererReady(true))
      .catch(err => console.error("RendererDemo init failed:", err));
    return () => {
      cancelAnimationFrame(animRef.current);
      try { r.destroy(); } catch { /* already destroyed */ }
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!rendererReady) return; // wait for PixiJS init before first render
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
  }, [spinLoss, rendererReady]);

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
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[960px]">
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-black text-theme-text tracking-[-0.02em]">2.5D Renderer Demo</h1>
          <p className="text-theme-muted text-[13px] mt-1">PixiJS WebGL · 3 beyblades · Live stability effects</p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: `1fr ${sideW}px` }}>
          {/* Canvas */}
          <div ref={containerRef} className="bg-black rounded-2xl border border-border-c overflow-hidden aspect-[16/10] min-h-[340px]" />

          {/* Controls */}
          <div className="flex flex-col gap-3">
            {/* Theme */}
            <div className="bg-bg2 border border-border-c rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-[0.08em] mb-2.5">Arena Theme</div>
              <div className="grid grid-cols-2 gap-1.5">
                {THEMES.map(t => (
                  <button key={t} onClick={() => changeTheme(t)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium cursor-pointer capitalize border ${theme === t ? "bg-blue-13 border-theme-blue text-theme-text" : "bg-transparent border-border-c text-theme-muted"}`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Spin decay */}
            <div className="bg-bg2 border border-border-c rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-[0.08em] mb-2.5">Spin Decay Speed</div>
              <input type="range" min={0} max={20} step={1} value={spinLoss} onChange={e => setSpinLoss(+e.target.value)} className="accent-theme-blue w-full" />
              <div className="flex justify-between text-[11px] text-theme-faint mt-1">
                <span>None</span><span className="text-theme-text font-mono">{spinLoss}/s</span><span>Fast</span>
              </div>
              <p className="text-[11px] text-theme-faint mt-2">Watch beyblades tilt as spin drops below 40%</p>
            </div>

            {/* Effects */}
            <div className="bg-bg2 border border-border-c rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-[0.08em] mb-2.5">Effects</div>
              <div className="flex flex-col gap-2">
                <button onClick={burst} className="p-2.5 rounded-[10px] bg-theme-red text-white font-semibold text-[13px] border-none cursor-pointer">💥 Collision Burst</button>
                <button onClick={spinOut} className="p-2.5 rounded-[10px] bg-theme-orange text-white font-semibold text-[13px] border-none cursor-pointer">🌀 Spin-Out Effect</button>
                <button onClick={reset} className="p-2.5 rounded-[10px] bg-transparent text-theme-muted border border-border-c font-semibold text-[13px] cursor-pointer">↺ Reset Spins</button>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-bg2 border border-border-c rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-[0.08em] mb-2.5">2.5D Effects Active</div>
              {[
                ["text-theme-red","Attack — fastest spin streak"],
                ["text-theme-blue","Defense — solid gyro lock feel"],
                ["text-theme-green","Stamina — slowest, longest spin"],
              ].map(([cls,l]) => (
                <div key={l} className="flex items-center gap-2 mb-1.5 text-[12px] text-theme-muted">
                  <span className={`${cls} text-[8px]`}>●</span>{l}
                </div>
              ))}
              <div className="border-t border-border-c mt-2 pt-2 text-[11px] text-theme-faint flex flex-col gap-1">
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
