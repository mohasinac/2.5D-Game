import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";

interface StatDefDoc {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  min?: number;
  max?: number;
  default?: number;
  step?: number;
  unit?: string;
  formula?: string;
  affectsPhysics?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "beyblade", label: "Beyblade",  hint: "Per-bey numeric attributes used by physics" },
  { value: "arena",    label: "Arena",     hint: "Arena-wide modifiers applied to all physics" },
  { value: "part",     label: "Part",      hint: "Part-level geometry and material properties" },
  { value: "match",    label: "Match",     hint: "Match-scope scalars and round modifiers" },
  { value: "modifier", label: "Modifier",  hint: "Transient stat changes from mechanics/gimmicks" },
];

const VAL_TYPE_OPTIONS = [
  { value: "float", label: "Float" },
  { value: "int",   label: "Integer" },
  { value: "bool",  label: "Boolean" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, "");
}

const EMPTY = {
  name: "", category: "beyblade", type: "float",
  description: "", min: 0, max: 150, default: 0,
  step: 1, unit: "", formula: "", affectsPhysics: true,
};

const typeColorClass: Record<string, string> = {
  float: "bg-blue/10 text-blue",
  int: "bg-green/10 text-green",
  bool: "bg-yellow/10 text-yellow",
};

export default function StatDefsPage() {
  const [items, setItems] = useState<StatDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StatDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<StatDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STAT_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as StatDefDoc));
      docs.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load stat defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowModal(true);
  }

  function openEdit(item: StatDefDoc) {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      type: item.type,
      description: item.description ?? "",
      min: item.min ?? 0,
      max: item.max ?? 150,
      default: item.default ?? 0,
      step: item.step ?? 1,
      unit: item.unit ?? "",
      formula: item.formula ?? "",
      affectsPhysics: item.affectsPhysics ?? true,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : slugify(form.name);
      const data: StatDefDoc = {
        id,
        name: form.name.trim(),
        category: form.category,
        type: form.type,
        description: form.description.trim(),
        min: form.min,
        max: form.max,
        default: form.default,
        step: form.step,
        affectsPhysics: form.affectsPhysics,
      };
      if (form.unit.trim()) data.unit = form.unit.trim();
      if (form.formula.trim()) data.formula = form.formula.trim();
      await setDoc(doc(db, COLLECTIONS.STAT_DEFS, id), data);
      toast.success(editing ? "Stat updated" : "Stat created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.STAT_DEFS, confirmDelete.id));
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
    <div className="p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="m-0 text-[22px] text-text">Stat Defs</h1>
          <p className="mt-1 text-[13px] text-muted">
            {items.length} stat definition{items.length !== 1 ? "s" : ""} — typed numeric attributes for beys, arenas, and parts
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Stat</Button>
      </div>

      <Input
        placeholder="Search by name, id, or category…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-5"
      />

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : byCategory.length === 0 ? (
        <p className="text-muted">No stat defs found.</p>
      ) : (
        byCategory.map(group => (
          <div key={group.value} className="mb-7">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue mb-2">
              {group.label} <span className="text-muted font-normal">— {group.hint}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start justify-between bg-bg1 border border-border rounded-lg px-3.5 py-2.5 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-sm text-text">{item.name}</span>
                      <span className="text-[11px] text-muted font-mono">{item.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${typeColorClass[item.type] ?? "bg-blue/10 text-blue"}`}>{item.type}</span>
                      {item.unit && <span className="text-[11px] text-muted">{item.unit}</span>}
                      {item.affectsPhysics && <span className="text-[10px] text-green bg-green/10 px-1.5 py-0.5 rounded">physics</span>}
                    </div>
                    <p className="m-0 text-xs text-muted leading-relaxed">{item.description}</p>
                    <div className="mt-1 text-[11px] text-muted font-mono">
                      {item.min != null && `min:${item.min} `}
                      {item.max != null && `max:${item.max} `}
                      {item.default != null && `default:${item.default}`}
                      {item.formula && <span className="ml-2 text-yellow">= {item.formula}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button variant="outline" size="xs" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="danger" size="xs" onClick={() => setConfirmDelete(item)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-xl p-7 w-[540px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <h2 className="m-0 mb-5 text-[17px] text-text">{editing ? "Edit Stat" : "New Stat"}</h2>

            <div className="mb-3.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Beyblade Attack" />
              {!editing && form.name && (
                <span className="text-[11px] text-muted mt-0.5 block">ID: {slugify(form.name)}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div>
                <Label>Category *</Label>
                <SearchableSelect
                  options={CATEGORY_OPTIONS}
                  value={form.category}
                  onChange={v => setForm(f => ({ ...f, category: v }))}
                  placeholder="Select category"
                />
              </div>
              <div>
                <Label>Value Type</Label>
                <SearchableSelect
                  options={VAL_TYPE_OPTIONS}
                  value={form.type}
                  onChange={v => setForm(f => ({ ...f, type: v }))}
                  placeholder="Type"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5 mb-3.5">
              {(["min", "max", "default", "step"] as const).map(field => (
                <div key={field}>
                  <Label className="capitalize">{field}</Label>
                  <Input type="number" value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div>
                <Label>Unit <span className="text-faint font-normal">(optional)</span></Label>
                <Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. cm, px, deg/s" />
              </div>
              <div>
                <Label>Formula <span className="text-faint font-normal">(optional)</span></Label>
                <Input value={form.formula} onChange={e => setForm(f => ({ ...f, formula: e.target.value }))} placeholder="e.g. 1.0 + attack * 0.007" />
              </div>
            </div>

            <div className="mb-3.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
              <input type="checkbox" checked={form.affectsPhysics} onChange={e => setForm(f => ({ ...f, affectsPhysics: e.target.checked }))} />
              <span className="text-[13px] text-text">Affects physics (server reads this stat at runtime)</span>
            </label>

            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100]">
          <div className="bg-bg1 border border-border rounded-xl p-7 w-[380px] max-w-[95vw]">
            <h3 className="m-0 mb-3 text-text">Delete Stat?</h3>
            <p className="m-0 mb-5 text-muted text-[13px]">
              Delete <strong className="text-text">{confirmDelete.name}</strong>? Any StatModifier referencing <code className="font-mono">{confirmDelete.id}</code> will have no effect.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
