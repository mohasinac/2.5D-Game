import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect, SearchableMultiSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

interface BehaviorRef {
  behaviorId: string;
  params?: Record<string, unknown>;
}

interface GimmickDefDoc {
  id: string;
  name: string;
  description: string;
  beybladeTypes: string[];
  behaviorRefs: BehaviorRef[];
}

const BEY_TYPE_OPTIONS = [
  { value: "attack",   label: "Attack" },
  { value: "defense",  label: "Defense" },
  { value: "stamina",  label: "Stamina" },
  { value: "balanced", label: "Balanced" },
];

const MECHANIC_ID_OPTIONS = [
  // stamina
  { value: "energy_reserve",          label: "energy_reserve",          hint: "Spring-loaded kinetic energy burst" },
  { value: "free_spin",               label: "free_spin",               hint: "Reduced spin decay (bearing)" },
  { value: "spin_transfer",           label: "spin_transfer",           hint: "Steal fraction of opponent spin on contact" },
  { value: "spin_equalization",       label: "spin_equalization",       hint: "Bidirectional spin averaging on contact" },
  { value: "stamina_recovery",        label: "stamina_recovery",        hint: "Passive spin recovery per tick" },
  { value: "revival_spin",            label: "revival_spin",            hint: "Spin burst when below threshold" },
  // defense
  { value: "defense_stance",          label: "defense_stance",          hint: "Zero velocity + damage reduction for N ticks" },
  { value: "burst_suppress",          label: "burst_suppress",          hint: "Resist burst pressure for N ms" },
  { value: "recoil_guard",            label: "recoil_guard",            hint: "Reduces knockback distance" },
  { value: "contact_deflect",         label: "contact_deflect",         hint: "Deflect attacker sideways at high-speed contact" },
  { value: "spring_recoil",           label: "spring_recoil",           hint: "Launch attacker back with high recoil force" },
  { value: "rubber_grip",             label: "rubber_grip",             hint: "High surface friction on contact" },
  { value: "weight_shift",            label: "weight_shift",            hint: "Move center-of-mass toward impact point" },
  // attack
  { value: "attack_amplifier",        label: "attack_amplifier",        hint: "Multiply outgoing damage for N ticks" },
  { value: "velocity_burst",          label: "velocity_burst",          hint: "Directional force impulse in facing direction" },
  { value: "smash_impact",            label: "smash_impact",            hint: "High-power horizontal smash on contact" },
  { value: "upper_launch",            label: "upper_launch",            hint: "Launch opponent upward on contact" },
  { value: "barrage_hit",             label: "barrage_hit",             hint: "Rapid multi-hit burst on contact" },
  { value: "sub_part_burst",          label: "sub_part_burst",          hint: "Spawn secondary projectile on hit" },
  { value: "spin_steal_coupling",     label: "spin_steal_coupling",     hint: "Glancing-angle spin steal multiplier" },
  // movement
  { value: "orbit_movement",          label: "orbit_movement",          hint: "Circular orbital force (cw/ccw)" },
  { value: "bearing_drift",           label: "bearing_drift",           hint: "Reduced friction drift" },
  { value: "center_pull",             label: "center_pull",             hint: "Gentle pull toward arena center" },
  { value: "surface_friction_modifier", label: "surface_friction_modifier", hint: "Alter ground grip friction" },
  { value: "rail_lock",               label: "rail_lock",               hint: "Lock onto Xtreme Dash rail" },
  // special
  { value: "rotation_reverse",        label: "rotation_reverse",        hint: "Flip spin direction CWâ†”CCW" },
  { value: "spin_threshold_switch",   label: "spin_threshold_switch",   hint: "Mode-change trigger at spin threshold" },
  { value: "mode_switch",             label: "mode_switch",             hint: "Manual click-to-change mode switch" },
  { value: "contact_height_gate",     label: "contact_height_gate",     hint: "Only fire mechanic above/below height" },
  { value: "spin_direction_bonus",    label: "spin_direction_bonus",    hint: "Bonus damage vs counter-spin opponents" },
  { value: "zero_g_float",            label: "zero_g_float",            hint: "Reduce effective gravity for bey" },
  { value: "magnetic_pull",           label: "magnetic_pull",           hint: "Attract or repel nearby beys" },
];

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

const EMPTY_FORM = {
  name: "",
  description: "",
  beybladeTypes: [] as string[],
  behaviorRefsJson: "[]",
};

