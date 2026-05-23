import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface AnimationPresetDoc {
  id: string;
  name: string;
  description: string;
  animationType: string;
  durationMs: number;
  easing: string;
  color?: string;
  spriteUrl?: string;
}

const ANIMATION_TYPE_OPTIONS = [
  { value: "hit_flash", label: "Hit Flash", hint: "Screen flash on hit" },
  { value: "combo_burst", label: "Combo Burst", hint: "Burst particle effect on combo activate" },
  { value: "special_surge", label: "Special Surge", hint: "Power surge on special move" },
  { value: "ring_out", label: "Ring Out", hint: "Ring-out explosion" },
  { value: "spin_aura", label: "Spin Aura", hint: "Spinning aura around beyblade" },
  { value: "trail", label: "Trail", hint: "Motion trail behind beyblade" },
  { value: "impact_ring", label: "Impact Ring", hint: "Shockwave ring on collision" },
  { value: "screen_shake", label: "Screen Shake", hint: "Camera shake effect" },
];

const EASING_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In-Out" },
  { value: "bounce", label: "Bounce" },
  { value: "elastic", label: "Elastic" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { name: "", description: "", animationType: "hit_flash", durationMs: 300, easing: "ease-out", color: "#ffffff", spriteUrl: "" };

export default function AnimationPresetsPage() {
  const [items, setItems] = useState<AnimationPresetDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AnimationPresetDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<AnimationPresetDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ANIMATION_PRESETS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AnimationPresetDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load animation presets"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: AnimationPresetDoc) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, animationType: item.animationType, durationMs: item.durationMs, easing: item.easing, color: item.color ?? "#ffffff", spriteUrl: item.spriteUrl ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data: Omit<AnimationPresetDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), animationType: form.animationType,
        durationMs: form.durationMs, easing: form.easing,
        ...(form.color ? { color: form.color } : {}),
        ...(form.spriteUrl.trim() ? { spriteUrl: form.spriteUrl.trim() } : {}),
      };
      const id = editing ? editing.id : slugify(form.name) || `anim-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.ANIMATION_PRESETS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ANIMATION_PRESETS, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  const typeColor: Record<string, string> = {
    hit_flash: "#f87171", combo_burst: "#a78bfa", special_surge: C.yellow,
    ring_out: C.red, spin_aura: C.green, trail: C.blue, impact_ring: "#fb923c", screen_shake: "#94a3b8",
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Animation Presets</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} presets`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Preset
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter presets…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No presets found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const tc = typeColor[item.animationType] ?? C.blue;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                {item.color && <div style={{ width: 20, height: 36, borderRadius: 4, background: item.color, border: `1px solid ${C.border}`, flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                    <span style={{ fontSize: 11, background: tc + "22", color: tc, padding: "2px 7px", borderRadius: 4 }}>{item.animationType}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{item.durationMs}ms · {item.easing}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{item.description}</div>}
                  {item.spriteUrl && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <img src={item.spriteUrl} alt="sprite" style={{ height: 32, borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg2 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span style={{ fontSize: 11, color: C.faint, fontFamily: "monospace", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.spriteUrl}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => openEdit(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>Edit</button>
                <button onClick={() => setConfirmDelete(item)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.red}66`, background: "transparent", color: C.red }}>Delete</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Animation Preset" : "New Animation Preset"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              {!editing && form.name && <span style={{ fontSize: 11, color: C.faint }}>ID: {slugify(form.name) || "…"}</span>}
            </label>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Animation Type</span>
              <SearchableSelect value={form.animationType} onChange={v => setForm(f => ({ ...f, animationType: v }))} options={ANIMATION_TYPE_OPTIONS} placeholder="Type…" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Duration (ms)</span>
                <input type="number" min={0} value={form.durationMs} onChange={e => setForm(f => ({ ...f, durationMs: Number(e.target.value) }))} style={inputStyle} />
              </label>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Easing</span>
                <SearchableSelect value={form.easing} onChange={v => setForm(f => ({ ...f, easing: v }))} options={EASING_OPTIONS} placeholder="Easing…" />
              </div>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Color (hex)</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color || "#ffffff"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ ...inputStyle, width: "auto", flex: 1 }} placeholder="#ffffff" />
              </div>
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Sprite URL <span style={{ color: C.faint }}>(optional — paste asset URL or Firebase Storage link)</span></span>
              <input value={form.spriteUrl} onChange={e => setForm(f => ({ ...f, spriteUrl: e.target.value }))}
                style={inputStyle} placeholder="https://…/sprite.png or gs://…" />
              {form.spriteUrl && (
                <div style={{ marginTop: 8 }}>
                  <img src={form.spriteUrl} alt="preview" style={{ height: 48, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg2 }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                </div>
              )}
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.name}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will permanently remove the animation preset.</p>
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
