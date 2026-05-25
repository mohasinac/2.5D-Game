import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface BehaviorDefDoc {
  id: string;
  name: string;
  description: string;
  behaviorType: string;
  parameters?: Record<string, unknown>;
}

const BEHAVIOR_TYPE_OPTIONS = [
  { value: "ai_pattern", label: "AI Pattern", hint: "Defines an AI decision-making pattern" },
  { value: "arena_event", label: "Arena Event", hint: "Triggered event logic for arena features" },
  { value: "trigger_effect", label: "Trigger Effect", hint: "What happens when a trigger fires" },
  { value: "switch_logic", label: "Switch Logic", hint: "Control logic for switch-activated features" },
  { value: "obstacle_behavior", label: "Obstacle Behavior", hint: "Dynamic behavior for moving obstacles" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function tryParseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { return null; }
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const EMPTY = { name: "", description: "", behaviorType: "ai_pattern", parametersJson: "{}" };

export default function BehaviorDefsPage() {
  const [items, setItems] = useState<BehaviorDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BehaviorDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [jsonError, setJsonError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<BehaviorDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEHAVIOR_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BehaviorDefDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load behavior defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setJsonError(""); setShowModal(true); };
  const openEdit = (item: BehaviorDefDoc) => {
    setEditing(item);
    setForm({
      name: item.name, description: item.description, behaviorType: item.behaviorType,
      parametersJson: item.parameters ? JSON.stringify(item.parameters, null, 2) : "{}",
    });
    setJsonError("");
    setShowModal(true);
  };

  const handleJsonChange = (v: string) => {
    setForm(f => ({ ...f, parametersJson: v }));
    setJsonError(tryParseJson(v) ? "" : "Invalid JSON");
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const params = tryParseJson(form.parametersJson);
    if (!params) { toast.error("Parameters JSON is invalid"); return; }
    setSaving(true);
    try {
      const data: Omit<BehaviorDefDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), behaviorType: form.behaviorType,
        parameters: params,
      };
      const id = editing ? editing.id : slugify(form.name) || `behavior-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.BEHAVIOR_DEFS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEHAVIOR_DEFS, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  const typeColor: Record<string, string> = {
    ai_pattern: C.green, arena_event: C.yellow, trigger_effect: "#fb923c",
    switch_logic: C.blue, obstacle_behavior: "#a78bfa",
  };

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Behavior Definitions</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>{loading ? "Loading…" : `${items.length} behavior defs`}</p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Behavior
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter behaviors…"
        style={{ ...inputStyle, marginBottom: 12 }} />

      {loading ? <div style={{ color: C.muted }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: C.muted }}>No behavior defs found.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const tc = typeColor[item.behaviorType] ?? C.blue;
            const paramCount = item.parameters ? Object.keys(item.parameters).length : 0;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                    <span style={{ fontSize: 11, background: tc + "22", color: tc, padding: "2px 7px", borderRadius: 4 }}>{item.behaviorType}</span>
                    {paramCount > 0 && <span style={{ fontSize: 11, color: C.muted }}>{paramCount} param{paramCount !== 1 ? "s" : ""}</span>}
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
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{editing ? "Edit Behavior Def" : "New Behavior Def"}</h3>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              {!editing && form.name && <span style={{ fontSize: 11, color: C.faint }}>ID: {slugify(form.name) || "…"}</span>}
            </label>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Behavior Type</span>
              <SearchableSelect value={form.behaviorType} onChange={v => setForm(f => ({ ...f, behaviorType: v }))} options={BEHAVIOR_TYPE_OPTIONS} placeholder="Type…" />
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>
                Parameters (JSON)
                {jsonError && <span style={{ color: C.red, marginLeft: 8 }}>{jsonError}</span>}
              </span>
              <textarea value={form.parametersJson} onChange={e => handleJsonChange(e.target.value)} rows={6}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12, border: `1px solid ${jsonError ? C.red : C.border}` }} />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !!jsonError} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, border: "none", background: C.blue, color: "#fff", cursor: "pointer", opacity: (saving || !!jsonError) ? 0.6 : 1 }}>
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
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will permanently remove the behavior definition.</p>
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
