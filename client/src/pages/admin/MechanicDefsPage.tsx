import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface MechanicDefDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  params?: Record<string, unknown>;
}

const CATEGORY_OPTIONS = [
  { value: "stamina",  label: "Stamina",  hint: "Spin preservation, recovery, and transfer mechanics" },
  { value: "defense",  label: "Defense",  hint: "Damage reduction, recoil, and defensive stance mechanics" },
  { value: "attack",   label: "Attack",   hint: "Damage amplification, force, and offensive contact mechanics" },
  { value: "movement", label: "Movement", hint: "Velocity, orbit, drift, and positional mechanics" },
  { value: "special",  label: "Special",  hint: "Mode-change, threshold-switch, zero-g, and unique mechanics" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function tryParseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { return null; }
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { name: "", category: "stamina", description: "", paramsJson: "{}" };

export default function MechanicDefsPage() {
  const [items, setItems] = useState<MechanicDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MechanicDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [jsonError, setJsonError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MechanicDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.MECHANIC_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as MechanicDefDoc));
      docs.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load mechanic defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setJsonError("");
    setShowModal(true);
  }

  function openEdit(item: MechanicDefDoc) {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      paramsJson: item.params ? JSON.stringify(item.params, null, 2) : "{}",
    });
    setJsonError("");
    setShowModal(true);
  }

  function handleParamsChange(val: string) {
    setForm(f => ({ ...f, paramsJson: val }));
    const parsed = tryParseJson(val);
    setJsonError(parsed === null ? "Invalid JSON" : "");
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const params = tryParseJson(form.paramsJson);
    if (params === null) { toast.error("Params JSON is invalid"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : slugify(form.name);
      await setDoc(doc(db, COLLECTIONS.MECHANIC_DEFS, id), {
        id,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        params,
      });
      toast.success(editing ? "Mechanic updated" : "Mechanic created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.MECHANIC_DEFS, confirmDelete.id));
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

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: C.text }}>Mechanic Defs</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
            {items.length} mechanic handler{items.length !== 1 ? "s" : ""} â€” one per MechanicRegistry entry
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          + New Mechanic
        </button>
      </div>

      <input
        placeholder="Search by name, id, or categoryâ€¦"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      {loading ? (
        <p style={{ color: C.muted }}>Loadingâ€¦</p>
      ) : byCategory.length === 0 ? (
        <p style={{ color: C.muted }}>No mechanic defs found.</p>
      ) : (
        byCategory.map(group => (
          <div key={group.value} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.blue, marginBottom: 8 }}>
              {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{item.id}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.description}</p>
                    {item.params && Object.keys(item.params).length > 0 && (
                      <div style={{ marginTop: 4, fontSize: 11, color: C.muted, fontFamily: "monospace" }}>
                        {Object.entries(item.params).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" Â· ")}
                      </div>
                    )}
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 520, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 17, color: C.text }}>{editing ? "Edit Mechanic" : "New Mechanic"}</h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Velocity Burst" />
              {!editing && form.name && (
                <span style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "block" }}>ID: {slugify(form.name)}</span>
              )}
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Category *</span>
              <SearchableSelect
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={v => setForm(f => ({ ...f, category: v }))}
                placeholder="Select category"
              />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="What this mechanic does and which fields it modifiesâ€¦"
              />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>
                Default Params (JSON)
                {jsonError && <span style={{ color: "#e74c3c", marginLeft: 8 }}>{jsonError}</span>}
              </span>
              <textarea
                value={form.paramsJson}
                onChange={e => handleParamsChange(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !!jsonError} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Savingâ€¦" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 380, maxWidth: "95vw" }}>
            <h3 style={{ margin: "0 0 12px", color: C.text }}>Delete Mechanic?</h3>
            <p style={{ margin: "0 0 20px", color: C.muted, fontSize: 13 }}>
              Delete <strong style={{ color: C.text }}>{confirmDelete.name}</strong>? Any gimmick_defs referencing <code style={{ fontFamily: "monospace" }}>{confirmDelete.id}</code> will break at runtime.
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
