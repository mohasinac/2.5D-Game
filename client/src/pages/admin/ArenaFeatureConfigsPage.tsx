import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type ArenaFeatureConfigDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  { value: "hazard", label: "Hazard", hint: "Floor hazard zones (lava, ice, electric…)" },
  { value: "effect_zone", label: "Effect Zone", hint: "Power-up / debuff zones" },
  { value: "particle", label: "Particle", hint: "Ambient particle emitters" },
  { value: "env_preset", label: "Env Preset", hint: "Environment / weather presets" },
];

const CATEGORY_COLORS: Record<string, string> = {
  hazard: "#ef4444",
  effect_zone: "#22d3ee",
  particle: "#a78bfa",
  env_preset: "#34d399",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { id: "", label: "", category: "hazard" as ArenaFeatureConfigDoc["category"], description: "", icon: "", color: "" };

export function ArenaFeatureConfigsPage() {
  const [items, setItems] = useState<ArenaFeatureConfigDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ArenaFeatureConfigDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<ArenaFeatureConfigDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_FEATURE_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaFeatureConfigDoc));
      docs.sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load arena feature configs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: ArenaFeatureConfigDoc) => {
    setEditing(item);
    setForm({ id: item.id, label: item.label, category: item.category, description: item.description, icon: item.icon ?? "", color: item.color ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const data: Omit<ArenaFeatureConfigDoc, "id"> = {
        label: form.label.trim(), category: form.category, description: form.description.trim(),
        ...(form.icon ? { icon: form.icon } : {}),
        ...(form.color ? { color: form.color } : {}),
      };
      await setDoc(doc(db, COLLECTIONS.ARENA_FEATURE_CONFIGS, form.id.trim()), data);
      invalidate("arenaFeatureConfigs");
      toast.success(editing ? `Updated "${form.label}"` : `Created "${form.label}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARENA_FEATURE_CONFIGS, confirmDelete.id));
      invalidate("arenaFeatureConfigs");
      toast.success(`Deleted "${confirmDelete.label}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const catFilterOpts = [{ value: "all", label: "All categories" }, ...CATEGORY_OPTIONS];

  let filtered = categoryFilter !== "all" ? items.filter(i => i.category === categoryFilter) : items;
  if (query) filtered = filtered.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query));

  const countByCategory = (cat: string) => items.filter(i => i.category === cat).length;

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Arena Feature Configs</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading…" : `${items.length} configs — ${CATEGORY_OPTIONS.map(c => `${countByCategory(c.value)} ${c.label}`).join(", ")}`}
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Config
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 8, marginBottom: 12 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by label or ID…" style={inputStyle} />
        <SearchableSelect value={categoryFilter} onChange={setCategoryFilter} options={catFilterOpts} placeholder="Category…" />
      </div>

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No configs found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const cc = CATEGORY_COLORS[item.category] ?? C.blue;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                {(item.icon || item.color) && (
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: (item.color ?? cc) + "33", border: `2px solid ${item.color ?? cc}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {item.icon ?? ""}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                    <span style={{ fontSize: 11, background: cc + "22", color: cc, padding: "2px 7px", borderRadius: 4 }}>{item.category}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{item.description}</div>}
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
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Feature Config" : "New Feature Config"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>ID <span style={{ color: C.faint }}>(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} style={{ ...inputStyle, opacity: editing ? 0.5 : 1 }} placeholder="e.g. lava_floor" />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Label</span>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inputStyle} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Icon</span>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  style={{ ...inputStyle, width: 56, textAlign: "center", fontSize: 20 }} placeholder="🔥" />
              </label>
            </div>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Category</span>
              <SearchableSelect value={form.category} onChange={v => setForm(f => ({ ...f, category: v as ArenaFeatureConfigDoc["category"] }))} options={CATEGORY_OPTIONS} placeholder="Category…" />
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Color (hex, optional)</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color || "#888888"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ ...inputStyle, width: "auto", flex: 1 }} placeholder="#ff4444 (optional)" />
              </div>
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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.label}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Arena features referencing this config ID will need to be updated manually.</p>
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
