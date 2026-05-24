import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

type KnockbackKind = "none" | "partial" | "full" | "reversed" | "enhanced";
type PeakFor = "attacker" | "defender" | "both";

interface TimingBonus {
  conditionDescription: string;
  peakFor: PeakFor;
  bonusScale: number;
}

interface SpecialInteractionDoc {
  id: string;
  attackerDamageScale: number;
  defenderDamageScale: number;
  attackerSpinDelta: number;
  defenderSpinDelta: number;
  attackerKnockback: KnockbackKind;
  defenderKnockback: KnockbackKind;
  timingBonus?: TimingBonus;
  description: string;
}

const GROUPS = ["strike", "aerial", "guard", "field"] as const;
const KNOCKBACK_KINDS: KnockbackKind[] = ["none", "partial", "full", "reversed", "enhanced"];
const PEAK_FOR: PeakFor[] = ["attacker", "defender", "both"];

const ALL_KEYS = GROUPS.flatMap(a => GROUPS.map(d => `${a}:${d}`)).sort();

const EMPTY: SpecialInteractionDoc = {
  id: "strike:strike",
  attackerDamageScale: 1.0,
  defenderDamageScale: 1.0,
  attackerSpinDelta: 0,
  defenderSpinDelta: 0,
  attackerKnockback: "partial",
  defenderKnockback: "partial",
  description: "",
};

const inp: React.CSSProperties = {
  width: "100%", padding: "7px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, boxSizing: "border-box",
};

const numInp: React.CSSProperties = { ...inp, width: "100%" };

function KbSelect({ value, onChange }: { value: KnockbackKind; onChange: (v: KnockbackKind) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as KnockbackKind)}
      style={{ ...inp, padding: "6px 8px" }}>
      {KNOCKBACK_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
    </select>
  );
}

