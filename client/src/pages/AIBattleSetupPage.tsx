import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import { EntityPicker, type EntityOption } from "@/components/setup/EntityPicker";
import { PX_PER_CM_BASE } from "@/constants/units";
import { costIcon, KEY_LABEL } from "@/constants/combos";
import { useCombos } from "@/hooks/useCombos";
import type { ComboDoc } from "@/stores/gameDataStore";

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
  const { byId: comboById } = useCombos();

  const FALLBACK_BEY_OPTION: BeybladeOption = {
    id: "default", displayName: "Default Beyblade (built-in)",
    type: "balanced", spinDirection: "right",
  };
  const FALLBACK_ARENA_OPTION: ArenaOption = {
    id: "default", name: "Default Arena (built-in)", difficulty: "normal", shape: "circle",
  };

  const [beyblades, setBeyblades] = useState<BeybladeOption[]>([FALLBACK_BEY_OPTION]);
  const [arenas, setArenas]       = useState<ArenaOption[]>([FALLBACK_ARENA_OPTION]);
  const [loading, setLoading] = useState(true);
  const [modeDisabled, setModeDisabled] = useState(false);

  const [playerBeyId, setPlayerBeyId] = useState(settings.beybladeId ?? "default");
  const [aiBeyId, setAiBeyId]         = useState("default");
  const [arenaId, setArenaId]         = useState(settings.arenaId ?? "default");
  const [difficulty, setDifficulty]   = useState<Difficulty>("medium");
  const [bestOf, setBestOf]           = useState<BestOf>(1);
  const [aiCount, setAiCount]         = useState<number>(1);
  const [partOverrides, setPartOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const [bSnap, aSnap, settingsSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
          getDoc(doc(db, "settings", "game")),
        ]);
        if (settingsSnap.exists() && settingsSnap.data().enableAiBattle === false) {
          setModeDisabled(true);
        }
        const beys = [FALLBACK_BEY_OPTION, ...bSnap.docs.map(d => ({ id: d.id, ...d.data() } as BeybladeOption))];
        const arns = [FALLBACK_ARENA_OPTION, ...aSnap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaOption))];
        setBeyblades(beys);
        setArenas(arns);
        // Auto-select first real entry (index 1) if still on fallback
        const realBeys = beys.slice(1);
        const realArns = arns.slice(1);
        if ((!playerBeyId || playerBeyId === "default") && realBeys.length) setPlayerBeyId(realBeys[0].id);
        if ((!aiBeyId    || aiBeyId    === "default") && realBeys.length)
          setAiBeyId(realBeys.length > 1 ? realBeys[1].id : realBeys[0].id);
        if ((!arenaId    || arenaId    === "default") && realArns.length) setArenaId(realArns[0].id);
      } catch {
        toast.error("Failed to load beyblades/arenas — using built-in defaults");
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
      state: { beybladeId: playerBeyId, aiBeybladeId: aiBeyId, arenaId, aiDifficulty: difficulty, bestOf, aiCount: aiCount > 1 ? aiCount : undefined, partOverrides: Object.keys(partOverrides).length > 0 ? partOverrides : undefined },
    });
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const colorMap: Record<string, string> = { attack: "text-theme-red bg-red-10", defense: "text-theme-blue bg-blue-10", stamina: "text-theme-green bg-green-10", balanced: "text-theme-yellow bg-yellow-10" };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded ${colorMap[type] ?? "text-theme-muted bg-bg3"}`}>
        {type}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-bg0 flex items-center justify-center">
      <div className="spin w-10 h-10 border-[3px] border-border-c border-t-purple rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-[860px] mx-auto">
        <Link to="/game" className="text-theme-faint text-[13px] no-underline block mb-3">← Back to menu</Link>
        <h1 className="text-[32px] font-black text-theme-text tracking-[-0.02em] mb-1">🤖 AI Battle</h1>
        <p className="text-theme-muted text-[14px] mb-8">Choose your beyblade, your opponent, and difficulty.</p>

        {modeDisabled && (
          <div className="bg-yellow-10 border border-yellow-40 rounded-[10px] px-[18px] py-3 mb-5 text-[13px] text-theme-yellow">
            AI Battle is currently disabled by the administrator. Check back later.
          </div>
        )}

        <div className="flex flex-col gap-5">

          {/* Player beyblade */}
          <EntityPicker
            title="Your Beyblade" icon="🌀"
            options={beyOptions}
            selectedId={playerBeyId || null}
            onSelect={(id) => setPlayerBeyId(id)}
            tabs={buildBeybladeTabs(TypeBadge, comboById) as any}
          />

          {/* Customize Parts — shown only when selected beyblade has a linked 2.5D system */}
          {(() => {
            const selectedBey = beyblades.find(b => b.id === playerBeyId);
            return selectedBey?.linkedBeySystemId ? (
              <details className="bg-bg2 border border-border-c rounded-xl px-4 py-3">
                <summary className="cursor-pointer text-[13px] font-semibold text-theme-text select-none">
                  ⚙️ Customize Parts
                </summary>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { slot: "attackRingId", label: "Attack Ring", collection: "beyblade_parts/attack_ring/items" },
                    { slot: "weightDiskId", label: "Weight Disk", collection: "beyblade_parts/weight_disk/items" },
                    { slot: "tipId",        label: "Tip",         collection: "beyblade_parts/tip/items" },
                    { slot: "coreId",       label: "Core",        collection: "beyblade_parts/core/items" },
                    { slot: "casingId",     label: "Casing",      collection: "beyblade_parts/casing/items" },
                    { slot: "bitBeastId",   label: "Bit Beast",   collection: "beyblade_parts/bit_beast/items" },
                  ].map(({ slot, label, collection: col }) => (
                    <div key={slot} className="flex items-center gap-2">
                      <span className="text-[11px] text-theme-muted w-20 shrink-0">{label}</span>
                      <div className={`flex-1 text-[12px] ${partOverrides[slot] ? "text-theme-text" : "text-theme-faint"}`}>
                        {partOverrides[slot] ? partOverrides[slot] : "(default)"}
                      </div>
                      {partOverrides[slot] && (
                        <button onClick={() => setPartOverrides(p => { const n = { ...p }; delete n[slot]; return n; })}
                          className="text-[11px] text-theme-red bg-transparent border-none cursor-pointer">
                          Reset
                        </button>
                      )}
                      <select
                        value={partOverrides[slot] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPartOverrides(p => v ? { ...p, [slot]: v } : (({ [slot]: _, ...rest }) => rest)(p));
                        }}
                        className="px-1.5 py-1 bg-bg3 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                      >
                        <option value="">-- swap --</option>
                      </select>
                    </div>
                  ))}
                  <div className="text-[11px] text-theme-faint mt-1">
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
            tabs={buildBeybladeTabs(TypeBadge, comboById) as any}
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
            <div className="grid grid-cols-3 gap-2">
              {(["medium","hard","hell"] as Difficulty[]).map(d => {
                const info = DIFFICULTY_INFO[d];
                const active = difficulty === d;
                return (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className="px-3 py-[14px] rounded-[10px] cursor-pointer text-left text-theme-text"
                    style={{
                      "--dc": info.color,
                      background: active ? `color-mix(in srgb, var(--dc) 13%, transparent)` : C.bg2,
                      border: `1px solid ${active ? "var(--dc)" : C.border}`,
                    } as React.CSSProperties}>
                    <div className="font-bold text-[14px]" style={{ color: active ? "var(--dc)" : C.text } as React.CSSProperties}>{info.label}</div>
                    <div className="text-[11px] text-theme-faint mt-1 leading-[1.4]">{info.desc}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* AI opponent count */}
          <Section title="Opponent Count" icon="🤖">
            <div className="flex items-center gap-4">
              <label className="text-theme-muted text-[13px] min-w-[80px]">AI Bots:</label>
              <input
                type="number"
                name="ai-count"
                min={1}
                max={7}
                value={aiCount}
                onChange={e => setAiCount(Math.min(7, Math.max(1, Number(e.target.value))))}
                className="w-16 px-2.5 py-2 rounded-lg text-[15px] font-bold bg-bg2 border border-border-c text-theme-text text-center"
              />
              <span className="text-theme-faint text-[12px]">
                {aiCount === 1 ? "1v1 classic" : `1 human vs ${aiCount} AI bots`}
              </span>
            </div>
          </Section>

          {/* Series format */}
          <Section title="Series Format" icon="🏅">
            <div className="grid grid-cols-3 gap-2">
              {([1,3,5] as BestOf[]).map(n => (
                <button key={n} onClick={() => setBestOf(n)}
                  className={`px-3 py-[14px] rounded-[10px] cursor-pointer text-center font-bold text-[14px] border ${bestOf === n ? "bg-blue-13 border-theme-blue text-theme-blue" : "bg-bg2 border-border-c text-theme-text"}`}
                >
                  BO{n}
                  <div className="text-[11px] text-theme-faint font-normal mt-1">
                    {n === 1 ? "Single match" : `First to ${Math.ceil(n / 2)} wins`}
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!playerBeyId || !aiBeyId || !arenaId || modeDisabled}
            className="py-4 rounded-[14px] font-bold text-[16px] bg-theme-purple text-white border-none cursor-pointer transition-[background_150ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab builders for the EntityPicker ────────────────────────────────────

function buildBeybladeTabs(TypeBadge: (p: { type: string }) => React.ReactElement, comboById: Record<string, ComboDoc> = {}) {
  return [
    {
      id: "preview",
      label: "Preview",
      render: (sel: EntityOption | null) => {
        if (!sel) return <EmptyHint>Pick a beyblade.</EmptyHint>;
        const b = sel.data as BeybladeOption;
        return (
          <div className="flex flex-col gap-3">
            <div
              className="w-full max-w-[280px] mx-auto rounded-full border border-dashed border-border-c flex items-center justify-center text-theme-faint text-[12px] aspect-square"
              style={{ background: `radial-gradient(circle at center, var(--bg2) 0%, var(--bg0) 70%)` }}
            >
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.displayName} className="max-w-[80%] max-h-[80%] object-contain" />
              ) : (
                <span>(static preview)</span>
              )}
            </div>
            <div className="flex gap-1.5 items-center justify-center">
              <TypeBadge type={b.type} />
              <span className="text-[11px] text-theme-faint">↻ {b.spinDirection} spin</span>
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
          <div className="flex flex-col gap-2.5">
            <StatBar label="Attack"  value={td.attack}  max={200} color={C.red} />
            <StatBar label="Defense" value={td.defense} max={200} color={C.blue} />
            <StatBar label="Stamina" value={td.stamina} max={200} color={C.green} />
            <div className="flex gap-4 mt-2 text-[12px] text-theme-muted">
              <span>mass: <b className="text-theme-text">{b.mass ?? "—"}g</b></span>
              <span>radius: <b className="text-theme-text">{b.radius ?? "—"}cm</b></span>
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
            <div className="text-[14px] font-bold text-theme-text">{b.specialMoveId}</div>
            <div className="text-[12px] text-theme-muted mt-1">
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
        const combos = (b.comboIds ?? []).map((id) => comboById[id]).filter(Boolean) as ComboDoc[];
        if (combos.length === 0) return <EmptyHint>This beyblade has no combos.</EmptyHint>;
        return (
          <div className="flex flex-col gap-2">
            {combos.map((c) => (
              <div key={c.id} className="bg-bg2 border border-border-c rounded-lg px-2.5 py-2">
                <div className="flex justify-between">
                  <span className="text-[13px] font-bold text-theme-text">{c.name}</span>
                  <span className={`text-[11px] font-mono ${c.cost === 0 ? "text-theme-yellow" : "text-theme-faint"}`}>{costIcon(c.cost)}</span>
                </div>
                <div className="text-[11px] text-theme-muted mt-1">{c.description}</div>
                <div className="flex gap-1 mt-1.5">
                  {c.sequence.map((k, i) => (
                    <span key={i} className="bg-bg3 px-1.5 py-0.5 rounded font-mono text-[10px]">{KEY_LABEL[k as keyof typeof KEY_LABEL]}</span>
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
          <div className="flex flex-col gap-3">
            <div
              className="w-full max-w-[280px] mx-auto border border-border-c flex items-center justify-center text-theme-faint text-[12px] aspect-square"
              style={{
                background: `radial-gradient(circle at center, var(--bg2) 0%, var(--bg0) 75%)`,
                borderRadius: a.shape === "rectangle" ? 16 : "50%",
              }}
            >
              <span>{a.shape ?? "circle"} · {a.theme ?? "default"}</span>
            </div>
            <div className="text-center text-theme-muted text-[12px]">
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
          <div className="flex flex-col gap-1.5 text-theme-muted text-[13px]">
            <div>shape: <b className="text-theme-text">{a.shape ?? "circle"}</b></div>
            <div>theme: <b className="text-theme-text">{a.theme ?? "default"}</b></div>
            <div>difficulty: <b className="text-theme-text capitalize">{a.difficulty}</b></div>
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
          <div className="flex flex-col gap-1 text-[13px]">
            {items.map((i) => i.count > 0 && (
              <div key={i.label} className="flex justify-between">
                <span className="text-theme-muted">{i.label}</span>
                <span className="text-theme-text font-mono">{i.count}</span>
              </div>
            ))}
          </div>
        );
      },
    },
  ];
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <div className="text-theme-faint text-[12px] text-center p-6">{children}</div>;
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(1, value / max);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-theme-muted mb-1">
        <span>{label}</span><span className="font-mono">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-bg2 rounded-full overflow-hidden">
        <div className="h-full w-pct" style={{ "--pct": `${pct * 100}%`, background: color } as React.CSSProperties} />
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg1 rounded-2xl border border-border-c overflow-hidden">
      <div className="px-4 py-3 border-b border-border-c flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-semibold text-[14px] text-theme-text">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function BeyCard({ bey, selected, onSelect, TypeBadge, dim = false }: {
  bey: BeybladeOption; selected: boolean; onSelect: () => void;
  TypeBadge: (p: { type: string }) => React.ReactElement; dim?: boolean;
}) {
  return (
    <button onClick={onSelect}
      className={`px-3 py-2.5 rounded-[10px] text-left cursor-pointer text-theme-text border ${selected ? "bg-blue-13 border-theme-blue" : "bg-bg2 border-border-c"}`}
      style={{ opacity: dim ? 0.45 : 1 }}
    >
      <div className="font-semibold text-[13px] mb-1">{bey.displayName}</div>
      <div className="flex gap-1.5 items-center">
        <TypeBadge type={bey.type} />
        <span className="text-[10px] text-theme-faint">{bey.spinDirection}</span>
      </div>
    </button>
  );
}
