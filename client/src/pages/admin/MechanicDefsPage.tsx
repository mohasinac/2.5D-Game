import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { cn } from "@/lib/cn";
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

const inputCls = "w-full px-[10px] py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

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
    <div className="p-4 sm:p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="m-0 text-[22px] text-theme-text">Mechanic Defs</h1>
          <p className="mt-1 mb-0 text-[13px] text-theme-muted">
            {items.length} mechanic handler{items.length !== 1 ? "s" : ""} — one per MechanicRegistry entry
          </p>
        </div>
        <button onClick={openCreate} className="px-[18px] py-2 bg-theme-blue text-white border-none rounded-lg cursor-pointer text-[13px]">
          + New Mechanic
        </button>
      </div>

      <input
        placeholder="Search by name, id, or category…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className={cn(inputCls, "mb-5")}
      />

      {loading ? (
        <p className="text-theme-muted">Loading…</p>
      ) : byCategory.length === 0 ? (
        <p className="text-theme-muted">No mechanic defs found.</p>
      ) : (
        byCategory.map(group => (
          <div key={group.value} className="mb-7">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-theme-blue mb-2">
              {group.label}
            </div>
            <div className="flex flex-col gap-[6px]">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start justify-between bg-bg1 border border-border-c rounded-[10px] px-[14px] py-[10px] gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-[2px]">
                      <span className="font-semibold text-[14px] text-theme-text">{item.name}</span>
                      <span className="text-[11px] text-theme-muted font-mono">{item.id}</span>
                    </div>
                    <p className="m-0 text-[12px] text-theme-muted leading-[1.5]">{item.description}</p>
                    {item.params && Object.keys(item.params).length > 0 && (
                      <div className="mt-1 text-[11px] text-theme-muted font-mono">
                        {Object.entries(item.params).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-[6px] shrink-0">
                    <button onClick={() => openEdit(item)} className="px-3 py-[5px] bg-bg0 border border-border-c rounded-md text-theme-text text-[12px] cursor-pointer">Edit</button>
                    <button onClick={() => setConfirmDelete(item)} className="px-3 py-[5px] bg-bg0 border border-[#c0392b] rounded-md text-[#e74c3c] text-[12px] cursor-pointer">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-xl p-4 sm:p-7 w-[520px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <h2 className="m-0 mb-5 text-[17px] text-theme-text">{editing ? "Edit Mechanic" : "New Mechanic"}</h2>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Velocity Burst" />
              {!editing && form.name && (
                <span className="text-[11px] text-theme-muted mt-[2px] block">ID: {slugify(form.name)}</span>
              )}
            </label>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Category *</span>
              <SearchableSelect
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={v => setForm(f => ({ ...f, category: v }))}
                placeholder="Select category"
              />
            </label>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className={cn(inputCls, "resize-y")}
                placeholder="What this mechanic does and which fields it modifies…"
              />
            </label>

            <label className="block mb-5">
              <span className="text-[12px] text-theme-muted block mb-1">
                Default Params (JSON)
                {jsonError && <span className="text-[#e74c3c] ml-2">{jsonError}</span>}
              </span>
              <textarea
                value={form.paramsJson}
                onChange={e => handleParamsChange(e.target.value)}
                rows={4}
                className={cn(inputCls, "resize-y font-mono text-[12px]")}
              />
            </label>

            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !!jsonError} className={cn("px-[18px] py-2 bg-theme-blue text-white border-none rounded-lg", saving ? "cursor-not-allowed opacity-70" : "cursor-pointer")}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100]">
          <div className="bg-bg1 border border-border-c rounded-xl p-4 sm:p-7 w-[380px] max-w-[95vw]">
            <h3 className="m-0 mb-3 text-theme-text">Delete Mechanic?</h3>
            <p className="m-0 mb-5 text-theme-muted text-[13px]">
              Delete <strong className="text-theme-text">{confirmDelete.name}</strong>? Any gimmick_defs referencing <code className="font-mono">{confirmDelete.id}</code> will break at runtime.
            </p>
            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-[18px] py-2 bg-[#c0392b] text-white border-none rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
