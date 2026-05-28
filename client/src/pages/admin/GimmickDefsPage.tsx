import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableMultiSelect } from "@/components/admin/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
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
  { value: "energy_reserve",            label: "energy_reserve",            hint: "Spring-loaded kinetic energy burst" },
  { value: "free_spin",                 label: "free_spin",                 hint: "Reduced spin decay (bearing)" },
  { value: "spin_transfer",             label: "spin_transfer",             hint: "Steal fraction of opponent spin on contact" },
  { value: "spin_equalization",         label: "spin_equalization",         hint: "Bidirectional spin averaging on contact" },
  { value: "stamina_recovery",          label: "stamina_recovery",          hint: "Passive spin recovery per tick" },
  { value: "revival_spin",              label: "revival_spin",              hint: "Spin burst when below threshold" },
  { value: "defense_stance",            label: "defense_stance",            hint: "Zero velocity + damage reduction for N ticks" },
  { value: "burst_suppress",            label: "burst_suppress",            hint: "Resist burst pressure for N ms" },
  { value: "recoil_guard",              label: "recoil_guard",              hint: "Reduces knockback distance" },
  { value: "contact_deflect",           label: "contact_deflect",           hint: "Deflect attacker sideways at high-speed contact" },
  { value: "spring_recoil",             label: "spring_recoil",             hint: "Launch attacker back with high recoil force" },
  { value: "rubber_grip",               label: "rubber_grip",               hint: "High surface friction on contact" },
  { value: "weight_shift",              label: "weight_shift",              hint: "Move center-of-mass toward impact point" },
  { value: "attack_amplifier",          label: "attack_amplifier",          hint: "Multiply outgoing damage for N ticks" },
  { value: "velocity_burst",            label: "velocity_burst",            hint: "Directional force impulse in facing direction" },
  { value: "smash_impact",              label: "smash_impact",              hint: "High-power horizontal smash on contact" },
  { value: "upper_launch",              label: "upper_launch",              hint: "Launch opponent upward on contact" },
  { value: "barrage_hit",               label: "barrage_hit",               hint: "Rapid multi-hit burst on contact" },
  { value: "sub_part_burst",            label: "sub_part_burst",            hint: "Spawn secondary projectile on hit" },
  { value: "spin_steal_coupling",       label: "spin_steal_coupling",       hint: "Glancing-angle spin steal multiplier" },
  { value: "orbit_movement",            label: "orbit_movement",            hint: "Circular orbital force (cw/ccw)" },
  { value: "bearing_drift",             label: "bearing_drift",             hint: "Reduced friction drift" },
  { value: "center_pull",               label: "center_pull",               hint: "Gentle pull toward arena center" },
  { value: "surface_friction_modifier", label: "surface_friction_modifier", hint: "Alter ground grip friction" },
  { value: "rail_lock",                 label: "rail_lock",                 hint: "Lock onto Xtreme Dash rail" },
  { value: "rotation_reverse",          label: "rotation_reverse",          hint: "Flip spin direction CW/CCW" },
  { value: "spin_threshold_switch",     label: "spin_threshold_switch",     hint: "Mode-change trigger at spin threshold" },
  { value: "mode_switch",               label: "mode_switch",               hint: "Manual click-to-change mode switch" },
  { value: "contact_height_gate",       label: "contact_height_gate",       hint: "Only fire mechanic above/below height" },
  { value: "spin_direction_bonus",      label: "spin_direction_bonus",      hint: "Bonus damage vs counter-spin opponents" },
  { value: "zero_g_float",              label: "zero_g_float",              hint: "Reduce effective gravity for bey" },
  { value: "magnetic_pull",             label: "magnetic_pull",             hint: "Attract or repel nearby beys" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

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
    <div className="p-4 sm:p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="m-0 text-[22px] text-text">Gimmick Defs</h1>
          <p className="mt-1 text-[13px] text-muted">
            {items.length} gimmick{items.length !== 1 ? "s" : ""} — mechanic recipes referenced by beyblade_stats.gimmickIds[]
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Gimmick</Button>
      </div>

      <Input
        placeholder="Search by name, id, or mechanic…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-5"
      />

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted">No gimmick defs found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-start justify-between bg-bg1 border border-border rounded-xl px-4 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-text">{item.name}</span>
                  <span className="text-[11px] text-muted font-mono">{item.id}</span>
                </div>
                <p className="m-0 mb-1.5 text-xs text-muted">{item.description}</p>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {(item.beybladeTypes ?? []).map(t => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-xl bg-bg0 border border-border text-muted">{t}</span>
                  ))}
                  {(item.beybladeTypes ?? []).length > 0 && <span className="text-[11px] text-muted ml-1">&#8594;</span>}
                  {(item.behaviorRefs ?? []).map((r, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-xl font-mono text-green border border-green/30 bg-green/10">{r.behaviorId}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button variant="outline" size="xs" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" size="xs" onClick={() => setConfirmDelete(item)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-xl p-4 sm:p-7 w-[580px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <h2 className="m-0 mb-5 text-[17px] text-text">{editing ? "Edit Gimmick" : "New Gimmick"}</h2>

            <div className="mb-3.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Free Spin Tip" />
              {!editing && form.name && (
                <span className="text-[11px] text-muted mt-0.5 block">ID: {slugify(form.name)}</span>
              )}
            </div>

            <div className="mb-3.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="What this gimmick does in-game…"
              />
            </div>

            <div className="mb-3.5">
              <Label>Beyblade Types</Label>
              <SearchableMultiSelect
                options={BEY_TYPE_OPTIONS}
                values={form.beybladeTypes}
                onChange={v => setForm(f => ({ ...f, beybladeTypes: v }))}
                placeholder="Select compatible beyblade types…"
              />
            </div>

            <div className="mb-5">
              <Label>
                Behavior Refs (JSON array)
                {jsonError && <span className="text-red ml-2">{jsonError}</span>}
              </Label>
              <div className="text-[11px] text-muted mb-1.5">
                Each entry: <code className="font-mono">{"{ \"behaviorId\": \"...\", \"params\": {} }"}</code>
              </div>
              <textarea
                value={form.behaviorRefsJson}
                onChange={e => handleRefsChange(e.target.value)}
                rows={8}
                className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-text placeholder:text-faint focus:outline-none focus:border-blue resize-y font-mono text-xs"
              />
              <div className="mt-1.5 flex gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted">Quick add:</span>
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
                    className="text-[11px] px-2 py-0.5 rounded-xl bg-bg0 border border-border text-muted cursor-pointer hover:border-blue hover:text-blue"
                  >
                    + {opt.value}
                  </button>
                ))}
              </div>
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
          <div className="bg-bg1 border border-border rounded-xl p-4 sm:p-7 w-[380px] max-w-[95vw]">
            <h3 className="m-0 mb-3 text-text">Delete Gimmick?</h3>
            <p className="m-0 mb-5 text-muted text-[13px]">
              Delete <strong className="text-text">{confirmDelete.name}</strong>? Any beyblade_stats referencing <code className="font-mono">{confirmDelete.id}</code> in gimmickIds[] will not expand at match start.
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
