import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type TurretAttackTypeDoc } from "@/stores/gameDataStore";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { id: "", label: "", description: "", icon: "🎯" };

export function TurretAttackTypesPage() {
  const [items, setItems] = useState<TurretAttackTypeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TurretAttackTypeDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<TurretAttackTypeDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TURRET_ATTACK_TYPES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TurretAttackTypeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load turret attack types"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: TurretAttackTypeDoc) => {
    setEditing(item);
    setForm({ id: item.id, label: item.label, description: item.description, icon: item.icon ?? "🎯" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const data = { label: form.label.trim(), description: form.description.trim(), icon: form.icon };
      await setDoc(doc(db, COLLECTIONS.TURRET_ATTACK_TYPES, form.id.trim()), data);
      invalidate("turretAttackTypes");
      toast.success(editing ? `Updated "${form.label}"` : `Created "${form.label}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.TURRET_ATTACK_TYPES, confirmDelete.id));
      invalidate("turretAttackTypes");
      toast.success(`Deleted "${confirmDelete.label}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Turret Attack Types</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} attack types`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Type
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter types…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No types found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 22, width: 32, textAlign: "center", flexShrink: 0 }}>{item.icon ?? "🎯"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
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
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Attack Type" : "New Attack Type"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>ID <span style={{ color: C.faint }}>(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} style={{ ...inputStyle, opacity: editing ? 0.5 : 1 }} placeholder="e.g. laser_sweep" />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Label</span>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inputStyle} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  style={{ ...inputStyle, width: 56, textAlign: "center", fontSize: 20 }} />
              </label>
            </div>

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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.label}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Turret configs referencing this attack type will need to be updated manually.</p>
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
