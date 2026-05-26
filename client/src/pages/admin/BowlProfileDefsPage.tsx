import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface BowlProfileDoc { id: string; label: string; wallAngle: number; description?: string; }

const EMPTY: BowlProfileDoc = { id: "", label: "", wallAngle: 30, description: "" };

const inputCls = "w-full bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm box-border";

export function BowlProfileDefsPage() {
  const [items, setItems] = useState<BowlProfileDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BowlProfileDoc | null>(null);
  const [form, setForm] = useState<BowlProfileDoc>({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<BowlProfileDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BOWL_PROFILE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BowlProfileDoc));
      docs.sort((a, b) => a.wallAngle - b.wallAngle);
      setItems(docs);
    } catch { toast.error("Failed to load bowl profiles"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: BowlProfileDoc) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const { id, ...data } = form;
      await setDoc(doc(db, COLLECTIONS.BOWL_PROFILE_DEFS, id.trim()), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast.success(editing ? "Updated" : "Created");
      invalidate("bowlProfileDefs");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.BOWL_PROFILE_DEFS, confirmDelete.id));
      toast.success("Deleted");
      invalidate("bowlProfileDefs");
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase())
  );

  const wallAngleBar = (angle: number) => {
    const pct = Math.min(100, (angle / 75) * 100);
    return (
      <div className="w-15 h-1.5 bg-bg2 rounded-full overflow-hidden">
        <div className="h-full bg-blue rounded-full" style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[800px]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-text m-0">Bowl Profile Defs</h1>
          <p className="text-sm text-muted mt-1">
            Defines bowl wall-angle profiles for arenas. Falls back to built-ins when empty.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ Add Profile</Button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
        className={`${inputCls} mb-4 max-w-xs`} />

      {loading ? (
        <div className="text-muted text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-sm">No bowl profiles found. Add one above.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-bg1 border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-semibold text-text flex items-center gap-2.5">
                  {item.label}
                  {wallAngleBar(item.wallAngle)}
                  <span className="text-xs text-muted font-normal">{item.wallAngle}°</span>
                </div>
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
            <h2 className="text-base font-bold text-text mb-5">{editing ? "Edit" : "Add"} Bowl Profile</h2>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">ID (slug) *</span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editing} className={`${inputCls} disabled:opacity-50`} placeholder="standard" />
            </label>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">Label *</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} placeholder="Standard Bowl" />
            </label>
            <label className="block mb-3">
              <span className="text-xs text-muted block mb-1">Wall Angle (0–75°) *</span>
              <div className="flex gap-2.5 items-center">
                <input type="range" min={0} max={75} step={1} value={form.wallAngle}
                  onChange={e => setForm(f => ({ ...f, wallAngle: parseInt(e.target.value) }))}
                  className="flex-1" />
                <span className="text-sm text-text min-w-[36px]">{form.wallAngle}°</span>
              </div>
            </label>
            <label className="block mb-5">
              <span className="text-xs text-muted block mb-1">Description</span>
              <input value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value || undefined }))} className={inputCls} placeholder="Optional description…" />
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
            <div className="text-sm text-muted mb-5">This cannot be undone. Arenas using this bowl profile ID will fall back to the default.</div>
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
