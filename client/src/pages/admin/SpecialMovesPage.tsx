import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type SpecialMoveDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

const KIND_OPTIONS = [
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

const TYPE_OPTIONS = [
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const EMPTY = { name: "", kind: "attack", iconEmoji: "⚡", cooldownSec: 15, durationMs: 1500, description: "", isDefault: false, type: "attack", flashColor: "#ffffff" };

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

export function SpecialMovesPage() {
  const [items, setItems] = useState<SpecialMoveDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SpecialMoveDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
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

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: SpecialMoveDoc) => {
    setEditing(item);
    setForm({
      name: item.name, kind: item.kind, iconEmoji: item.iconEmoji,
      cooldownSec: item.cooldownSec, durationMs: item.durationMs,
      description: item.description ?? "", isDefault: item.isDefault ?? false,
      type: item.type ?? "attack", flashColor: item.flashColor ?? "#ffffff",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(), kind: form.kind, iconEmoji: form.iconEmoji,
        cooldownSec: form.cooldownSec, durationMs: form.durationMs,
        description: form.description.trim(), isDefault: form.isDefault,
        type: form.type, flashColor: form.flashColor,
      };
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

  const kindColor: Record<string, string> = { attack: C.red, defense: C.blue, stamina: C.green, balanced: C.yellow };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Special Moves</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} special moves`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Move
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter moves…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No special moves found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 28, flexShrink: 0, width: 40, textAlign: "center" }}>{item.iconEmoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                  <span style={{ fontSize: 11, background: (kindColor[item.kind] ?? C.blue) + "22", color: kindColor[item.kind] ?? C.blue, padding: "2px 7px", borderRadius: 4 }}>{item.kind}</span>
                  {item.isDefault && <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, background: C.blue + "22", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>DEFAULT</span>}
                  <span style={{ fontSize: 11, color: C.muted }}>cd {item.cooldownSec}s · {item.durationMs}ms</span>
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Special Move" : "New Special Move"}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                {!editing && form.name && <span style={{ fontSize: 11, color: C.faint }}>ID: {slugify(form.name) || "…"}</span>}
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Icon</span>
                <input value={form.iconEmoji} onChange={e => setForm(f => ({ ...f, iconEmoji: e.target.value }))}
                  style={{ ...inputStyle, width: 64, textAlign: "center", fontSize: 22 }} />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Kind</span>
                <SearchableSelect value={form.kind} onChange={v => setForm(f => ({ ...f, kind: v }))} options={KIND_OPTIONS} placeholder="Kind…" />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Type affinity</span>
                <SearchableSelect value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={TYPE_OPTIONS} placeholder="Type…" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Cooldown (sec)</span>
                <input type="number" min={0} value={form.cooldownSec} onChange={e => setForm(f => ({ ...f, cooldownSec: Number(e.target.value) }))} style={inputStyle} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Duration (ms)</span>
                <input type="number" min={0} value={form.durationMs} onChange={e => setForm(f => ({ ...f, durationMs: Number(e.target.value) }))} style={inputStyle} />
              </label>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Flash Color (hex)</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.flashColor} onChange={e => setForm(f => ({ ...f, flashColor: e.target.value }))}
                  style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input value={form.flashColor} onChange={e => setForm(f => ({ ...f, flashColor: e.target.value }))}
                  style={{ ...inputStyle, width: "auto", flex: 1 }} placeholder="#ffffff" />
              </div>
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
              <span style={{ fontSize: 13, color: C.text }}>Default for type (auto-assign to new beyblades)</span>
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
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will permanently remove the special move from Firebase.</p>
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
