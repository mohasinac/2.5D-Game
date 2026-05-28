import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { cn } from "@/lib/cn";
import { KEY_LABEL, type ComboKey } from "@/constants/combos";
import toast from "react-hot-toast";

interface ComboEffect {
  damageMultiplier?: number;
  dashDirection?: string;
  forceImpulse?: number;
  durationMs?: number;
  lockMs?: number;
  spinStealBonus?: number;
  microSpinBoost?: number;
}

interface MechanicInstance {
  mechanicId: string;
  params?: Record<string, unknown>;
  condition?: string;
  duration?: number;
  priority?: number;
  sourceLabel?: string;
}

interface ComboDoc {
  id: string;
  name: string;
  sequence: string[];
  cost: number;
  type: string;
  description: string;
  cooldownMs: number;
  windowMs?: number;
  effectId?: string;
  effect?: ComboEffect;
  effectRefs?: MechanicInstance[];
}

const KEY_OPTIONS = (Object.keys(KEY_LABEL) as ComboKey[]).map(k => ({
  value: k,
  label: `${KEY_LABEL[k]}  ${k}`,
}));

const COST_OPTIONS = [
  { value: "0", label: "⚡ 0 — Free" },
  { value: "15", label: "🔋 15 — Low cost" },
  { value: "25", label: "🔋 25 — Medium cost" },
  { value: "35", label: "🔋 35 — High cost" },
];

const TYPE_OPTIONS = [
  { value: "universal", label: "Universal" },
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function tryParseJson(s: string): unknown[] | null {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : null; } catch { return null; }
}

const EMPTY = {
  name: "", sequence: ["moveLeft", "moveRight", "attack"] as [string,string,string],
  cost: 0, type: "universal", description: "", cooldownMs: 1200,
  windowMs: 400, effectId: "",
  effect: { damageMultiplier: 1.0, dashDirection: "none", forceImpulse: 0, durationMs: 0, lockMs: 0, spinStealBonus: 0, microSpinBoost: 0 },
  effectRefsJson: "[]",
};

const DASH_DIRS = [
  { value: "none", label: "None" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "back", label: "Back" },
];

const INP = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-sm";

