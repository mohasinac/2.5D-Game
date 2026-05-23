import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type BeyLinkConfigDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

type BeyLinkCategory = BeyLinkConfigDoc["category"];

const CATEGORY_OPTIONS: { value: BeyLinkCategory; label: string; hint: string }[] = [
  { value: "link_type", label: "Link Type", hint: "corridor, portal, ramp, pit, trampoline" },
  { value: "reverse_condition", label: "Reverse Condition", hint: "always, never, spin_above_50" },
  { value: "bey_link_type", label: "BeyLink Type", hint: "tip_stack, top_mount, side_spin" },
  { value: "alignment", label: "Alignment", hint: "friendly, hostile, neutral" },
  { value: "trigger_condition", label: "Trigger Condition", hint: "any, same_team, opponent_only" },
  { value: "effect_type", label: "Effect Type", hint: "spin_drain, spin_share, damage_boost, etc." },
  { value: "control_mode", label: "Control Mode", hint: "reverse, scramble, freeze" },
  { value: "movement_control", label: "Movement Control", hint: "auto, initiator, player" },
  { value: "group_pattern", label: "Group Pattern", hint: "chain, star, wedge, rigid" },
];

const CAT_COLOR: Record<string, string> = {
  link_type: "#60a5fa", reverse_condition: "#f87171", bey_link_type: "#34d399",
  alignment: "#fbbf24", trigger_condition: "#a78bfa", effect_type: "#fb923c",
  control_mode: "#22d3ee", movement_control: "#e879f9", group_pattern: "#4ade80",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { id: "", label: "", category: "link_type" as BeyLinkCategory, description: "", color: "" };

export function BeyLinkConfigsPage() {
  const [items, setItems] = useState<BeyLinkConfigDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BeyLinkConfigDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<BeyLinkConfigDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEY_LINK_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BeyLinkConfigDoc));
      docs.sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error("Failed to load BeyLink configs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: BeyLinkConfigDoc) => {
    setEditing(item);
    setForm({ id: item.id, label: item.label, category: item.category, description: item.description, color: item.color ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const data: Omit<BeyLinkConfigDoc, "id"> = {
        label: form.label.trim(), category: form.category, description: form.description.trim(),
        ...(form.color ? { color: form.color } : {}),
      };
      await setDoc(doc(db, COLLECTIONS.BEY_LINK_CONFIGS, form.id.trim()), data);
      invalidate("beyLinkConfigs");
      toast.success(editing ? `Updated "${form.label}"` : `Created "${form.label}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEY_LINK_CONFIGS, confirmDelete.id));
      invalidate("beyLinkConfigs");
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
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>BeyLink Configs</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading…" : `${items.length} configs across ${CATEGORY_OPTIONS.filter(c => countByCategory(c.value) > 0).length} categories`}
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Config
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 8, marginBottom: 12 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by label or ID…" style={inputStyle} />
        <SearchableSelect value={categoryFilter} onChange={setCategoryFilter} options={catFilterOpts} placeholder="Category…" />
      </div>

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No configs found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const cc = item.color ?? CAT_COLOR[item.category] ?? C.blue;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                    <span style={{ fontSize: 11, background: cc + "22", color: cc, padding: "2px 7px", borderRadius: 4 }}>{item.category}</span>
                    {item.color && <span style={{ width: 16, height: 16, background: item.color, borderRadius: 3, border: `1px solid ${C.border}`, display: "inline-block", flexShrink: 0 }} />}
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit BeyLink Config" : "New BeyLink Config"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>ID <span style={{ color: C.faint }}>(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} style={{ ...inputStyle, opacity: editing ? 0.5 : 1 }} placeholder="e.g. tip_stack" />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Label</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inputStyle} />
            </label>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Category</span>
              <SearchableSelect value={form.category} onChange={v => setForm(f => ({ ...f, category: v as BeyLinkCategory }))} options={CATEGORY_OPTIONS} placeholder="Category…" />
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Color (hex, optional)</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color || "#888888"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ ...inputStyle, width: "auto", flex: 1 }} placeholder="#60a5fa (optional)" />
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
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Arena links referencing this config will need to be updated manually.</p>
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
