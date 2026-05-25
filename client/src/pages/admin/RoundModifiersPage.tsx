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

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

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
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Round Modifiers</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} modifiers`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Modifier
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter modifiers…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No modifiers found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 22, width: 32, textAlign: "center", flexShrink: 0 }}>{item.icon ?? "🔧"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                  <span style={{ fontSize: 11, background: C.blue + "22", color: C.blue, padding: "2px 7px", borderRadius: 4 }}>{item.modifierType}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>×{item.magnitude}</span>
                  {item.condition !== "always" && <span style={{ fontSize: 11, background: C.yellow + "22", color: C.yellow, padding: "2px 6px", borderRadius: 4 }}>{item.condition}</span>}
                  {item.stackable && <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: C.green + "22", padding: "1px 6px", borderRadius: 4 }}>STACKABLE</span>}
                </div>
                {item.description && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{item.description}</div>}
              </div>
              <button onClick={() => openEdit(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>Edit</button>
              <button onClick={() => setConfirmDelete(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.red}66`, background: "transparent", color: C.red }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Round Modifier" : "New Round Modifier"}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                {!editing && form.name && <span style={{ fontSize: 11, color: C.faint }}>ID: {slugify(form.name) || "…"}</span>}
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  style={{ ...inputStyle, width: 56, textAlign: "center", fontSize: 20 }} />
              </label>
            </div>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Modifier Type</span>
              <SearchableSelect value={form.modifierType} onChange={v => setForm(f => ({ ...f, modifierType: v }))} options={MODIFIER_TYPE_OPTIONS} placeholder="Type…" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Magnitude</span>
                <input type="number" step="0.05" value={form.magnitude} onChange={e => setForm(f => ({ ...f, magnitude: Number(e.target.value) }))} style={inputStyle} />
              </label>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Condition</span>
                <SearchableSelect value={form.condition} onChange={v => setForm(f => ({ ...f, condition: v }))} options={CONDITION_OPTIONS} placeholder="Condition…" />
              </div>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={form.stackable} onChange={e => setForm(f => ({ ...f, stackable: e.target.checked }))} />
              <span style={{ fontSize: 13, color: C.text }}>Stackable (multiple copies can apply simultaneously)</span>
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
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will permanently remove the round modifier.</p>
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
