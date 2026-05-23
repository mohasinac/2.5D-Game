import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
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

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

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
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: C.text }}>Geometry Defs</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
            {items.length} shape{items.length !== 1 ? "s" : ""} — reusable geometry primitives for arenas, parts, and zones
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          + New Geometry
        </button>
      </div>

      <input
        placeholder="Search by name, id, or type…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      {loading ? (
        <p style={{ color: C.muted }}>Loading…</p>
      ) : byType.length === 0 ? (
        <p style={{ color: C.muted }}>No geometry defs found.</p>
      ) : (
        byType.map(group => (
          <div key={group.value} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.blue, marginBottom: 8 }}>
              {group.label} <span style={{ color: C.muted, fontWeight: 400 }}>— {group.hint}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{item.id}</span>
                      {item.boundingRadius != null && (
                        <span style={{ fontSize: 11, color: C.muted }}>r={item.boundingRadius}cm</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.description}</p>
                    {item.shape && Object.keys(item.shape).length > 0 && (
                      <div style={{ marginTop: 4, fontSize: 11, color: C.muted, fontFamily: "monospace" }}>
                        {Object.entries(item.shape).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ")}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => setConfirmDelete(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid #c0392b`, borderRadius: 6, color: "#e74c3c", fontSize: 12, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 520, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 17, color: C.text }}>{editing ? "Edit Geometry" : "New Geometry"}</h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Circle SM" />
              {!editing && form.name && (
                <span style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "block" }}>ID: {slugify(form.name)}</span>
              )}
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Type *</span>
              <SearchableSelect
                options={TYPE_OPTIONS}
                value={form.type}
                onChange={handleTypeChange}
                placeholder="Select type"
              />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Bounding Radius (cm)</span>
              <input type="number" min={0} step={0.1} value={form.boundingRadius}
                onChange={e => setForm(f => ({ ...f, boundingRadius: Number(e.target.value) }))}
                style={inputStyle} />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>
                Shape Data (JSON)
                {jsonError && <span style={{ color: "#e74c3c", marginLeft: 8 }}>{jsonError}</span>}
              </span>
              <textarea
                value={form.shapeJson}
                onChange={e => handleShapeChange(e.target.value)}
                rows={5}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !!jsonError} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 380, maxWidth: "95vw" }}>
            <h3 style={{ margin: "0 0 12px", color: C.text }}>Delete Geometry?</h3>
            <p style={{ margin: "0 0 20px", color: C.muted, fontSize: 13 }}>
              Delete <strong style={{ color: C.text }}>{confirmDelete.name}</strong>? Any configs referencing <code style={{ fontFamily: "monospace" }}>{confirmDelete.id}</code> will lose their geometry link.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
