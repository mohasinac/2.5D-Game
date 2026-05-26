import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";

interface GeometryDefDoc {
  id: string;
  name: string;
  type: string;
  description: string;
  boundingRadius?: number;
  shape?: Record<string, unknown>;
}

const TYPE_OPTIONS = [
  { value: "circle",      label: "Circle",      hint: "Simple filled circle — radius" },
  { value: "ring",        label: "Ring",         hint: "Annular ring — innerRadius + outerRadius" },
  { value: "polygon",     label: "Polygon",      hint: "Regular n-gon or convex hull — vertices[]" },
  { value: "arc_segment", label: "Arc Segment",  hint: "Wedge / partial ring — arcStart, arcEnd, radii" },
  { value: "bezier",      label: "Bézier",       hint: "Cubic bezier path — controlPoints[]" },
  { value: "fourier",     label: "Fourier",      hint: "Radial Fourier profile — harmonics[]" },
  { value: "composite",   label: "Composite",    hint: "Union of other geometryDef IDs — refs[]" },
  { value: "point",       label: "Point",        hint: "Single contact point — x, y" },
];

const SHAPE_DEFAULTS: Record<string, Record<string, unknown>> = {
  circle:      { radius: 1.0 },
  ring:        { innerRadius: 0.5, outerRadius: 1.0 },
  polygon:     { sides: 6, radius: 1.0, vertices: [] },
  arc_segment: { arcStart: 0, arcEnd: 90, radiusInner: 0.5, radiusOuter: 1.0 },
  bezier:      { controlPoints: [] },
  fourier:     { harmonics: [] },
  composite:   { refs: [] },
  point:       { x: 0, y: 0 },
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function tryParseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { return null; }
}

const EMPTY = { name: "", type: "circle", description: "", boundingRadius: 1.0, shapeJson: JSON.stringify({ radius: 1.0 }, null, 2) };

export default function GeometryDefsPage() {
  const [items, setItems] = useState<GeometryDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GeometryDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [jsonError, setJsonError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<GeometryDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.GEOMETRY_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as GeometryDefDoc));
      docs.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load geometry defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setJsonError("");
    setShowModal(true);
  }

  function openEdit(item: GeometryDefDoc) {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type,
      description: item.description ?? "",
      boundingRadius: item.boundingRadius ?? 1.0,
      shapeJson: item.shape ? JSON.stringify(item.shape, null, 2) : "{}",
    });
    setJsonError("");
    setShowModal(true);
  }

  function handleTypeChange(t: string) {
    const defaultShape = SHAPE_DEFAULTS[t] ?? {};
    setForm(f => ({ ...f, type: t, shapeJson: JSON.stringify(defaultShape, null, 2) }));
    setJsonError("");
  }

  function handleShapeChange(val: string) {
    setForm(f => ({ ...f, shapeJson: val }));
    setJsonError(tryParseJson(val) === null ? "Invalid JSON" : "");
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const shape = tryParseJson(form.shapeJson);
    if (shape === null) { toast.error("Shape JSON is invalid"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : slugify(form.name);
      await setDoc(doc(db, COLLECTIONS.GEOMETRY_DEFS, id), {
        id,
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        boundingRadius: form.boundingRadius,
        shape,
      });
      toast.success(editing ? "Geometry updated" : "Geometry created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.GEOMETRY_DEFS, confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  }

  const filtered = items.filter(i =>
    !query || i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.type.toLowerCase().includes(query.toLowerCase())
  );

  const byType = TYPE_OPTIONS.map(t => ({
    ...t,
    items: filtered.filter(i => i.type === t.value),
  })).filter(g => g.items.length > 0);

  return (
    <div className="p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="m-0 text-[22px] text-text">Geometry Defs</h1>
          <p className="mt-1 text-[13px] text-muted">
            {items.length} shape{items.length !== 1 ? "s" : ""} — reusable geometry primitives for arenas, parts, and zones
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Geometry</Button>
      </div>

      <Input
        placeholder="Search by name, id, or type…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-5"
      />

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : byType.length === 0 ? (
        <p className="text-muted">No geometry defs found.</p>
      ) : (
        byType.map(group => (
          <div key={group.value} className="mb-7">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue mb-2">
              {group.label} <span className="text-muted font-normal">— {group.hint}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start justify-between bg-bg1 border border-border rounded-lg px-3.5 py-2.5 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-text">{item.name}</span>
                      <span className="text-[11px] text-muted font-mono">{item.id}</span>
                      {item.boundingRadius != null && (
                        <span className="text-[11px] text-muted">r={item.boundingRadius}cm</span>
                      )}
                    </div>
                    <p className="m-0 text-xs text-muted leading-relaxed">{item.description}</p>
                    {item.shape && Object.keys(item.shape).length > 0 && (
                      <div className="mt-1 text-[11px] text-muted font-mono">
                        {Object.entries(item.shape).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ")}
                      </div>
                    )}
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
          <div className="bg-bg1 border border-border rounded-xl p-7 w-[520px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <h2 className="m-0 mb-5 text-[17px] text-text">{editing ? "Edit Geometry" : "New Geometry"}</h2>

            <div className="mb-3.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Circle SM" />
              {!editing && form.name && (
                <span className="text-[11px] text-muted mt-0.5 block">ID: {slugify(form.name)}</span>
              )}
            </div>

            <div className="mb-3.5">
              <Label>Type *</Label>
              <SearchableSelect
                options={TYPE_OPTIONS}
                value={form.type}
                onChange={handleTypeChange}
                placeholder="Select type"
              />
            </div>

            <div className="mb-3.5">
              <Label>Bounding Radius (cm)</Label>
              <Input type="number" min={0} step={0.1} value={form.boundingRadius}
                onChange={e => setForm(f => ({ ...f, boundingRadius: Number(e.target.value) }))} />
            </div>

            <div className="mb-3.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="mb-5">
              <Label>
                Shape Data (JSON)
                {jsonError && <span className="text-red ml-2">{jsonError}</span>}
              </Label>
              <textarea
                value={form.shapeJson}
                onChange={e => handleShapeChange(e.target.value)}
                rows={5}
                className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-text placeholder:text-faint focus:outline-none focus:border-blue resize-y font-mono text-xs"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || !!jsonError}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100]">
          <div className="bg-bg1 border border-border rounded-xl p-7 w-[380px] max-w-[95vw]">
            <h3 className="m-0 mb-3 text-text">Delete Geometry?</h3>
            <p className="m-0 mb-5 text-muted text-[13px]">
              Delete <strong className="text-text">{confirmDelete.name}</strong>? Any configs referencing <code className="font-mono">{confirmDelete.id}</code> will lose their geometry link.
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
