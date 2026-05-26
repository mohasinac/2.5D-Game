import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type SpecialMoveDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { PX_PER_CM_BASE } from "@/constants/units";
import { useDefsDocs } from "@/hooks/useDefsDocs";
import toast from "react-hot-toast";

const FALLBACK_KIND_OPTIONS = [
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

const FALLBACK_TYPE_OPTIONS = [
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

interface MechanicInstance {
  mechanicId: string;
  params?: Record<string, unknown>;
  condition?: string;
  duration?: number;
  priority?: number;
  sourceLabel?: string;
}

function tryParseJson(s: string): unknown[] | null {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : null; } catch { return null; }
}

const EMPTY_EFFECTS = { linearImpulse: 0, spinDelta: 0, invulnerabilityMs: 0, spinStealRadiusPx: 0, aoeRadiusPx: 0, knockbackImpulse: 0 };
const EMPTY = { name: "", kind: "attack", iconEmoji: "⚡", cooldownSec: 15, durationMs: 1500, description: "", isDefault: false, type: "attack", flashColor: "#ffffff", effects: { ...EMPTY_EFFECTS }, mechanicRefsJson: "[]" };

type SpecialMoveDocWithMechanicRefs = SpecialMoveDoc & { mechanicRefs?: MechanicInstance[] };

/** Tailwind badge class per kind */
const KIND_BADGE_CLS: Record<string, string> = {
  attack:   "bg-theme-red/[.13] text-theme-red",
  defense:  "bg-blue-10 text-theme-blue",
  stamina:  "bg-theme-green/[.13] text-theme-green",
  balanced: "bg-theme-yellow/[.13] text-theme-yellow",
};

export function SpecialMovesPage() {
  const beyTypeDocs = useDefsDocs(COLLECTIONS.BEY_TYPE_DEFS);
  const typeOptions = beyTypeDocs.length > 0
    ? beyTypeDocs.map(d => ({ value: d.id, label: d.label }))
    : FALLBACK_TYPE_OPTIONS;
  const kindOptions = beyTypeDocs.length > 0
    ? beyTypeDocs.map(d => ({ value: d.id, label: d.label }))
    : FALLBACK_KIND_OPTIONS;

  const [items, setItems] = useState<SpecialMoveDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SpecialMoveDoc | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY, effects: { ...EMPTY_EFFECTS } });
  const [mechanicRefsError, setMechanicRefsError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<SpecialMoveDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.SPECIAL_MOVES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as SpecialMoveDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load special moves"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY, effects: { ...EMPTY_EFFECTS } }); setMechanicRefsError(""); setShowModal(true); };
  const openEdit = (item: SpecialMoveDoc) => {
    setEditing(item);
    const ext = item as SpecialMoveDocWithMechanicRefs;
    setForm({
      name: item.name, kind: item.kind, iconEmoji: item.iconEmoji,
      cooldownSec: item.cooldownSec, durationMs: item.durationMs,
      description: item.description ?? "", isDefault: item.isDefault ?? false,
      type: item.type ?? "attack", flashColor: item.flashColor ?? "#ffffff",
      effects: { ...EMPTY_EFFECTS, ...((item as any).effects ?? {}) },
      mechanicRefsJson: ext.mechanicRefs ? JSON.stringify(ext.mechanicRefs, null, 2) : "[]",
    });
    setMechanicRefsError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const mechanicRefs = tryParseJson(form.mechanicRefsJson);
    if (mechanicRefs === null) { toast.error("Mechanic Refs JSON must be a valid array"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        name: form.name.trim(), kind: form.kind, iconEmoji: form.iconEmoji,
        cooldownSec: form.cooldownSec, durationMs: form.durationMs,
        description: form.description.trim(), isDefault: form.isDefault,
        type: form.type, flashColor: form.flashColor, effects: form.effects,
      };
      if (mechanicRefs.length > 0) data.mechanicRefs = mechanicRefs;
      const id = editing ? editing.id : slugify(form.name) || `move-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.SPECIAL_MOVES, id), data);
      invalidate("specialMoves");
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.SPECIAL_MOVES, confirmDelete.id));
      invalidate("specialMoves");
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  const inputCls = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

  return (
    <div className="page-shell p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Special Moves</h1>
          <p className="text-theme-faint text-[13px] mt-1">{loading ? "Loading…" : `${items.length} special moves`}</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer"
        >
          + New Move
        </button>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter moves…"
        className={`${inputCls} mb-3`}
      />

      {loading ? (
        <div className="text-theme-muted">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-theme-muted">No special moves found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="text-[28px] shrink-0 w-10 text-center">{item.iconEmoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-theme-text text-[14px]">{item.name}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
                  <span className={`text-[11px] px-[7px] py-0.5 rounded ${KIND_BADGE_CLS[item.kind] ?? "bg-blue-10 text-theme-blue"}`}>
                    {item.kind}
                  </span>
                  {item.isDefault && (
                    <span className="text-[10px] font-bold text-theme-blue bg-blue-10 px-1.5 py-px rounded tracking-[0.05em]">
                      DEFAULT
                    </span>
                  )}
                  <span className="text-[11px] text-theme-muted">cd {item.cooldownSec}s · {item.durationMs}ms</span>
                </div>
                {item.description && (
                  <div className="text-[12px] text-theme-muted mt-1">{item.description}</div>
                )}
              </div>
              <button
                onClick={() => openEdit(item)}
                className="px-3.5 py-1.5 rounded-[7px] text-[12px] cursor-pointer border border-border-c bg-transparent text-theme-muted"
              >Edit</button>
              <button
                onClick={() => setConfirmDelete(item)}
                className="px-3.5 py-1.5 rounded-[7px] text-[12px] cursor-pointer border border-theme-red/40 bg-transparent text-theme-red"
              >Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">
              {editing ? "Edit Special Move" : "New Special Move"}
            </h3>

            <div className="grid grid-cols-[1fr_auto] gap-3 mb-3.5">
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Name</span>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
                {!editing && form.name && (
                  <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>
                )}
              </label>
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Icon</span>
                <input
                  value={form.iconEmoji}
                  onChange={e => setForm(f => ({ ...f, iconEmoji: e.target.value }))}
                  className="w-16 px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[22px] text-center box-border"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div>
                <span className="text-[12px] text-theme-muted block mb-1">Kind</span>
                <SearchableSelect value={form.kind} onChange={v => setForm(f => ({ ...f, kind: v }))} options={kindOptions} placeholder="Kind…" />
              </div>
              <div>
                <span className="text-[12px] text-theme-muted block mb-1">Type affinity</span>
                <SearchableSelect value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={typeOptions} placeholder="Type…" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Cooldown (sec)</span>
                <input type="number" min={0} value={form.cooldownSec}
                  onChange={e => setForm(f => ({ ...f, cooldownSec: Number(e.target.value) }))}
                  className={inputCls} />
              </label>
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Duration (ms)</span>
                <input type="number" min={0} value={form.durationMs}
                  onChange={e => setForm(f => ({ ...f, durationMs: Number(e.target.value) }))}
                  className={inputCls} />
              </label>
            </div>

            <label className="block mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">Flash Color (hex)</span>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.flashColor}
                  onChange={e => setForm(f => ({ ...f, flashColor: e.target.value }))}
                  className="w-10 h-9 border border-border-c rounded-md cursor-pointer p-0.5"
                />
                <input
                  value={form.flashColor}
                  onChange={e => setForm(f => ({ ...f, flashColor: e.target.value }))}
                  className={`${inputCls} flex-1 w-auto`}
                  placeholder="#ffffff"
                />
              </div>
            </label>

            <div className="border border-border-c rounded-[10px] p-3.5 mb-3.5">
              <div className="text-[12px] font-semibold text-theme-muted mb-3">Physics Effects</div>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  ["Linear Impulse (0–10000)", "linearImpulse", 0, 10000, 100, false],
                  ["Spin Delta (−500–500)", "spinDelta", -500, 500, 10, false],
                  ["Invulnerability (ms)", "invulnerabilityMs", 0, 3000, 100, false],
                  ["Spin Steal Radius (cm)", "spinStealRadiusPx", 0, 16.5, 0.5, true],
                  ["AoE Radius (cm)", "aoeRadiusPx", 0, 16.5, 0.5, true],
                  ["Knockback Impulse", "knockbackImpulse", 0, 5000, 50, false],
                ] as [string, string, number, number, number, boolean][]).map(([label, field, min, max, step, isPx]) => {
                  const rawVal = (form.effects as any)[field] ?? 0;
                  const displayVal = isPx ? Math.round(rawVal / PX_PER_CM_BASE * 10) / 10 : rawVal;
                  return (
                    <label key={field} className="block">
                      <span className="text-[11px] text-theme-muted block mb-[3px]">{label}</span>
                      <input
                        type="number" min={min} max={max} step={step}
                        value={displayVal}
                        onChange={e => setForm(f => ({
                          ...f,
                          effects: {
                            ...f.effects,
                            [field]: isPx
                              ? Math.round(Number(e.target.value) * PX_PER_CM_BASE)
                              : Number(e.target.value),
                          },
                        }))}
                        className="w-full px-2 py-1.5 bg-bg0 border border-border-c rounded-lg text-theme-text text-[12px] box-border"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <label className="block mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">
                Mechanic Refs (MechanicInstance[]) — JSON array
                {mechanicRefsError && <span className="text-theme-red ml-2">{mechanicRefsError}</span>}
              </span>
              <textarea
                value={form.mechanicRefsJson}
                onChange={e => {
                  setForm(f => ({ ...f, mechanicRefsJson: e.target.value }));
                  setMechanicRefsError(tryParseJson(e.target.value) === null ? "Must be a JSON array" : "");
                }}
                rows={4}
                className={`${inputCls} resize-y font-mono text-[12px]`}
                placeholder={'[\n  { "mechanicId": "attack_amplifier", "params": { "multiplier": 1.3 }, "duration": 1000 }\n]'}
              />
            </label>

            <label className="block mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className={`${inputCls} resize-y`}
              />
            </label>

            <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
              />
              <span className="text-[13px] text-theme-text">Default for type (auto-assign to new beyblades)</span>
            </label>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-[18px] py-2 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer"
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-[18px] py-2 rounded-lg text-[13px] border-none bg-theme-blue text-white cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-[16px] font-bold text-theme-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">This will permanently remove the special move from Firebase.</p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer"
              >Cancel</button>
              <button
                onClick={handleDelete}
                className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
