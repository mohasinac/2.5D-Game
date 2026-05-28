import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type TurretAttackTypeDoc } from "@/stores/gameDataStore";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";

const INP = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

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
    <div className="page-shell p-4 sm:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Turret Attack Types</h1>
          <p className="text-theme-faint text-[13px] mt-1">{loading ? "Loading…" : `${items.length} attack types`}</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer">
          + New Type
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter types…"
        className={cn(INP, "mb-3")} />

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No types found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="text-[22px] w-8 text-center shrink-0">{item.icon ?? "🎯"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-theme-text text-sm">{item.label}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
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
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[480px]">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit Attack Type" : "New Attack Type"}</h3>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">ID <span className="text-theme-faint">(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} className={cn(INP, editing && "opacity-50")} placeholder="e.g. laser_sweep" />
            </label>

            <div className="grid grid-cols-[1fr_auto] gap-3 mb-3.5">
              <label>
                <span className="text-xs text-theme-muted block mb-1">Label</span>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={INP} />
              </label>
              <label>
                <span className="text-xs text-theme-muted block mb-1">Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-14 px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[20px] text-center" />
              </label>
            </div>

            <label className="block mb-5">
              <span className="text-xs text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={cn(INP, "resize-y")} />
            </label>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-[18px] py-2 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className={cn("px-[18px] py-2 rounded-lg text-[13px] border-none bg-theme-blue text-white cursor-pointer", saving && "opacity-60")}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-theme-text mb-2.5">Delete "{confirmDelete.label}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">Turret configs referencing this attack type will need to be updated manually.</p>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
