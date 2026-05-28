import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type PartMaterialDoc } from "@/stores/gameDataStore";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";

const inputCls = "w-full px-[10px] py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";
const numInputCls = cn(inputCls, "w-[90px]");

const EMPTY: Omit<PartMaterialDoc, "id"> & { id: string } = {
  id: "", label: "", description: "",
  gripFactor: undefined, aggressiveness: undefined,
  recoilFactor: undefined, surfaceFriction: undefined,
  density: undefined, durabilityDecay: undefined,
};

type FormState = typeof EMPTY;

function NumField({ label, hint, value, onChange, min, max, step }: {
  label: string; hint?: string; value: number | undefined;
  onChange: (v: number | undefined) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <label className="block">
      <span className="text-[12px] text-theme-muted block mb-[3px]">
        {label}{hint && <span className="text-theme-faint ml-1">{hint}</span>}
      </span>
      <input
        type="number" min={min} max={max} step={step ?? 0.01}
        value={value ?? ""}
        onChange={e => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className={numInputCls}
      />
    </label>
  );
}

export function PartMaterialsPage() {
  const [items, setItems] = useState<PartMaterialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PartMaterialDoc | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<PartMaterialDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PART_MATERIALS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartMaterialDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load tip materials"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: PartMaterialDoc) => {
    setEditing(item);
    setForm({ ...EMPTY, ...item });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const data: Omit<PartMaterialDoc, "id"> = {
        label: form.label.trim(),
        description: form.description?.trim() || undefined,
        ...(form.gripFactor !== undefined && { gripFactor: form.gripFactor }),
        ...(form.aggressiveness !== undefined && { aggressiveness: form.aggressiveness }),
        ...(form.recoilFactor !== undefined && { recoilFactor: form.recoilFactor }),
        ...(form.surfaceFriction !== undefined && { surfaceFriction: form.surfaceFriction }),
        ...(form.density !== undefined && { density: form.density }),
        ...(form.durabilityDecay !== undefined && { durabilityDecay: form.durabilityDecay }),
      };
      await setDoc(doc(db, COLLECTIONS.PART_MATERIALS, form.id.trim()), data);
      invalidate("partMaterials");
      toast.success(editing ? `Updated "${form.label}"` : `Created "${form.label}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.PART_MATERIALS, confirmDelete.id));
      invalidate("partMaterials");
      toast.success(`Deleted "${confirmDelete.label}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const pf = (n: number | undefined) => n !== undefined ? n.toFixed(2) : "—";

  const filtered = query
    ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query))
    : items;

  return (
    <div className="p-6 w-full box-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Part Materials</h1>
          <p className="text-theme-faint text-[13px] mt-1">
            {loading ? "Loading…" : `${items.length} material profiles`}
          </p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer">
          + New Material
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter materials…"
        className={cn(inputCls, "mb-3")} />

      {loading ? (
        <div className="text-theme-muted">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-theme-muted">No materials found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-[14px] bg-bg1 border border-border-c rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-theme-text text-[14px]">{item.label}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-[6px] py-[1px] rounded">{item.id}</span>
                </div>
                {item.description && <div className="text-[12px] text-theme-muted mb-1">{item.description}</div>}
                <div className="flex gap-3 flex-wrap text-[11px] text-theme-faint">
                  {item.gripFactor !== undefined && <span>grip: {pf(item.gripFactor)}</span>}
                  {item.aggressiveness !== undefined && <span>aggression: {pf(item.aggressiveness)}</span>}
                  {item.recoilFactor !== undefined && <span>recoil: {pf(item.recoilFactor)}</span>}
                  {item.surfaceFriction !== undefined && <span>friction: {pf(item.surfaceFriction)}</span>}
                  {item.density !== undefined && <span>density: {item.density} g/cm³</span>}
                  {item.durabilityDecay !== undefined && <span>decay: {pf(item.durabilityDecay)}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
              <button onClick={() => setConfirmDelete(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 w-full max-w-[520px]">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">
              {editing ? "Edit Material" : "New Material"}
            </h3>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">ID <span className="text-theme-faint">(slug, no spaces)</span></span>
              <input value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} className={cn(inputCls, editing && "opacity-50")} placeholder="e.g. rubber" />
            </label>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Label</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} placeholder="e.g. Rubber" />
            </label>

            <label className="block mb-5">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className={cn(inputCls, "resize-y")} placeholder="Optional description of this material's characteristics" />
            </label>

            <p className="text-[11px] text-theme-faint mb-3">Physics defaults — leave blank to let the server compute from material type.</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <NumField label="Grip Factor" hint="0–1" value={form.gripFactor} onChange={v => setForm(f => ({ ...f, gripFactor: v }))} min={0} max={1} />
              <NumField label="Aggressiveness" hint="0–1" value={form.aggressiveness} onChange={v => setForm(f => ({ ...f, aggressiveness: v }))} min={0} max={1} />
              <NumField label="Recoil Factor" hint="0–1" value={form.recoilFactor} onChange={v => setForm(f => ({ ...f, recoilFactor: v }))} min={0} max={1} />
              <NumField label="Surface Friction" hint="0–5" value={form.surfaceFriction} onChange={v => setForm(f => ({ ...f, surfaceFriction: v }))} min={0} max={5} step={0.1} />
              <NumField label="Density" hint="g/cm³" value={form.density} onChange={v => setForm(f => ({ ...f, density: v }))} min={0} step={0.01} />
              <NumField label="Durability Decay" hint="0–1" value={form.durabilityDecay} onChange={v => setForm(f => ({ ...f, durabilityDecay: v }))} min={0} max={1} />
            </div>

            <div className="flex gap-[10px] justify-end">
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
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 max-w-[400px] w-[90%]">
            <h3 className="text-[16px] font-bold text-theme-text mb-[10px]">Delete "{confirmDelete.label}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">Tip parts referencing this material ID will retain the string value but lose profile defaults.</p>
            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
