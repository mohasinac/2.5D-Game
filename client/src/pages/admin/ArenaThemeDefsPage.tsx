import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ArenaThemeDoc { id: string; label: string; color?: string; description?: string; }

const EMPTY: ArenaThemeDoc = { id: "", label: "", color: "#3b82f6", description: "" };

const inputCls = "w-full bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm box-border";

export function ArenaThemeDefsPage() {
  const [items, setItems] = useState<ArenaThemeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ArenaThemeDoc | null>(null);
  const [form, setForm] = useState<ArenaThemeDoc>({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<ArenaThemeDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_THEME_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaThemeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load arena themes"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: ArenaThemeDoc) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const { id, ...data } = form;
      await setDoc(doc(db, COLLECTIONS.ARENA_THEME_DEFS, id.trim()), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast.success(editing ? "Updated" : "Created");
      invalidate("arenaThemeDefs");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARENA_THEME_DEFS, confirmDelete.id));
      toast.success("Deleted");
      invalidate("arenaThemeDefs");
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[800px]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-text m-0">Arena Theme Defs</h1>
          <p className="text-sm text-muted mt-1">
            Defines visual themes available in the arena editor. Falls back to built-ins when empty.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ Add Theme</Button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
        className={`${inputCls} mb-4 max-w-xs`} />

      {loading ? (
        <div className="text-muted text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-sm">No arena themes found. Add one above.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-bg1 border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-md flex-shrink-0" style={{ background: item.color ?? "#3b82f6" }} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-text">{item.label}</div>
                <div className="text-xs text-faint mt-0.5">ID: {item.id}{item.description ? ` — ${item.description}` : ""}</div>
              </div>
              <Button variant="outline" size="xs" onClick={() => openEdit(item)}>Edit</Button>
              <Button variant="danger" size="xs" onClick={() => setConfirmDelete(item)}>Delete</Button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/[.53] flex items-center justify-center z-[1000]">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[420px] max-w-[90vw]">
            <h2 className="text-base font-bold text-text mb-5">{editing ? "Edit" : "Add"} Arena Theme</h2>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">ID (slug) *</span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editing} className={`${inputCls} disabled:opacity-50`} placeholder="volcano" />
            </label>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">Label *</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} placeholder="Volcano" />
            </label>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">Description</span>
              <input value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value || undefined }))} className={inputCls} placeholder="Optional description…" />
            </label>
            <label className="block mb-5">
              <span className="text-xs text-muted block mb-1">Theme Color</span>
              <div className="flex gap-2.5 items-center">
                <input type="color" value={form.color ?? "#3b82f6"}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-12 h-9 border border-border rounded-lg bg-bg0 cursor-pointer p-0.5" />
                <input value={form.color ?? "#3b82f6"}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className={`${inputCls} flex-1`} placeholder="#3b82f6" />
              </div>
            </label>
            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/[.53] flex items-center justify-center z-[1000]">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[360px] text-center">
            <div className="text-base font-semibold text-text mb-2.5">Delete "{confirmDelete.label}"?</div>
            <div className="text-sm text-muted mb-5">This cannot be undone. Arenas using this theme ID will fall back to the default theme.</div>
            <div className="flex gap-2.5 justify-center">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
