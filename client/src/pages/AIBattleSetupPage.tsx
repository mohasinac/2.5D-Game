import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import { EntityPicker, type EntityOption } from "@/components/setup/EntityPicker";
import { PX_PER_CM_BASE } from "@/constants/units";
import { getComboDisplay, costIcon, KEY_LABEL } from "@/constants/combos";

type Difficulty = "medium" | "hard" | "hell";
type BestOf = 1 | 3 | 5;

interface BeybladeOption {
  id: string;
  displayName: string;
  type: string;
  spinDirection: string;
  /** Era / generation grouping for the dropdown sidebar. */
  generation?: string;
  imageUrl?: string;
  typeDistribution?: { attack: number; defense: number; stamina: number };
  mass?: number;
  radius?: number;
  specialMoveId?: string;
  comboIds?: string[];
  linkedBeySystemId?: string;
}
interface ArenaOption {
  id: string;
  name: string;
  difficulty: string;
  shape?: string;
  theme?: string;
  width?: number;
  height?: number;
  obstacles?: unknown[];
  switches?: unknown[];
  spinZones?: unknown[];
  gravityWells?: unknown[];
  bumps?: unknown[];
}

/** Best-effort generation tag — derived from id prefix; can be overridden by data. */
function generationFor(id: string): string {
  if (/(valtryek|spryzen|roktavor|kerbeus)/.test(id)) return "Burst Gen";
  if (/(dranzer-spiral|hells-hammer)/.test(id))       return "X Gen";
  if (/(storm-pegasus|rock-leone|lightning|earth-eagle|flame-sagit|galaxy|wing-pegasis|big-bang)/.test(id))
    return "Metal Fight";
  return "Bakuten / Plastic";
}

const DIFFICULTY_INFO: Record<Difficulty, { label: string; color: string; desc: string }> = {
  medium: { label: "Medium", color: C.yellow, desc: "Chases you down, uses defense when weakened" },
  hard:   { label: "Hard",   color: C.red,    desc: "Predicts your movement, dodges and combos" },
  hell:   { label: "Hell",   color: "#ff2a4d", desc: "Frame-perfect dodges, ring-out plays, predictive specials" },
};