export function SpecialInteractionDefsPage() {
  const [items, setItems] = useState<SpecialInteractionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SpecialInteractionDoc | null>(null);
  const [form, setForm] = useState<SpecialInteractionDoc>({ ...EMPTY });
  const [hasTimingBonus, setHasTimingBonus] = useState(false);
  const [timingBonus, setTimingBonus] = useState<TimingBonus>({ conditionDescription: "", peakFor: "both", bonusScale: 1.2 });
  const [confirmDelete, setConfirmDelete] = useState<SpecialInteractionDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.SPECIAL_INTERACTION_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as SpecialInteractionDoc));
      docs.sort((a, b) => a.id.localeCompare(b.id));
      setItems(docs);
    } catch { toast.error("Failed to load special interaction defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setHasTimingBonus(false);
    setTimingBonus({ conditionDescription: "", peakFor: "both", bonusScale: 1.2 });
    setShowModal(true);
  };

  const openEdit = (item: SpecialInteractionDoc) => {
    setEditing(item);
    setForm({ ...item, timingBonus: undefined });
    const tb = item.timingBonus;
    if (tb) {
      setHasTimingBonus(true);
      setTimingBonus({ ...tb });
    } else {
      setHasTimingBonus(false);
      setTimingBonus({ conditionDescription: "", peakFor: "both", bonusScale: 1.2 });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { toast.error("ID is required"); return; }
    setSaving(true);
    try {
      const { id, ...rest } = form;
      const data: Omit<SpecialInteractionDoc, "id"> = {
        ...rest,
        timingBonus: hasTimingBonus ? timingBonus : undefined,
        description: form.description || "",
      };
      // Remove undefined fields before writing
      const cleaned = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
      await setDoc(doc(db, COLLECTIONS.SPECIAL_INTERACTION_DEFS, id.trim()), cleaned, { merge: false });
      toast.success(editing ? "Updated" : "Created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.SPECIAL_INTERACTION_DEFS, confirmDelete.id));
      toast.success("Deleted");
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter(i =>
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.description?.toLowerCase().includes(query.toLowerCase())
  );

  const missingKeys = ALL_KEYS.filter(k => !items.some(i => i.id === k));

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Special Interaction Defs</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
            Group×group clash outcomes for special move collisions (10 entries: strike/aerial/guard/field × each).
            Loaded into room cache at match start — no server redeploy needed.
          </p>
        </div>
        <button onClick={openCreate}
          style={{ padding: "8px 18px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
          + Add Entry
        </button>
      </div>

      {missingKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "#ff990022", border: "1px solid #ff990066", borderRadius: 8, fontSize: 12, color: "#ffbb44" }}>
          Missing keys: {missingKeys.join(", ")}
          <span style={{ color: C.muted, marginLeft: 8 }}>— Run <code>npm run seed:special-interaction-defs</code> to seed defaults.</span>
        </div>
      )}

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by key or description…"
        style={{ ...inp, marginBottom: 16, maxWidth: 360 }} />

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: C.muted, fontSize: 13 }}>No entries found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const [attGroup, defGroup] = item.id.split(":");
            return (
              <div key={item.id}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{item.id}</span>
                    <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 99, background: "#3b82f622", color: "#60a5fa", border: "1px solid #3b82f644" }}>{attGroup}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>→</span>
                    <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 99, background: "#a855f722", color: "#c084fc", border: "1px solid #a855f744" }}>{defGroup}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted, flexWrap: "wrap" }}>
                    <span>Att dmg <strong style={{ color: C.text }}>{item.attackerDamageScale}×</strong></span>
                    <span>Def dmg <strong style={{ color: C.text }}>{item.defenderDamageScale}×</strong></span>
                    <span>Att kb <strong style={{ color: C.text }}>{item.attackerKnockback}</strong></span>
                    <span>Def kb <strong style={{ color: C.text }}>{item.defenderKnockback}</strong></span>
                    {item.timingBonus && <span style={{ color: "#fbbf24" }}>⏱ Timing bonus ×{item.timingBonus.bonusScale} ({item.timingBonus.peakFor})</span>}
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: C.faint, marginTop: 4, fontStyle: "italic" }}>{item.description}</div>}
                </div>
                <button onClick={() => openEdit(item)}
                  style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, cursor: "pointer", flexShrink: 0 }}>Edit</button>
                <button onClick={() => setConfirmDelete(item)}
                  style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: "1px solid #ef444444", background: "#ef44440d", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>Delete</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "20px 0" }}>
          <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 520, maxWidth: "92vw", margin: "auto" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>
              {editing ? "Edit" : "Add"} Interaction Def
            </h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Key (attacker:defender group) *</span>
              {editing ? (
                <div style={{ ...inp, color: C.faint, background: C.bg1 }}>{form.id}</div>
              ) : (
                <select value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  style={{ ...inp, padding: "6px 8px" }}>
                  {ALL_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              )}
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Attacker Damage Scale</span>
                <input type="number" min={0} max={5} step={0.1} value={form.attackerDamageScale}
                  onChange={e => setForm(f => ({ ...f, attackerDamageScale: parseFloat(e.target.value) || 0 }))} style={numInp} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Defender Damage Scale</span>
                <input type="number" min={0} max={5} step={0.1} value={form.defenderDamageScale}
                  onChange={e => setForm(f => ({ ...f, defenderDamageScale: parseFloat(e.target.value) || 0 }))} style={numInp} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Attacker Spin Delta (fraction)</span>
                <input type="number" min={-1} max={1} step={0.01} value={form.attackerSpinDelta}
                  onChange={e => setForm(f => ({ ...f, attackerSpinDelta: parseFloat(e.target.value) || 0 }))} style={numInp} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Defender Spin Delta (fraction)</span>
                <input type="number" min={-1} max={1} step={0.01} value={form.defenderSpinDelta}
                  onChange={e => setForm(f => ({ ...f, defenderSpinDelta: parseFloat(e.target.value) || 0 }))} style={numInp} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Attacker Knockback</span>
                <KbSelect value={form.attackerKnockback} onChange={v => setForm(f => ({ ...f, attackerKnockback: v }))} />
              </label>
              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Defender Knockback</span>
                <KbSelect value={form.defenderKnockback} onChange={v => setForm(f => ({ ...f, defenderKnockback: v }))} />
              </label>
            </div>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Describe the clash outcome…" />
            </label>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, cursor: "pointer", marginBottom: 10 }}>
                <input type="checkbox" checked={hasTimingBonus} onChange={e => setHasTimingBonus(e.target.checked)} />
                Has Timing Bonus
              </label>
              {hasTimingBonus && (
                <div style={{ padding: "12px 14px", background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                  <label>
                    <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Condition Description</span>
                    <input value={timingBonus.conditionDescription}
                      onChange={e => setTimingBonus(t => ({ ...t, conditionDescription: e.target.value }))}
                      style={inp} placeholder="e.g. Contact within 200ms of anchor active-start" />
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <label style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Peak For</span>
                      <select value={timingBonus.peakFor}
                        onChange={e => setTimingBonus(t => ({ ...t, peakFor: e.target.value as PeakFor }))}
                        style={{ ...inp, padding: "6px 8px" }}>
                        {PEAK_FOR.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </label>
                    <label style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Bonus Scale</span>
                      <input type="number" min={1} max={5} step={0.05} value={timingBonus.bonusScale}
                        onChange={e => setTimingBonus(t => ({ ...t, bonusScale: parseFloat(e.target.value) || 1 }))}
                        style={numInp} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg0, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 360, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.id}"?</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
              This removes the interaction rule for this group pair. Matches will use DEFAULT_CLASH_OUTCOME as fallback.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
