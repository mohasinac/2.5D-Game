import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface StatDefDoc {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  min?: number;
  max?: number;
  default?: number;
  step?: number;
  unit?: string;
  formula?: string;
  affectsPhysics?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "beyblade", label: "Beyblade",  hint: "Per-bey numeric attributes used by physics" },
  { value: "arena",    label: "Arena",     hint: "Arena-wide modifiers applied to all physics" },
  { value: "part",     label: "Part",      hint: "Part-level geometry and material properties" },
  { value: "match",    label: "Match",     hint: "Match-scope scalars and round modifiers" },
  { value: "modifier", label: "Modifier",  hint: "Transient stat changes from mechanics/gimmicks" },
];

const VAL_TYPE_OPTIONS = [
  { value: "float", label: "Float" },
  { value: "int",   label: "Integer" },
  { value: "bool",  label: "Boolean" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, "");
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = {
  name: "", category: "beyblade", type: "float",
  description: "", min: 0, max: 150, default: 0,
  step: 1, unit: "", formula: "", affectsPhysics: true,
};

export default function StatDefsPage() {
  const [items, setItems] = useState<StatDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StatDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<StatDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STAT_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as StatDefDoc));
      docs.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load stat defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowModal(true);
  }

  function openEdit(item: StatDefDoc) {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      type: item.type,
      description: item.description ?? "",
      min: item.min ?? 0,
      max: item.max ?? 150,
      default: item.default ?? 0,
      step: item.step ?? 1,
      unit: item.unit ?? "",
      formula: item.formula ?? "",
      affectsPhysics: item.affectsPhysics ?? true,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : slugify(form.name);
      const data: StatDefDoc = {
        id,
        name: form.name.trim(),
        category: form.category,
        type: form.type,
        description: form.description.trim(),
        min: form.min,
        max: form.max,
        default: form.default,
        step: form.step,
        affectsPhysics: form.affectsPhysics,
      };
      if (form.unit.trim()) data.unit = form.unit.trim();
      if (form.formula.trim()) data.formula = form.formula.trim();
      await setDoc(doc(db, COLLECTIONS.STAT_DEFS, id), data);
      toast.success(editing ? "Stat updated" : "Stat created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.STAT_DEFS, confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  }

  const filtered = items.filter(i =>
    !query || i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  );

  const byCategory = CATEGORY_OPTIONS.map(cat => ({
    ...cat,
    items: filtered.filter(i => i.category === cat.value),
  })).filter(g => g.items.length > 0);

  const typeColor: Record<string, string> = { float: C.blue, int: C.green, bool: C.yellow };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: C.text }}>Stat Defs</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
            {items.length} stat definition{items.length !== 1 ? "s" : ""} — typed numeric attributes for beys, arenas, and parts
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          + New Stat
        </button>
      </div>

      <input
        placeholder="Search by name, id, or category…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      {loading ? (
        <p style={{ color: C.muted }}>Loading…</p>
      ) : byCategory.length === 0 ? (
        <p style={{ color: C.muted }}>No stat defs found.</p>
      ) : (
        byCategory.map(group => (
          <div key={group.value} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.blue, marginBottom: 8 }}>
              {group.label} <span style={{ color: C.muted, fontWeight: 400 }}>— {group.hint}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{item.id}</span>
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: (typeColor[item.type] ?? C.blue) + "22", color: typeColor[item.type] ?? C.blue, fontWeight: 700 }}>{item.type}</span>
                      {item.unit && <span style={{ fontSize: 11, color: C.muted }}>{item.unit}</span>}
                      {item.affectsPhysics && <span style={{ fontSize: 10, color: C.green, background: C.green + "22", padding: "1px 6px", borderRadius: 4 }}>physics</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.description}</p>
                    <div style={{ marginTop: 4, fontSize: 11, color: C.muted, fontFamily: "monospace" }}>
                      {item.min != null && `min:${item.min} `}
                      {item.max != null && `max:${item.max} `}
                      {item.default != null && `default:${item.default}`}
                      {item.formula && <span style={{ marginLeft: 8, color: C.yellow }}>= {item.formula}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => setConfirmDelete(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid #c0392b`, borderRadius: 6, color: "#e74c3c", fontSize: 12, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 540, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 17, color: C.text }}>{editing ? "Edit Stat" : "New Stat"}</h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Beyblade Attack" />
              {!editing && form.name && (
                <span style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "block" }}>ID: {slugify(form.name)}</span>
              )}
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Category *</span>
                <SearchableSelect
                  options={CATEGORY_OPTIONS}
                  value={form.category}
                  onChange={v => setForm(f => ({ ...f, category: v }))}
                  placeholder="Select category"
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Value Type</span>
                <SearchableSelect
                  options={VAL_TYPE_OPTIONS}
                  value={form.type}
                  onChange={v => setForm(f => ({ ...f, type: v }))}
                  placeholder="Type"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {(["min", "max", "default", "step"] as const).map(field => (
                <label key={field} style={{ display: "block" }}>
                  <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4, textTransform: "capitalize" }}>{field}</span>
                  <input type="number" value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))}
                    style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }} />
                </label>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Unit <span style={{ color: C.faint }}>(optional)</span></span>
                <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. cm, px, deg/s" style={inputStyle} />
              </label>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Formula <span style={{ color: C.faint }}>(optional)</span></span>
                <input value={form.formula} onChange={e => setForm(f => ({ ...f, formula: e.target.value }))} placeholder="e.g. 1.0 + attack * 0.007" style={inputStyle} />
              </label>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={form.affectsPhysics} onChange={e => setForm(f => ({ ...f, affectsPhysics: e.target.checked }))} />
              <span style={{ fontSize: 13, color: C.text }}>Affects physics (server reads this stat at runtime)</span>
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 380, maxWidth: "95vw" }}>
            <h3 style={{ margin: "0 0 12px", color: C.text }}>Delete Stat?</h3>
            <p style={{ margin: "0 0 20px", color: C.muted, fontSize: 13 }}>
              Delete <strong style={{ color: C.text }}>{confirmDelete.name}</strong>? Any StatModifier referencing <code style={{ fontFamily: "monospace" }}>{confirmDelete.id}</code> will have no effect.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
