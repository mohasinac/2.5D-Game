import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface RoundModifierDoc {
  id: string;
  name: string;
  description: string;
  modifierType: string;
  magnitude: number;
  condition: string;
  stackable: boolean;
  icon?: string;
}

const MODIFIER_TYPE_OPTIONS = [
  { value: "damage_amp", label: "Damage Amplifier", hint: "Multiply all damage dealt" },
  { value: "speed_amp", label: "Speed Amplifier", hint: "Multiply movement speed" },
  { value: "defense_amp", label: "Defense Amplifier", hint: "Multiply damage reduction" },
  { value: "spin_decay_rate", label: "Spin Decay Rate", hint: "Modify spin loss per second" },
  { value: "power_regen", label: "Power Regen", hint: "Modify power regeneration rate" },
  { value: "ring_size", label: "Ring Size", hint: "Scale the arena boundary radius" },
  { value: "gravity", label: "Gravity", hint: "Modify gravitational pull on beyblades" },
  { value: "friction", label: "Friction", hint: "Modify surface friction coefficient" },
];

const CONDITION_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "low_spin", label: "Low Spin (<40%)" },
  { value: "high_spin", label: "High Spin (>80%)" },
  { value: "low_hp", label: "Low HP (<25%)" },
  { value: "first_blood", label: "First Blood" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const INP = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-sm";

const EMPTY = { name: "", description: "", modifierType: "damage_amp", magnitude: 1.2, condition: "always", stackable: false, icon: "🔧" };

export default function RoundModifiersPage() {
  const [items, setItems] = useState<RoundModifierDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RoundModifierDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<RoundModifierDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ROUND_MODIFIERS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as RoundModifierDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load round modifiers"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: RoundModifierDoc) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, modifierType: item.modifierType, magnitude: item.magnitude, condition: item.condition, stackable: item.stackable, icon: item.icon ?? "🔧" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data: Omit<RoundModifierDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), modifierType: form.modifierType,
        magnitude: form.magnitude, condition: form.condition, stackable: form.stackable, icon: form.icon,
      };
      const id = editing ? editing.id : slugify(form.name) || `mod-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.ROUND_MODIFIERS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ROUND_MODIFIERS, confirmDelete.id));
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
          <h1 className="text-[22px] font-bold text-theme-text">Round Modifiers</h1>
          <p className="text-theme-faint text-sm mt-1">{loading ? "Loading…" : `${items.length} modifiers`}</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-sm font-medium border-none cursor-pointer">
          + New Modifier
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter modifiers…"
        className={`${INP} mb-3`} />

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No modifiers found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="text-[22px] w-8 text-center shrink-0">{item.icon ?? "🔧"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-theme-text text-sm">{item.name}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
                  <span className="text-[11px] bg-blue-10 text-theme-blue px-[7px] py-0.5 rounded">{item.modifierType}</span>
                  <span className="text-[11px] text-theme-muted">×{item.magnitude}</span>
                  {item.condition !== "always" && <span className="text-[11px] bg-yellow-10 text-theme-yellow px-1.5 py-0.5 rounded">{item.condition}</span>}
                  {item.stackable && <span className="text-[10px] font-bold text-theme-green bg-green-10 px-1.5 py-px rounded">STACKABLE</span>}
                </div>
                {item.description && <div className="text-xs text-theme-muted mt-[3px]">{item.description}</div>}
              </div>
              <button onClick={() => openEdit(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
              <button onClick={() => setConfirmDelete(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit Round Modifier" : "New Round Modifier"}</h3>

            <div className="grid grid-cols-[1fr_auto] gap-3 mb-3.5">
              <label>
                <span className="text-xs text-theme-muted block mb-1">Name</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={INP} />
                {!editing && form.name && <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>}
              </label>
              <label>
                <span className="text-xs text-theme-muted block mb-1">Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-14 px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[20px] text-center" />
              </label>
            </div>

            <div className="mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Modifier Type</span>
              <SearchableSelect value={form.modifierType} onChange={v => setForm(f => ({ ...f, modifierType: v }))} options={MODIFIER_TYPE_OPTIONS} placeholder="Type…" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
              <label>
                <span className="text-xs text-theme-muted block mb-1">Magnitude</span>
                <input type="number" step="0.05" value={form.magnitude} onChange={e => setForm(f => ({ ...f, magnitude: Number(e.target.value) }))} className={INP} />
              </label>
              <div>
                <span className="text-xs text-theme-muted block mb-1">Condition</span>
                <SearchableSelect value={form.condition} onChange={v => setForm(f => ({ ...f, condition: v }))} options={CONDITION_OPTIONS} placeholder="Condition…" />
              </div>
            </div>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={`${INP} resize-y`} />
            </label>

            <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
              <input type="checkbox" checked={form.stackable} onChange={e => setForm(f => ({ ...f, stackable: e.target.checked }))} />
              <span className="text-sm text-theme-text">Stackable (multiple copies can apply simultaneously)</span>
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
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-theme-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-sm mb-5">This will permanently remove the round modifier.</p>
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
