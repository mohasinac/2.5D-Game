import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";

interface CoreGimmickDoc { id: string; label: string; description?: string; hasPhysicsImpl?: boolean; }

const EMPTY: CoreGimmickDoc = { id: "", label: "", description: "", hasPhysicsImpl: false };

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
    <div className="p-6 max-w-[800px]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-text m-0">Core Gimmick Defs</h1>
          <p className="text-[13px] text-muted mt-1">
            Defines gimmick modes available for Core parts. Falls back to built-ins when empty.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ Add Gimmick</Button>
      </div>

      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="mb-4 max-w-xs" />

      {loading ? (
        <div className="text-muted text-[13px]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-[13px]">No core gimmicks found. Add one above.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-bg1 border border-border rounded-xl px-4 py-3">
              <div className="flex-1">
                <div className="text-sm font-semibold text-text flex items-center gap-2">
                  {item.label}
                  {item.hasPhysicsImpl && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue/10 text-blue rounded font-medium">Physics</span>
                  )}
                </div>
                <div className="text-[11px] text-faint mt-0.5">ID: {item.id}{item.description ? ` — ${item.description}` : ""}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(item)}>Delete</Button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[420px] max-w-[90vw]">
            <h2 className="text-[17px] font-bold text-text m-0 mb-5">{editing ? "Edit" : "Add"} Core Gimmick</h2>
            <div className="mb-3">
              <Label>ID (slug) *</Label>
              <Input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editing} className={editing ? "opacity-50" : ""} placeholder="mode_change" />
            </div>
            <div className="mb-3">
              <Label>Label *</Label>
              <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Mode Change" />
            </div>
            <div className="mb-3">
              <Label>Description</Label>
              <Input value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value || undefined }))} placeholder="Optional description…" />
            </div>
            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={!!form.hasPhysicsImpl} onChange={e => setForm(f => ({ ...f, hasPhysicsImpl: e.target.checked }))} />
              <span className="text-[13px] text-text">Has physics implementation</span>
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
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[360px] text-center">
            <div className="text-base font-semibold text-text mb-2.5">Delete "{confirmDelete.label}"?</div>
            <div className="text-[13px] text-muted mb-5">This cannot be undone. Parts using this gimmick ID will fall back to displaying the raw ID.</div>
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