export function AIBattleSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
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
  const [partOverrides, setPartOverrides] = useState<Record<string, string>>({});

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

  // Build EntityOption[] for the picker — must be before any early returns.
  const beyOptions: EntityOption[] = useMemo(() => beyblades.map((b) => ({
    id: b.id,
    name: b.displayName,
    subtitle: `${b.type} · ${b.spinDirection} spin`,
    group: b.generation ?? generationFor(b.id),
    data: b,
  })), [beyblades]);
  const arenaOptions: EntityOption[] = useMemo(() => arenas.map((a) => ({
    id: a.id,
    name: a.name,
    subtitle: a.difficulty ? `Difficulty: ${a.difficulty}` : undefined,
    data: a,
  })), [arenas]);

  const handleStart = () => {
    if (!playerBeyId || !aiBeyId || !arenaId) {
      toast.error("Select all options first");
      return;
    }
    setGameConfig({ beybladeId: playerBeyId, arenaId, gameMode: "single-battle" });
    navigate(`/game/${mode}/ai-battle/play`, {
      state: { beybladeId: playerBeyId, aiBeybladeId: aiBeyId, arenaId, aiDifficulty: difficulty, bestOf, partOverrides: Object.keys(partOverrides).length > 0 ? partOverrides : undefined },
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
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <Link to="/game" style={{ color:C.faint, fontSize:13, textDecoration:"none", display:"block", marginBottom:12 }}>← Back to menu</Link>
        <h1 style={{ fontSize:32, fontWeight:900, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>🤖 AI Battle</h1>
        <p style={{ color:C.muted, fontSize:14, marginBottom:32 }}>Choose your beyblade, your opponent, and difficulty.</p>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Player beyblade */}
          <EntityPicker
            title="Your Beyblade" icon="🌀"
            options={beyOptions}
            selectedId={playerBeyId || null}
            onSelect={(id) => setPlayerBeyId(id)}
            tabs={buildBeybladeTabs(TypeBadge) as any}
          />

          {/* Customize Parts — shown only when selected beyblade has a linked 2.5D system */}
          {(() => {
            const selectedBey = beyblades.find(b => b.id === playerBeyId);
            return selectedBey?.linkedBeySystemId ? (
              <details style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text, userSelect: "none" as const }}>
                  ⚙️ Customize Parts
                </summary>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { slot: "attackRingId", label: "Attack Ring", collection: "beyblade_parts/attack_ring/items" },
                    { slot: "weightDiskId", label: "Weight Disk", collection: "beyblade_parts/weight_disk/items" },
                    { slot: "tipId",        label: "Tip",         collection: "beyblade_parts/tip/items" },
                    { slot: "coreId",       label: "Core",        collection: "beyblade_parts/core/items" },
                    { slot: "casingId",     label: "Casing",      collection: "beyblade_parts/casing/items" },
                    { slot: "bitBeastId",   label: "Bit Beast",   collection: "beyblade_parts/bit_beast/items" },
                  ].map(({ slot, label, collection: col }) => (
                    <div key={slot} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted, width: 80, flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, fontSize: 12, color: partOverrides[slot] ? C.text : C.faint }}>
                        {partOverrides[slot] ? partOverrides[slot] : "(default)"}
                      </div>
                      {partOverrides[slot] && (
                        <button onClick={() => setPartOverrides(p => { const n = { ...p }; delete n[slot]; return n; })}
                          style={{ fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer" }}>
                          Reset
                        </button>
                      )}
                      <select
                        value={partOverrides[slot] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPartOverrides(p => v ? { ...p, [slot]: v } : (({ [slot]: _, ...rest }) => rest)(p));
                        }}
                        style={{ padding: "4px 6px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                      >
                        <option value="">-- swap --</option>
                      </select>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
                    Part swap is visual preview only — full part list loads when game starts.
                  </div>
                </div>
              </details>
            ) : null;
          })()}

          {/* AI beyblade */}
          <EntityPicker
            title="AI's Beyblade" icon="🤖"
            options={beyOptions}
            selectedId={aiBeyId || null}
            onSelect={(id) => setAiBeyId(id)}
            dimIds={new Set(playerBeyId ? [playerBeyId] : [])}
            tabs={buildBeybladeTabs(TypeBadge) as any}
          />

          {/* Arena */}
          <EntityPicker
            title="Arena" icon="🏟️"
            options={arenaOptions}
            selectedId={arenaId || null}
            onSelect={(id) => setArenaId(id)}
            tabs={buildArenaTabs() as any}
          />

          {/* Difficulty */}
          <Section title="Difficulty" icon="⚡">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
              {(["medium","hard","hell"] as Difficulty[]).map(d => {
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

// ─── Tab builders for the EntityPicker ────────────────────────────────────

function buildBeybladeTabs(TypeBadge: (p: { type: string }) => React.ReactElement) {
  return [
    {
      id: "preview",
      label: "Preview",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick a beyblade.</EmptyHint>;
        const b = sel.data as BeybladeOption;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              width: "100%", aspectRatio: "1 / 1", maxWidth: 280, margin: "0 auto",
              background: `radial-gradient(circle at center, ${C.bg2} 0%, ${C.bg0} 70%)`,
              borderRadius: "50%", border: `1px dashed ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.faint, fontSize: 12,
            }}>
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.displayName} style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} />
              ) : (
                <span>(static preview)</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
              <TypeBadge type={b.type} />
              <span style={{ fontSize: 11, color: C.faint }}>↻ {b.spinDirection} spin</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "stats",
      label: "Stats",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick a beyblade.</EmptyHint>;
        const b = sel.data as BeybladeOption;
        const td = b.typeDistribution ?? { attack: 120, defense: 120, stamina: 120 };
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StatBar label="Attack"  value={td.attack}  max={200} color={C.red} />
            <StatBar label="Defense" value={td.defense} max={200} color={C.blue} />
            <StatBar label="Stamina" value={td.stamina} max={200} color={C.green} />
            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: C.muted }}>
              <span>mass: <b style={{ color: C.text }}>{b.mass ?? "—"}g</b></span>
              <span>radius: <b style={{ color: C.text }}>{b.radius ?? "—"}cm</b></span>
            </div>
          </div>
        );
      },
    },
    {
      id: "special",
      label: "Special",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick a beyblade.</EmptyHint>;
        const b = sel.data as BeybladeOption;
        if (!b.specialMoveId) return <EmptyHint>This beyblade has no special move.</EmptyHint>;
        return (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{b.specialMoveId}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              Tap your special key when power ≥ 100. Effect depends on move id.
            </div>
          </div>
        );
      },
    },
    {
      id: "combos",
      label: "Combos",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick a beyblade.</EmptyHint>;
        const b = sel.data as BeybladeOption;
        const combos = (b.comboIds ?? []).map((id) => getComboDisplay(id)).filter(Boolean);
        if (combos.length === 0) return <EmptyHint>This beyblade has no combos.</EmptyHint>;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {combos.map((c) => c && (
              <div key={c.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: c.cost === 0 ? C.yellow : C.faint, fontFamily: "monospace" }}>{costIcon(c.cost)}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{c.description}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {c.sequence.map((k, i) => (
                    <span key={i} style={{ background: C.bg3, padding: "2px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 10 }}>{KEY_LABEL[k]}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
  ];
}

function buildArenaTabs() {
  return [
    {
      id: "preview",
      label: "Preview",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick an arena.</EmptyHint>;
        const a = sel.data as ArenaOption;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              width: "100%", aspectRatio: "1 / 1", maxWidth: 280, margin: "0 auto",
              background: `radial-gradient(circle at center, ${C.bg2} 0%, ${C.bg0} 75%)`,
              borderRadius: a.shape === "rectangle" ? 16 : "50%",
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.faint, fontSize: 12,
            }}>
              <span>{a.shape ?? "circle"} · {a.theme ?? "default"}</span>
            </div>
            <div style={{ textAlign: "center", color: C.muted, fontSize: 12 }}>
              {a.width && a.height
  ? `${Math.round(a.width / PX_PER_CM_BASE)} × ${Math.round(a.height / PX_PER_CM_BASE)} cm`
  : "size unknown"}
            </div>
          </div>
        );
      },
    },
    {
      id: "stats",
      label: "Stats",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick an arena.</EmptyHint>;
        const a = sel.data as ArenaOption;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, color: C.muted, fontSize: 13 }}>
            <div>shape: <b style={{ color: C.text }}>{a.shape ?? "circle"}</b></div>
            <div>theme: <b style={{ color: C.text }}>{a.theme ?? "default"}</b></div>
            <div>difficulty: <b style={{ color: C.text, textTransform: "capitalize" }}>{a.difficulty}</b></div>
          </div>
        );
      },
    },
    {
      id: "features",
      label: "Features",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick an arena.</EmptyHint>;
        const a = sel.data as ArenaOption;
        const items: { label: string; count: number }[] = [
          { label: "Obstacles",     count: a.obstacles?.length ?? 0 },
          { label: "Switches",      count: a.switches?.length ?? 0 },
          { label: "Spin zones",    count: a.spinZones?.length ?? 0 },
          { label: "Gravity wells", count: a.gravityWells?.length ?? 0 },
          { label: "Bumps",         count: a.bumps?.length ?? 0 },
        ];
        const any = items.some((i) => i.count > 0);
        if (!any) return <EmptyHint>No features configured.</EmptyHint>;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            {items.map((i) => i.count > 0 && (
              <div key={i.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted }}>{i.label}</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{i.count}</span>
              </div>
            ))}
          </div>
        );
      },
    },
  ];
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <div style={{ color: C.faint, fontSize: 12, textAlign: "center", padding: 24 }}>{children}</div>;
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(1, value / max);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
        <span>{label}</span><span style={{ fontFamily: "monospace" }}>{value}</span>
      </div>
      <div style={{ width: "100%", height: 6, background: C.bg2, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: color, transition: "width 200ms" }} />
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
