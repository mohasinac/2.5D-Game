import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";

type Difficulty = "easy" | "medium" | "hard";
type BestOf = 1 | 3 | 5;

interface BeybladeOption { id: string; displayName: string; type: string; spinDirection: string; }
interface ArenaOption    { id: string; name: string; difficulty: string; }

const DIFFICULTY_INFO: Record<Difficulty, { label: string; color: string; desc: string }> = {
  easy:   { label: "Easy",   color: C.green,  desc: "Random movement, attacks at close range" },
  medium: { label: "Medium", color: C.yellow, desc: "Chases you down, uses defense when weakened" },
  hard:   { label: "Hard",   color: C.red,    desc: "Predicts your movement, dodges and combos" },
};

export function AIBattleSetupPage() {
  const navigate = useNavigate();
  const { settings, setGameConfig } = useGame();
  const { currentUser } = useAuth();

  const [beyblades, setBeyblades] = useState<BeybladeOption[]>([]);
  const [arenas, setArenas]       = useState<ArenaOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [playerBeyId, setPlayerBeyId] = useState(settings.beybladeId ?? "");
  const [aiBeyId, setAiBeyId]         = useState("");
  const [arenaId, setArenaId]         = useState(settings.arenaId ?? "");
  const [difficulty, setDifficulty]   = useState<Difficulty>("medium");
  const [bestOf, setBestOf]           = useState<BestOf>(1);

  useEffect(() => {
    async function load() {
      try {
        const [bSnap, aSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
        ]);
        const beys = bSnap.docs.map(d => ({ id: d.id, ...d.data() } as BeybladeOption));
        const arns = aSnap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaOption));
        setBeyblades(beys);
        setArenas(arns);
        if (!playerBeyId && beys.length) setPlayerBeyId(beys[0].id);
        if (!aiBeyId    && beys.length) setAiBeyId(beys.length > 1 ? beys[1].id : beys[0].id);
        if (!arenaId    && arns.length) setArenaId(arns[0].id);
      } catch (e) {
        toast.error("Failed to load beyblades/arenas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStart = () => {
    if (!playerBeyId || !aiBeyId || !arenaId) {
      toast.error("Select all options first");
      return;
    }
    setGameConfig({ beybladeId: playerBeyId, arenaId, gameMode: "single-battle" });
    navigate("/game/ai-battle/play", {
      state: { beybladeId: playerBeyId, aiBeybladeId: aiBeyId, arenaId, aiDifficulty: difficulty, bestOf },
    });
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const colors: Record<string, string> = { attack: C.red, defense: C.blue, stamina: C.green, balanced: C.yellow };
    return (
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
        color: colors[type] ?? C.muted, background: (colors[type] ?? C.muted) + "20",
        padding: "2px 6px", borderRadius: 4 }}>
        {type}
      </span>
    );
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg0, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="spin" style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.purple, borderRadius:"50%" }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg0, padding:32 }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <Link to="/game" style={{ color:C.faint, fontSize:13, textDecoration:"none", display:"block", marginBottom:12 }}>← Back to menu</Link>
        <h1 style={{ fontSize:32, fontWeight:900, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>🤖 AI Battle</h1>
        <p style={{ color:C.muted, fontSize:14, marginBottom:32 }}>Choose your beyblade, your opponent, and difficulty.</p>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Player beyblade */}
          <Section title="Your Beyblade" icon="🌀">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:8 }}>
              {beyblades.map(b => (
                <BeyCard key={b.id} bey={b} selected={playerBeyId === b.id} onSelect={() => setPlayerBeyId(b.id)} TypeBadge={TypeBadge} />
              ))}
            </div>
          </Section>

          {/* AI beyblade */}
          <Section title="AI's Beyblade" icon="🤖">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:8 }}>
              {beyblades.map(b => (
                <BeyCard key={b.id} bey={b} selected={aiBeyId === b.id} onSelect={() => setAiBeyId(b.id)} TypeBadge={TypeBadge} dim={b.id === playerBeyId} />
              ))}
            </div>
          </Section>

          {/* Arena */}
          <Section title="Arena" icon="🏟️">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:8 }}>
              {arenas.map(a => (
                <button key={a.id} onClick={() => setArenaId(a.id)} style={{
                  padding:"12px 14px", borderRadius:10, textAlign:"left", cursor:"pointer",
                  background: arenaId === a.id ? C.purple+"22" : C.bg2,
                  border: `1px solid ${arenaId === a.id ? C.purple : C.border}`,
                  color: C.text,
                }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{a.name}</div>
                  {a.difficulty && <div style={{ fontSize:11, color:C.faint, marginTop:2, textTransform:"capitalize" }}>{a.difficulty}</div>}
                </button>
              ))}
            </div>
          </Section>

          {/* Difficulty */}
          <Section title="Difficulty" icon="⚡">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
              {(["easy","medium","hard"] as Difficulty[]).map(d => {
                const info = DIFFICULTY_INFO[d];
                const active = difficulty === d;
                return (
                  <button key={d} onClick={() => setDifficulty(d)} style={{
                    padding:"14px 12px", borderRadius:10, cursor:"pointer", textAlign:"left",
                    background: active ? info.color+"22" : C.bg2,
                    border: `1px solid ${active ? info.color : C.border}`,
                    color: C.text,
                  }}>
                    <div style={{ fontWeight:700, fontSize:14, color: active ? info.color : C.text }}>{info.label}</div>
                    <div style={{ fontSize:11, color:C.faint, marginTop:4, lineHeight:1.4 }}>{info.desc}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Series format */}
          <Section title="Series Format" icon="🏅">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
              {([1,3,5] as BestOf[]).map(n => (
                <button key={n} onClick={() => setBestOf(n)} style={{
                  padding:"14px 12px", borderRadius:10, cursor:"pointer", textAlign:"center",
                  background: bestOf === n ? C.blue+"22" : C.bg2,
                  border: `1px solid ${bestOf === n ? C.blue : C.border}`,
                  color: bestOf === n ? C.blue : C.text, fontWeight: 700, fontSize: 14,
                }}>
                  BO{n}
                  <div style={{ fontSize:11, color:C.faint, fontWeight:400, marginTop:4 }}>
                    {n === 1 ? "Single match" : `First to ${Math.ceil(n / 2)} wins`}
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!playerBeyId || !aiBeyId || !arenaId}
            style={{
              padding:"16px 0", borderRadius:14, fontWeight:700, fontSize:16,
              background: C.purple, color: C.white,
              border:"none", cursor: "pointer",
              transition:"background 150ms",
            }}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background:C.bg1, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
        <span>{icon}</span>
        <span style={{ fontWeight:600, fontSize:14, color:C.text }}>{title}</span>
      </div>
      <div style={{ padding:16 }}>{children}</div>
    </div>
  );
}

function BeyCard({ bey, selected, onSelect, TypeBadge, dim = false }: {
  bey: BeybladeOption; selected: boolean; onSelect: () => void;
  TypeBadge: (p: { type: string }) => React.ReactElement; dim?: boolean;
}) {
  return (
    <button onClick={onSelect} style={{
      padding:"10px 12px", borderRadius:10, textAlign:"left", cursor:"pointer",
      background: selected ? C.blue+"22" : C.bg2,
      border: `1px solid ${selected ? C.blue : C.border}`,
      opacity: dim ? 0.45 : 1,
      color: C.text,
    }}>
      <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{bey.displayName}</div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <TypeBadge type={bey.type} />
        <span style={{ fontSize:10, color:C.faint }}>{bey.spinDirection}</span>
      </div>
    </button>
  );
}
