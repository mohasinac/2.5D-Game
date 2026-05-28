import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";

interface ComboEffectDoc {
  id: string;
  name: string;
  description: string;
  effectType: string;
  magnitude: number;
  duration?: number;
  icon?: string;
}

const EFFECT_TYPE_OPTIONS = [
  { value: "damage_multiplier", label: "Damage Multiplier", hint: "Multiply outgoing damage" },
  { value: "spin_drain", label: "Spin Drain", hint: "Drain opponent spin on hit" },
  { value: "spin_boost", label: "Spin Boost", hint: "Boost own spin" },
  { value: "lock", label: "Lock", hint: "Briefly immobilise opponent" },
  { value: "knockback", label: "Knockback", hint: "Extra knockback force" },
  { value: "combo_extender", label: "Combo Extender", hint: "Extend combo window" },
  { value: "shield", label: "Shield", hint: "Absorb incoming damage" },
  { value: "area_blast", label: "Area Blast", hint: "AoE shockwave around user" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const inputCls = "w-full px-[10px] py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

const EMPTY = { name: "", description: "", effectType: "damage_multiplier", magnitude: 1.2, duration: 0, icon: "⚡" };

export default function ComboEffectsPage() {
  const [items, setItems] = useState<ComboEffectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ComboEffectDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<ComboEffectDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COMBO_EFFECTS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ComboEffectDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load combo effects"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: ComboEffectDoc) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, effectType: item.effectType, magnitude: item.magnitude, duration: item.duration ?? 0, icon: item.icon ?? "⚡" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data: Omit<ComboEffectDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), effectType: form.effectType,
        magnitude: form.magnitude, icon: form.icon,
        ...(form.duration > 0 ? { duration: form.duration } : {}),
      };
      const id = editing ? editing.id : slugify(form.name) || `effect-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.COMBO_EFFECTS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.COMBO_EFFECTS, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  return (
    <div className="p-6 w-full box-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Combo Effects</h1>
          <p className="text-theme-faint text-[13px] mt-1">{loading ? "Loading…" : `${items.length} effects`}</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer">
          + New Effect
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter effects…"
        className={cn(inputCls, "mb-3")} />

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No effects found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-[14px] bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="text-[24px] w-8 text-center shrink-0">{item.icon ?? "⚡"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-theme-text text-[14px]">{item.name}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-[6px] py-[1px] rounded">{item.id}</span>
                  <span className="text-[11px] bg-theme-yellow/[.13] text-theme-yellow px-[7px] py-[2px] rounded">{item.effectType}</span>
                  <span className="text-[11px] text-theme-muted">×{item.magnitude}</span>
                  {item.duration && <span className="text-[11px] text-theme-muted">{item.duration}ms</span>}
                </div>
                {item.description && <div className="text-[12px] text-theme-muted mt-[3px]">{item.description}</div>}
              </div>
              <button onClick={() => openEdit(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
              <button onClick={() => setConfirmDelete(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit Combo Effect" : "New Combo Effect"}</h3>

            <div className="grid gap-3 mb-[14px] grid-cols-[1fr_auto]">
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Name</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                {!editing && form.name && <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>}
              </label>
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className={cn(inputCls, "w-14 text-center text-[20px]")} />
              </label>
            </div>

            <div className="mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Effect Type</span>
              <SearchableSelect value={form.effectType} onChange={v => setForm(f => ({ ...f, effectType: v }))} options={EFFECT_TYPE_OPTIONS} placeholder="Effect type…" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-[14px]">
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Magnitude</span>
                <input type="number" step="0.05" value={form.magnitude} onChange={e => setForm(f => ({ ...f, magnitude: Number(e.target.value) }))} className={inputCls} />
              </label>
              <label>
                <span className="text-[12px] text-theme-muted block mb-1">Duration (ms, 0 = instant)</span>
                <input type="number" min={0} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} className={inputCls} />
              </label>
            </div>

            <label className="block mb-5">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={cn(inputCls, "resize-y")} />
            </label>

            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setShowModal(false)} className="px-[18px] py-2 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className={cn("px-[18px] py-2 rounded-lg text-[13px] border-none bg-theme-blue text-white cursor-pointer", saving && "opacity-60")}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[min(400px,calc(100vw-2rem))]">
            <h3 className="text-[16px] font-bold text-theme-text mb-[10px]">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">This will permanently remove the combo effect.</p>
            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
