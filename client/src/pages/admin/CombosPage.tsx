import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
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

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: "var(--bg0, #0f172a)",
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

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
  const invalidate = useGameDataStore(s => s.invalidate);

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
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Combos</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} combos`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Combo
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter combos…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No combos found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                  <span style={{ fontSize: 11, background: C.blue + "22", color: C.blue, padding: "2px 7px", borderRadius: 4 }}>{item.type}</span>
                  <span style={{ fontSize: 11, background: C.yellow + "22", color: C.yellow, padding: "2px 7px", borderRadius: 4 }}>cost {item.cost}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>cd {item.cooldownMs}ms</span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {item.sequence.map((k, i) => (
                    <span key={i} style={{ background: C.bg2, padding: "2px 10px", borderRadius: 4, fontFamily: "monospace", fontSize: 14, color: C.green, fontWeight: 700 }}>
                      {KEY_LABEL[k as ComboKey] ?? k}
                    </span>
                  ))}
                </div>
                {item.description && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{item.description}</div>}
              </div>
              <button onClick={() => openEdit(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>Edit</button>
              <button onClick={() => setConfirmDelete(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.red}66`, background: "transparent", color: C.red }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Combo" : "New Combo"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              {!editing && form.name && <span style={{ fontSize: 11, color: C.faint }}>ID: {slugify(form.name) || "…"}</span>}
            </label>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Sequence (3 keys)</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {([0, 1, 2] as const).map(i => (
                  <SearchableSelect key={i} value={form.sequence[i]}
                    onChange={v => setForm(f => { const s = [...f.sequence] as [string, string, string]; s[i] = v; return { ...f, sequence: s }; })}
                    options={KEY_OPTIONS} placeholder={`Key ${i + 1}`} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {form.sequence.map((k, i) => (
                  <span key={i} style={{ background: C.bg2, padding: "3px 12px", borderRadius: 4, fontFamily: "monospace", fontSize: 16, color: C.green, fontWeight: 700 }}>
                    {KEY_LABEL[k as ComboKey] ?? k}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Cost</span>
                <SearchableSelect value={String(form.cost)} onChange={v => setForm(f => ({ ...f, cost: Number(v) }))} options={COST_OPTIONS} placeholder="Cost…" />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Type</span>
                <SearchableSelect value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={TYPE_OPTIONS} placeholder="Type…" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Cooldown (ms)</span>
                <input type="number" min={0} value={form.cooldownMs} onChange={e => setForm(f => ({ ...f, cooldownMs: Number(e.target.value) }))} style={inputStyle} />
              </label>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Window (ms) — max time between keys</span>
                <input type="number" min={100} max={800} step={50} value={form.windowMs} onChange={e => setForm(f => ({ ...f, windowMs: Number(e.target.value) }))} style={inputStyle} />
              </label>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Effect ID <span style={{ color: C.faint, fontWeight: 400 }}>(optional — links to combo_effects collection)</span></span>
              <input value={form.effectId} onChange={e => setForm(f => ({ ...f, effectId: e.target.value }))}
                placeholder="e.g. quick-dash-l-effect" style={inputStyle} />
            </label>

            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Combat Effect</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([
                  ["Damage Multiplier (1.0–1.5)", "damageMultiplier", 1.0, 1.5, 0.05] as const,
                  ["Force Impulse", "forceImpulse", 0, 5000, 50] as const,
                  ["Duration (ms)", "durationMs", 0, 1000, 50] as const,
                  ["Lock Opponent (ms)", "lockMs", 0, 300, 10] as const,
                  ["Spin Steal Bonus", "spinStealBonus", 0, 0.1, 0.005] as const,
                  ["Micro Spin Boost", "microSpinBoost", 0, 50, 1] as const,
                ] as const).map(([label, field, min, max, step]) => (
                  <label key={field} style={{ display: "block" }}>
                    <span style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 3 }}>{label}</span>
                    <input type="number" min={min} max={max} step={step}
                      value={(form.effect as any)[field] ?? min}
                      onChange={e => setForm(f => ({ ...f, effect: { ...f.effect, [field]: Number(e.target.value) } }))}
                      style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }} />
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 3 }}>Dash Direction</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {DASH_DIRS.map(d => (
                    <button key={d.value} onClick={() => setForm(f => ({ ...f, effect: { ...f.effect, dashDirection: d.value } }))}
                      style={{ padding: "5px 12px", fontSize: 11, borderRadius: 6, cursor: "pointer",
                        background: form.effect.dashDirection === d.value ? C.blue + "22" : C.bg2,
                        color: form.effect.dashDirection === d.value ? C.blue : C.muted,
                        border: `1px solid ${form.effect.dashDirection === d.value ? C.blue + "55" : C.border}` }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>
                Effect Refs (MechanicInstance[]) — JSON array
                {effectRefsError && <span style={{ color: "#e74c3c", marginLeft: 8 }}>{effectRefsError}</span>}
              </span>
              <textarea
                value={form.effectRefsJson}
                onChange={e => { setForm(f => ({ ...f, effectRefsJson: e.target.value })); setEffectRefsError(tryParseJson(e.target.value) === null ? "Must be a JSON array" : ""); }}
                rows={4}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
                placeholder={'[\n  { "mechanicId": "velocity_burst", "params": { "forceX": 0.12 } }\n]'}
              />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, border: "none", background: C.blue, color: "#fff", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.name}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will permanently remove the combo. Beyblades with this combo ID will keep the reference but show nothing.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: "none", background: C.red, color: "#fff", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
