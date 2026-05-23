import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type PartMaterialDoc } from "@/stores/gameDataStore";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const numInputStyle: React.CSSProperties = {
  ...inputStyle, width: 90,
};

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
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 3 }}>
        {label}{hint && <span style={{ color: C.faint, marginLeft: 4 }}>{hint}</span>}
      </span>
      <input
        type="number" min={min} max={max} step={step ?? 0.01}
        value={value ?? ""}
        onChange={e => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        style={numInputStyle}
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
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Part Materials</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading…" : `${items.length} material profiles`}
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Material
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter materials…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? (
        <div style={{ color: C.muted }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: C.muted }}>No materials found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                </div>
                {item.description && <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{item.description}</div>}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, color: C.faint }}>
                  {item.gripFactor !== undefined && <span>grip: {pf(item.gripFactor)}</span>}
                  {item.aggressiveness !== undefined && <span>aggression: {pf(item.aggressiveness)}</span>}
                  {item.recoilFactor !== undefined && <span>recoil: {pf(item.recoilFactor)}</span>}
                  {item.surfaceFriction !== undefined && <span>friction: {pf(item.surfaceFriction)}</span>}
                  {item.density !== undefined && <span>density: {item.density} g/cm³</span>}
                  {item.durabilityDecay !== undefined && <span>decay: {pf(item.durabilityDecay)}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>Edit</button>
              <button onClick={() => setConfirmDelete(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.red}66`, background: "transparent", color: C.red }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, overflowY: "auto" }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 520 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>
              {editing ? "Edit Material" : "New Material"}
            </h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>ID <span style={{ color: C.faint }}>(slug, no spaces)</span></span>
              <input value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} style={{ ...inputStyle, opacity: editing ? 0.5 : 1 }} placeholder="e.g. rubber" />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Label</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inputStyle} placeholder="e.g. Rubber" />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Optional description of this material's characteristics" />
            </label>

            <p style={{ fontSize: 11, color: C.faint, marginBottom: 12 }}>Physics defaults — leave blank to let the server compute from material type.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              <NumField label="Grip Factor" hint="0–1" value={form.gripFactor} onChange={v => setForm(f => ({ ...f, gripFactor: v }))} min={0} max={1} />
              <NumField label="Aggressiveness" hint="0–1" value={form.aggressiveness} onChange={v => setForm(f => ({ ...f, aggressiveness: v }))} min={0} max={1} />
              <NumField label="Recoil Factor" hint="0–1" value={form.recoilFactor} onChange={v => setForm(f => ({ ...f, recoilFactor: v }))} min={0} max={1} />
              <NumField label="Surface Friction" hint="0–5" value={form.surfaceFriction} onChange={v => setForm(f => ({ ...f, surfaceFriction: v }))} min={0} max={5} step={0.1} />
              <NumField label="Density" hint="g/cm³" value={form.density} onChange={v => setForm(f => ({ ...f, density: v }))} min={0} step={0.01} />
              <NumField label="Durability Decay" hint="0–1" value={form.durabilityDecay} onChange={v => setForm(f => ({ ...f, durabilityDecay: v }))} min={0} max={1} />
            </div>

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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.label}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Tip parts referencing this material ID will retain the string value but lose profile defaults.</p>
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
