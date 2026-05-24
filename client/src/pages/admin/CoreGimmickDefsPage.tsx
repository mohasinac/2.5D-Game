import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface CoreGimmickDoc { id: string; label: string; description?: string; hasPhysicsImpl?: boolean; }

const EMPTY: CoreGimmickDoc = { id: "", label: "", description: "", hasPhysicsImpl: false };

const inp: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

export function CoreGimmickDefsPage() {
  const [items, setItems] = useState<CoreGimmickDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CoreGimmickDoc | null>(null);
  const [form, setForm] = useState<CoreGimmickDoc>({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<CoreGimmickDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CORE_GIMMICK_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as CoreGimmickDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load core gimmicks"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: CoreGimmickDoc) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const { id, ...data } = form;
      await setDoc(doc(db, COLLECTIONS.CORE_GIMMICK_DEFS, id.trim()), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast.success(editing ? "Updated" : "Created");
      invalidate("coreGimmicks");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.CORE_GIMMICK_DEFS, confirmDelete.id));
      toast.success("Deleted");
      invalidate("coreGimmicks");
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Core Gimmick Defs</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
            Defines gimmick modes available for Core parts. Falls back to built-ins when empty.
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          + Add Gimmick
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
        style={{ ...inp, marginBottom: 16, maxWidth: 320 }} />

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: C.muted, fontSize: 13 }}>No core gimmicks found. Add one above.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                  {item.label}
                  {item.hasPhysicsImpl && <span style={{ fontSize: 10, padding: "2px 6px", background: "#3b82f620", color: "#3b82f6", borderRadius: 4, fontWeight: 500 }}>Physics</span>}
                </div>
                <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>ID: {item.id}{item.description ? ` — ${item.description}` : ""}</div>
              </div>
              <button onClick={() => openEdit(item)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, cursor: "pointer" }}>Edit</button>
              <button onClick={() => setConfirmDelete(item)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: "1px solid #ef444444", background: "#ef44440d", color: "#ef4444", cursor: "pointer" }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 420, maxWidth: "90vw" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>{editing ? "Edit" : "Add"} Core Gimmick</h2>
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>ID (slug) *</span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editing} style={inp} placeholder="mode_change" />
            </label>
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Label *</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inp} placeholder="Mode Change" />
            </label>
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <input value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value || undefined }))} style={inp} placeholder="Optional description…" />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={!!form.hasPhysicsImpl} onChange={e => setForm(f => ({ ...f, hasPhysicsImpl: e.target.checked }))} />
              <span style={{ fontSize: 13, color: C.text }}>Has physics implementation</span>
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 360, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.label}"?</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>This cannot be undone. Parts using this gimmick ID will fall back to displaying the raw ID.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
