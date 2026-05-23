import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";
import { C, S } from "@/styles/theme";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

const MOCK_BEYBLADE = (id: string, x: number, y: number): ServerBeyblade => ({
  id, userId:id, username:`Test ${id}`, x, y, rotation:0, velocityX:0, velocityY:0,
  angularVelocity:12, health:100, maxHealth:100, stamina:1000, maxStamina:1000,
  spin:1800, maxSpin:2000, isActive:true, isAI:false,
  type: id==="b1" ? "attack" : "defense",
  radius:4, actualSize:48, isInvulnerable:false, damageDealt:0, damageReceived:0, collisions:0, spinDirection:"right",
  power:0, isAirborne:false, airborneTimer:0, isDefending:false,
  attackBuffTimer:0, dodgeBuffTimer:0, stunTimer:0, comboExecuting:false,
});

export function ArenaTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<BeybladeGameRenderer | null>(null);
  const animRef = useRef<number>(0);
  const [arenas, setArenas] = useState<any[]>([]);
  const [selectedArenaId, setSelectedArenaId] = useState("");
  const [selectedArena, setSelectedArena] = useState<any>(null);
  const angleRef = useRef({ v:0 });

  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.ARENAS)).then(snap => {
      const list = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      setArenas(list);
      if (list.length > 0) setSelectedArenaId(list[0].id);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setSelectedArena(arenas.find(a => a.id === selectedArenaId) ?? null);
  }, [selectedArenaId, arenas]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new BeybladeGameRenderer(container);
    rendererRef.current = renderer;
    renderer.init().catch(console.error);
    return () => { cancelAnimationFrame(animRef.current); renderer.destroy(); rendererRef.current = null; };
  }, []);

  useEffect(() => {
    const loop = () => {
      if (!rendererRef.current || !selectedArena) { animRef.current = requestAnimationFrame(loop); return; }
      angleRef.current.v += 0.01;
      const cx = (selectedArena.width ?? 1080) / 2;
      const cy = (selectedArena.height ?? 1080) / 2;
      const r = Math.min(cx, cy) * 0.3;
      const t = angleRef.current.v;
      const beyblades: Map<string, ServerBeyblade> = new Map([
        ["b1", { ...MOCK_BEYBLADE("b1", cx+Math.cos(t)*r, cy+Math.sin(t)*r), rotation:t*5 }],
        ["b2", { ...MOCK_BEYBLADE("b2", cx+Math.cos(t+Math.PI)*r, cy+Math.sin(t+Math.PI)*r), rotation:-t*8 }],
      ]);
      const gameState: ServerGameState = {
        status:"in-progress", mode:"single-battle-pvp", timer:180, startTime:Date.now(), winner:"", matchId:"test",
        arena:{ id:selectedArena.id, name:selectedArena.name, width:selectedArena.width??1080, height:selectedArena.height??1080, shape:selectedArena.shape??"circle", theme:selectedArena.theme??"metrocity" },
        beyblades,
      };
      rendererRef.current.render(gameState, beyblades);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [selectedArena]);

  return (
    <div style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Arena Test</h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>Live preview of arena rendering with test beyblades</p>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
        <label style={{ fontSize:13, color:C.muted }}>Arena:</label>
        <SearchableSelect
          value={selectedArenaId}
          options={arenas.map(a => ({ value: a.id, label: a.name }))}
          onChange={v => setSelectedArenaId(v)}
          style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", color:C.text, fontSize:13, maxWidth:280, cursor:"pointer" }}
        />
        {arenas.length === 0 && <span style={{ color:C.faint, fontSize:13 }}>No arenas found — create one first</span>}
      </div>

      <div ref={containerRef} style={{ width:"100%", height:500, background:"#000", borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }} />

      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          ["Red (Attack)", "Orbiting at 30% arena radius", "Spin: 1800 / 2000"],
          ["Blue (Defense)", "Opposite orbit", "Spin: 1800 / 2000"],
        ].map(([title, ...lines]) => (
          <div key={title} style={{ background:C.bg2, borderRadius:12, padding:12, border:`1px solid ${C.border}` }}>
            <p style={{ color:C.muted, fontWeight:500, fontSize:12, marginBottom:4 }}>{title}</p>
            {lines.map(l => <p key={l} style={{ color:C.faint, fontSize:11 }}>{l}</p>)}
          </div>
        ))}
      </div>
    </div>
  );
}