export function CombosPage() {
  const [items, setItems] = useState<ComboDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ComboDoc | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY, effect: { ...EMPTY.effect } });
  const [effectRefsError, setEffectRefsError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<ComboDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [comboEffectOptions, setComboEffectOptions] = useState<{ value: string; label: string }[]>([]);
  const invalidate = useGameDataStore(s => s.invalidate);

  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.COMBO_EFFECTS)).then(snap => {
      setComboEffectOptions(
        snap.docs.map(d => ({ value: d.id, label: (d.data().name as string | undefined) ?? d.id }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    }).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COMBOS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ComboDoc));
      docs.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load combos"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY, effect: { ...EMPTY.effect } }); setEffectRefsError(""); setShowModal(true); };
  const openEdit = (item: ComboDoc) => {
    setEditing(item);
    setForm({
      name: item.name,
      sequence: [item.sequence[0] ?? "moveLeft", item.sequence[1] ?? "moveRight", item.sequence[2] ?? "attack"],
      cost: item.cost, type: item.type, description: item.description ?? "", cooldownMs: item.cooldownMs,
      windowMs: item.windowMs ?? 400, effectId: item.effectId ?? "",
      effect: { ...EMPTY.effect, ...(item.effect ?? {}) },
      effectRefsJson: item.effectRefs ? JSON.stringify(item.effectRefs, null, 2) : "[]",
    });
    setEffectRefsError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.sequence.some(k => !k)) { toast.error("All 3 keys are required"); return; }
    const effectRefs = tryParseJson(form.effectRefsJson);
    if (effectRefs === null) { toast.error("Effect Refs JSON must be a valid array"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = { name: form.name.trim(), sequence: form.sequence, cost: form.cost, type: form.type, description: form.description.trim(), cooldownMs: form.cooldownMs, windowMs: form.windowMs, effectId: form.effectId.trim() || undefined, effect: form.effect };
      if (effectRefs.length > 0) data.effectRefs = effectRefs;
      const id = editing ? editing.id : slugify(form.name) || `combo-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.COMBOS, id), data);
      invalidate("combos");
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.COMBOS, confirmDelete.id));
      invalidate("combos");
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  return (
    <div className="page-shell p-4 sm:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Combos</h1>
          <p className="text-theme-faint text-sm mt-1">{loading ? "Loading…" : `${items.length} combos`}</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-sm font-medium border-none cursor-pointer">
          + New Combo
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter combos…"
        className={`${INP} mb-3`} />

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No combos found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-theme-text text-sm">{item.name}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
                  <span className="text-[11px] bg-blue-10 text-theme-blue px-[7px] py-0.5 rounded">{item.type}</span>
                  <span className="text-[11px] bg-yellow-10 text-theme-yellow px-[7px] py-0.5 rounded">cost {item.cost}</span>
                  <span className="text-[11px] text-theme-muted">cd {item.cooldownMs}ms</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {item.sequence.map((k, i) => (
                    <span key={i} className="bg-bg2 px-2.5 py-0.5 rounded font-mono text-sm text-theme-green font-bold">
                      {KEY_LABEL[k as ComboKey] ?? k}
                    </span>
                  ))}
                </div>
                {item.description && <div className="text-xs text-theme-muted mt-1">{item.description}</div>}
              </div>
              <button onClick={() => openEdit(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
              <button onClick={() => setConfirmDelete(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit Combo" : "New Combo"}</h3>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={INP} />
              {!editing && form.name && <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>}
            </label>

            <div className="mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Sequence (3 keys)</span>
              <div className="grid grid-cols-3 gap-2">
                {([0, 1, 2] as const).map(i => (
                  <SearchableSelect key={i} value={form.sequence[i]}
                    onChange={v => setForm(f => { const s = [...f.sequence] as [string, string, string]; s[i] = v; return { ...f, sequence: s }; })}
                    options={KEY_OPTIONS} placeholder={`Key ${i + 1}`} />
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                {form.sequence.map((k, i) => (
                  <span key={i} className="bg-bg2 px-3 py-[3px] rounded font-mono text-base text-theme-green font-bold">
                    {KEY_LABEL[k as ComboKey] ?? k}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
              <div>
                <span className="text-xs text-theme-muted block mb-1">Cost</span>
                <SearchableSelect value={String(form.cost)} onChange={v => setForm(f => ({ ...f, cost: Number(v) }))} options={COST_OPTIONS} placeholder="Cost…" />
              </div>
              <div>
                <span className="text-xs text-theme-muted block mb-1">Type</span>
                <SearchableSelect value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={TYPE_OPTIONS} placeholder="Type…" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
              <label className="block">
                <span className="text-xs text-theme-muted block mb-1">Cooldown (ms)</span>
                <input type="number" min={0} value={form.cooldownMs} onChange={e => setForm(f => ({ ...f, cooldownMs: Number(e.target.value) }))} className={INP} />
              </label>
              <label className="block">
                <span className="text-xs text-theme-muted block mb-1">Window (ms) — max time between keys</span>
                <input type="number" min={100} max={800} step={50} value={form.windowMs} onChange={e => setForm(f => ({ ...f, windowMs: Number(e.target.value) }))} className={INP} />
              </label>
            </div>

            <div className="mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">
                Effect ID <span className="text-theme-faint font-normal">(optional — links to combo_effects collection)</span>
              </span>
              <SearchableSelect
                value={form.effectId}
                onChange={v => setForm(f => ({ ...f, effectId: v }))}
                options={[{ value: "", label: "— none —" }, ...comboEffectOptions]}
                placeholder="Search combo effects…"
              />
            </div>

            <div className="border border-border-c rounded-[10px] p-3.5 mb-3.5">
              <div className="text-xs font-semibold text-theme-muted mb-3">Combat Effect</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {([
                  ["Damage Multiplier (1.0–1.5)", "damageMultiplier", 1.0, 1.5, 0.05] as const,
                  ["Force Impulse", "forceImpulse", 0, 5000, 50] as const,
                  ["Duration (ms)", "durationMs", 0, 1000, 50] as const,
                  ["Lock Opponent (ms)", "lockMs", 0, 300, 10] as const,
                  ["Spin Steal Bonus", "spinStealBonus", 0, 0.1, 0.005] as const,
                  ["Micro Spin Boost", "microSpinBoost", 0, 50, 1] as const,
                ] as const).map(([label, field, min, max, step]) => (
                  <label key={field} className="block">
                    <span className="text-[11px] text-theme-muted block mb-[3px]">{label}</span>
                    <input type="number" min={min} max={max} step={step}
                      value={(form.effect as any)[field] ?? min}
                      onChange={e => setForm(f => ({ ...f, effect: { ...f.effect, [field]: Number(e.target.value) } }))}
                      className="w-full px-2 py-1.5 bg-bg0 border border-border-c rounded-lg text-theme-text text-xs" />
                  </label>
                ))}
              </div>
              <div className="mt-2.5">
                <span className="text-[11px] text-theme-muted block mb-[3px]">Dash Direction</span>
                <div className="flex gap-1.5">
                  {DASH_DIRS.map(d => (
                    <button key={d.value} onClick={() => setForm(f => ({ ...f, effect: { ...f.effect, dashDirection: d.value } }))}
                      className={cn(
                        "px-3 py-[5px] text-[11px] rounded-md cursor-pointer border",
                        form.effect.dashDirection === d.value
                          ? "bg-blue-10 text-theme-blue border-theme-blue/35"
                          : "bg-transparent text-theme-muted border-border-c"
                      )}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">
                Effect Refs (MechanicInstance[]) — JSON array
                {effectRefsError && <span className="text-theme-red ml-2">{effectRefsError}</span>}
              </span>
              <textarea
                value={form.effectRefsJson}
                onChange={e => { setForm(f => ({ ...f, effectRefsJson: e.target.value })); setEffectRefsError(tryParseJson(e.target.value) === null ? "Must be a JSON array" : ""); }}
                rows={4}
                className={`${INP} resize-y font-mono text-xs`}
                placeholder={'[\n  { "mechanicId": "velocity_burst", "params": { "forceX": 0.12 } }\n]'}
              />
            </label>

            <label className="block mb-5">
              <span className="text-xs text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={`${INP} resize-y`} />
            </label>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-[18px] py-2 rounded-lg text-sm border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-[18px] py-2 rounded-lg text-sm border-none bg-theme-blue text-white cursor-pointer disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-theme-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-sm mb-5">This will permanently remove the combo. Beyblades with this combo ID will keep the reference but show nothing.</p>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-sm border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-sm border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
