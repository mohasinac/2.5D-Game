import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";
import { C } from "@/styles/theme";
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
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-text">Arena Test</h1>
        <p className="text-faint text-xs mt-1">Live preview of arena rendering with test beyblades</p>
      </div>

      <div className="flex items-center gap-3 mb-3.5">
        <label className="text-sm text-muted">Arena:</label>
        <SearchableSelect
          value={selectedArenaId}
          options={arenas.map(a => ({ value: a.id, label: a.name }))}
          onChange={v => setSelectedArenaId(v)}
          style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.text, fontSize: 13, maxWidth: 280, cursor: "pointer" }}
        />
        {arenas.length === 0 && <span className="text-faint text-sm">No arenas found — create one first</span>}
      </div>

      <div ref={containerRef} className="w-full h-[500px] bg-black rounded-2xl border border-border overflow-hidden" />

      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {[
          ["Red (Attack)", "Orbiting at 30% arena radius", "Spin: 1800 / 2000"],
          ["Blue (Defense)", "Opposite orbit", "Spin: 1800 / 2000"],
        ].map(([title, ...lines]) => (
          <div key={title} className="bg-bg2 rounded-xl p-3 border border-border">
            <p className="text-muted font-medium text-xs mb-1">{title}</p>
            {lines.map(l => <p key={l} className="text-faint text-xs">{l}</p>)}
          </div>
        ))}
      </div>
    </div>
  );
}
