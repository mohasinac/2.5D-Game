import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
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

function KbSelect({ value, onChange }: { value: KnockbackKind; onChange: (v: KnockbackKind) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as KnockbackKind)}
      className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-text text-sm focus:outline-none focus:border-blue">
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
    <div className="p-6 max-w-[900px]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-text m-0">Special Interaction Defs</h1>
          <p className="text-[13px] text-muted mt-1">
            Group×group clash outcomes for special move collisions (10 entries: strike/aerial/guard/field × each).
            Loaded into room cache at match start — no server redeploy needed.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate} className="shrink-0">+ Add Entry</Button>
      </div>

      {missingKeys.length > 0 && (
        <div className="mb-4 px-3.5 py-2.5 bg-yellow/10 border border-yellow/40 rounded-lg text-xs text-yellow">
          Missing keys: {missingKeys.join(", ")}
          <span className="text-muted ml-2">— Run <code>npm run seed:special-interaction-defs</code> to seed defaults.</span>
        </div>
      )}

      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by key or description…" className="mb-4 max-w-sm" />

      {loading ? (
        <div className="text-muted text-[13px]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-[13px]">No entries found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => {
            const [attGroup, defGroup] = item.id.split(":");
            return (
              <div key={item.id} className="flex items-start gap-3.5 bg-bg1 border border-border rounded-xl px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold text-text font-mono">{item.id}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/25">{attGroup}</span>
                    <span className="text-[11px] text-muted">&#8594;</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/25">{defGroup}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted flex-wrap">
                    <span>Att dmg <strong className="text-text">{item.attackerDamageScale}×</strong></span>
                    <span>Def dmg <strong className="text-text">{item.defenderDamageScale}×</strong></span>
                    <span>Att kb <strong className="text-text">{item.attackerKnockback}</strong></span>
                    <span>Def kb <strong className="text-text">{item.defenderKnockback}</strong></span>
                    {item.timingBonus && (
                      <span className="text-yellow">&#9201; Timing bonus ×{item.timingBonus.bonusScale} ({item.timingBonus.peakFor})</span>
                    )}
                  </div>
                  {item.description && <div className="text-xs text-faint mt-1 italic">{item.description}</div>}
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="shrink-0">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(item)} className="shrink-0">Delete</Button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] overflow-y-auto py-5">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[520px] max-w-[92vw] m-auto">
            <h2 className="text-[17px] font-bold text-text m-0 mb-5">
              {editing ? "Edit" : "Add"} Interaction Def
            </h2>

            <div className="mb-3.5">
              <Label>Key (attacker:defender group) *</Label>
              {editing ? (
                <div className="w-full bg-bg1 border border-border rounded-md px-3 py-2 text-faint text-sm">{form.id}</div>
              ) : (
                <select value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-text text-sm focus:outline-none focus:border-blue">
                  {ALL_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div>
                <Label>Attacker Damage Scale</Label>
                <Input type="number" min={0} max={5} step={0.1} value={form.attackerDamageScale}
                  onChange={e => setForm(f => ({ ...f, attackerDamageScale: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Defender Damage Scale</Label>
                <Input type="number" min={0} max={5} step={0.1} value={form.defenderDamageScale}
                  onChange={e => setForm(f => ({ ...f, defenderDamageScale: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Attacker Spin Delta (fraction)</Label>
                <Input type="number" min={-1} max={1} step={0.01} value={form.attackerSpinDelta}
                  onChange={e => setForm(f => ({ ...f, attackerSpinDelta: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Defender Spin Delta (fraction)</Label>
                <Input type="number" min={-1} max={1} step={0.01} value={form.defenderSpinDelta}
                  onChange={e => setForm(f => ({ ...f, defenderSpinDelta: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Attacker Knockback</Label>
                <KbSelect value={form.attackerKnockback} onChange={v => setForm(f => ({ ...f, attackerKnockback: v }))} />
              </div>
              <div>
                <Label>Defender Knockback</Label>
                <KbSelect value={form.defenderKnockback} onChange={v => setForm(f => ({ ...f, defenderKnockback: v }))} />
              </div>
            </div>

            <div className="mb-3.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Describe the clash outcome…" />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-[13px] text-text cursor-pointer mb-2.5">
                <input type="checkbox" checked={hasTimingBonus} onChange={e => setHasTimingBonus(e.target.checked)} />
                Has Timing Bonus
              </label>
              {hasTimingBonus && (
                <div className="px-3.5 py-3 bg-bg1 rounded-lg border border-border flex flex-col gap-2.5">
                  <div>
                    <Label>Condition Description</Label>
                    <Input value={timingBonus.conditionDescription}
                      onChange={e => setTimingBonus(t => ({ ...t, conditionDescription: e.target.value }))}
                      placeholder="e.g. Contact within 200ms of anchor active-start" />
                  </div>
                  <div className="flex gap-2.5">
                    <div className="flex-1">
                      <Label>Peak For</Label>
                      <select value={timingBonus.peakFor}
                        onChange={e => setTimingBonus(t => ({ ...t, peakFor: e.target.value as PeakFor }))}
                        className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-text text-sm focus:outline-none focus:border-blue">
                        {PEAK_FOR.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <Label>Bonus Scale</Label>
                      <Input type="number" min={1} max={5} step={0.05} value={timingBonus.bonusScale}
                        onChange={e => setTimingBonus(t => ({ ...t, bonusScale: parseFloat(e.target.value) || 1 }))} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg0 border border-border rounded-2xl p-7 w-[360px] text-center">
            <div className="text-base font-semibold text-text mb-2.5">Delete "{confirmDelete.id}"?</div>
            <div className="text-[13px] text-muted mb-5">
              This removes the interaction rule for this group pair. Matches will use DEFAULT_CLASH_OUTCOME as fallback.
            </div>
            <div className="flex gap-2.5 justify-center">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