export default function GimmickDefsPage() {
  const [items, setItems] = useState<GimmickDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GimmickDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [jsonError, setJsonError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<GimmickDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.GIMMICK_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as GimmickDefDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load gimmick defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setJsonError("");
    setShowModal(true);
  }

  function openEdit(item: GimmickDefDoc) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      beybladeTypes: item.beybladeTypes ?? [],
      behaviorRefsJson: JSON.stringify(item.behaviorRefs ?? [], null, 2),
    });
    setJsonError("");
    setShowModal(true);
  }

  function handleRefsChange(val: string) {
    setForm(f => ({ ...f, behaviorRefsJson: val }));
    try { JSON.parse(val); setJsonError(""); } catch { setJsonError("Invalid JSON"); }
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    let behaviorRefs: BehaviorRef[];
    try { behaviorRefs = JSON.parse(form.behaviorRefsJson); }
    catch { toast.error("behaviorRefs JSON is invalid"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : slugify(form.name);
      await setDoc(doc(db, COLLECTIONS.GIMMICK_DEFS, id), {
        id,
        name: form.name.trim(),
        description: form.description.trim(),
        beybladeTypes: form.beybladeTypes,
        behaviorRefs,
      });
      toast.success(editing ? "Gimmick updated" : "Gimmick created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.GIMMICK_DEFS, confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  }

  const filtered = items.filter(i =>
    !query ||
    i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    (i.behaviorRefs ?? []).some(r => r.behaviorId.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 960 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: C.text }}>Gimmick Defs</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
            {items.length} gimmick{items.length !== 1 ? "s" : ""} â€” mechanic recipes referenced by beyblade_stats.gimmickIds[]
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          + New Gimmick
        </button>
      </div>

      <input
        placeholder="Search by name, id, or mechanicâ€¦"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      {loading ? (
        <p style={{ color: C.muted }}>Loadingâ€¦</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: C.muted }}>No gimmick defs found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{item.id}</span>
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: C.muted }}>{item.description}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {(item.beybladeTypes ?? []).map(t => (
                    <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: C.bg0, border: `1px solid ${C.border}`, color: C.muted }}>{t}</span>
                  ))}
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>â†’</span>
                  {(item.behaviorRefs ?? []).map((r, i) => (
                    <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "#1a2a1a", border: `1px solid #2a4a2a`, color: "#6fcf6f", fontFamily: "monospace" }}>{r.behaviorId}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, cursor: "pointer" }}>Edit</button>
                <button onClick={() => setConfirmDelete(item)} style={{ padding: "5px 12px", background: C.bg0, border: `1px solid #c0392b`, borderRadius: 6, color: "#e74c3c", fontSize: 12, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 580, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 17, color: C.text }}>{editing ? "Edit Gimmick" : "New Gimmick"}</h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Free Spin Tip" />
              {!editing && form.name && (
                <span style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "block" }}>ID: {slugify(form.name)}</span>
              )}
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="What this gimmick does in-gameâ€¦"
              />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Beyblade Types</span>
              <SearchableMultiSelect
                options={BEY_TYPE_OPTIONS}
                values={form.beybladeTypes}
                onChange={v => setForm(f => ({ ...f, beybladeTypes: v }))}
                placeholder="Select compatible beyblade typesâ€¦"
              />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>
                Behavior Refs (JSON array)
                {jsonError && <span style={{ color: "#e74c3c", marginLeft: 8 }}>{jsonError}</span>}
              </span>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                Each entry: <code style={{ fontFamily: "monospace" }}>{"{ \"behaviorId\": \"...\", \"params\": {} }"}</code>
              </div>
              <textarea
                value={form.behaviorRefsJson}
                onChange={e => handleRefsChange(e.target.value)}
                rows={8}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
              />
              <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: C.muted }}>Quick add:</span>
                {MECHANIC_ID_OPTIONS.slice(0, 6).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      try {
                        const arr = JSON.parse(form.behaviorRefsJson) as BehaviorRef[];
                        if (!arr.some(r => r.behaviorId === opt.value)) {
                          const newArr = [...arr, { behaviorId: opt.value, params: {} }];
                          handleRefsChange(JSON.stringify(newArr, null, 2));
                        }
                      } catch { /* ignore */ }
                    }}
                    style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: C.bg0, border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer" }}
                  >
                    + {opt.value}
                  </button>
                ))}
              </div>
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !!jsonError} style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Savingâ€¦" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 380, maxWidth: "95vw" }}>
            <h3 style={{ margin: "0 0 12px", color: C.text }}>Delete Gimmick?</h3>
            <p style={{ margin: "0 0 20px", color: C.muted, fontSize: 13 }}>
              Delete <strong style={{ color: C.text }}>{confirmDelete.name}</strong>? Any beyblade_stats referencing <code style={{ fontFamily: "monospace" }}>{confirmDelete.id}</code> in gimmickIds[] will not expand at match start.
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
