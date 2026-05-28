import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

interface AIBattlePreset {
  id: string;
  difficulty: "medium" | "hard" | "hell";
  displayName: string;
  description: string;
  defaultBeybladeId: string;
  defaultArenaId: string;
  isActive: boolean;
}

type BadgeColor = "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "muted" | "faint";

const DIFFICULTIES = [
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "hell", label: "Hell" },
];

const DIFF_BADGE: Record<string, BadgeColor> = {
  medium: "green", hard: "yellow", hell: "red",
};

const EMPTY: Omit<AIBattlePreset, "id"> = {
  difficulty: "medium",
  displayName: "",
  description: "",
  defaultBeybladeId: "",
  defaultArenaId: "",
  isActive: true,
};

const inputCls = "w-full bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm focus:outline-none focus:border-blue box-border";

export function AIBattlesPage() {
  const [items, setItems] = useState<AIBattlePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AIBattlePreset | null>(null);
  const [form, setForm] = useState<Omit<AIBattlePreset, "id">>({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<AIBattlePreset | null>(null);
  const [saving, setSaving] = useState(false);

  const [beyOptions, setBeyOptions] = useState<{ value: string; label: string }[]>([]);
  const [arenaOptions, setArenaOptions] = useState<{ value: string; label: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [snap, beySnap, arenaSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.AI_BATTLES)),
        getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
        getDocs(collection(db, COLLECTIONS.ARENAS)),
      ]);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as AIBattlePreset))
        .sort((a, b) => {
          const order = ["medium", "hard", "hell"];
          return order.indexOf(a.difficulty) - order.indexOf(b.difficulty) || a.displayName.localeCompare(b.displayName);
        }));
      setBeyOptions(beySnap.docs.map(d => ({ value: d.id, label: (d.data().displayName as string) ?? (d.data().name as string) ?? d.id })));
      setArenaOptions(arenaSnap.docs.map(d => ({ value: d.id, label: (d.data().name as string) ?? d.id })));
    } catch { toast.error("Failed to load AI battles"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: AIBattlePreset) => {
    setEditing(item);
    setForm({ difficulty: item.difficulty, displayName: item.displayName, description: item.description ?? "", defaultBeybladeId: item.defaultBeybladeId ?? "", defaultArenaId: item.defaultArenaId ?? "", isActive: item.isActive ?? true });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.displayName.trim()) { toast.error("Display name is required"); return; }
    setSaving(true);
    try {
      const id = editing ? editing.id : `${form.difficulty}-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.AI_BATTLES, id), {
        difficulty: form.difficulty,
        displayName: form.displayName.trim(),
        description: form.description.trim(),
        defaultBeybladeId: form.defaultBeybladeId,
        defaultArenaId: form.defaultArenaId,
        isActive: form.isActive,
      });
      toast.success(editing ? "Updated" : "Created");
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.AI_BATTLES, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.displayName}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const toggleActive = async (item: AIBattlePreset) => {
    try {
      const { id: _id, ...rest } = item;
      await setDoc(doc(db, COLLECTIONS.AI_BATTLES, item.id), { ...rest, isActive: !item.isActive });
      load();
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">AI Battle Presets</h1>
          <p className="text-faint text-sm mt-1">
            {loading ? "Loading…" : `${items.length} preset${items.length !== 1 ? "s" : ""} — quick-launch AI battles for players`}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ New Preset</Button>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-muted text-center py-10">
          No presets yet. Run <code className="font-mono bg-bg2 px-1.5 py-0.5 rounded text-xs">npm run seed:ai-battles</code> or create one above.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-3.5 bg-bg1 border border-border rounded-xl px-4 py-3.5 transition-opacity ${item.isActive ? "" : "opacity-55"}`}>
              <div className="flex-shrink-0 w-16 text-center">
                <Badge color={DIFF_BADGE[item.difficulty] ?? "muted"}>
                  {item.difficulty.toUpperCase()}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text text-sm">{item.displayName}</span>
                  <span className="font-mono text-[11px] text-faint bg-bg2 px-1.5 py-0.5 rounded">{item.id}</span>
                  {!item.isActive && <span className="text-[10px] font-bold text-faint bg-bg3 px-1.5 py-0.5 rounded">INACTIVE</span>}
                </div>
                {item.description && <div className="text-xs text-muted mt-0.5">{item.description}</div>}
                <div className="text-[11px] text-faint mt-0.5 flex gap-3">
                  {item.defaultBeybladeId && <span>Bey: <span className="text-muted">{beyOptions.find(b => b.value === item.defaultBeybladeId)?.label ?? item.defaultBeybladeId}</span></span>}
                  {item.defaultArenaId && <span>Arena: <span className="text-muted">{arenaOptions.find(a => a.value === item.defaultArenaId)?.label ?? item.defaultArenaId}</span></span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button size="xs" variant="outline" onClick={() => toggleActive(item)}>
                  {item.isActive ? "Disable" : "Enable"}
                </Button>
                <Button size="xs" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button size="xs" variant="danger" onClick={() => setConfirmDelete(item)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border rounded-2xl p-7 w-full max-w-[min(500px,calc(100vw-2rem))]">
            <h3 className="text-lg font-bold text-text mb-5">
              {editing ? "Edit Preset" : "New AI Battle Preset"}
            </h3>

            <div className="flex flex-col gap-3.5">
              <div>
                <span className="text-xs text-muted block mb-1">Difficulty</span>
                <SearchableSelect value={form.difficulty} options={DIFFICULTIES} onChange={v => setForm(f => ({ ...f, difficulty: v as any }))} />
              </div>

              <label>
                <span className="text-xs text-muted block mb-1">Display Name *</span>
                <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} className={inputCls} placeholder="e.g. Hard AI Battle" />
              </label>

              <label>
                <span className="text-xs text-muted block mb-1">Description</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={`${inputCls} resize-y`} />
              </label>

              <div>
                <span className="text-xs text-muted block mb-1">Default Beyblade (optional)</span>
                <SearchableSelect value={form.defaultBeybladeId} options={[{ value: "", label: "— Random / player picks —" }, ...beyOptions]}
                  onChange={v => setForm(f => ({ ...f, defaultBeybladeId: v }))} placeholder="Auto-pick…" />
              </div>

              <div>
                <span className="text-xs text-muted block mb-1">Default Arena (optional)</span>
                <SearchableSelect value={form.defaultArenaId} options={[{ value: "", label: "— Random / player picks —" }, ...arenaOptions]}
                  onChange={v => setForm(f => ({ ...f, defaultArenaId: v }))} placeholder="Auto-pick…" />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <span className="text-sm text-text">Active (visible to players)</span>
              </label>
            </div>

            <div className="flex gap-2.5 justify-end mt-5">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-2xl p-7 max-w-[380px] w-[90%]">
            <h3 className="text-base font-bold text-text mb-2.5">Delete "{confirmDelete.displayName}"?</h3>
            <p className="text-muted text-sm mb-5">This will remove the preset from the AI battle quick-launch list.</p>
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
