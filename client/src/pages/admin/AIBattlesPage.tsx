import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";
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

const DIFFICULTIES = [
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "hell", label: "Hell" },
];

const DIFF_COLORS: Record<string, string> = {
  medium: C.green, hard: C.yellow, hell: C.red,
};

const EMPTY: Omit<AIBattlePreset, "id"> = {
  difficulty: "medium",
  displayName: "",
  description: "",
  defaultBeybladeId: "",
  defaultArenaId: "",
  isActive: true,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", background: C.bg0,
  border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13,
  boxSizing: "border-box",
};

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
      setBeyOptions(beySnap.docs.map(d => ({ value: d.id, label: (d.data().name as string) ?? d.id })));
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
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>AI Battle Presets</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading…" : `${items.length} preset${items.length !== 1 ? "s" : ""} — quick-launch AI battles for players`}
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + New Preset
        </button>
      </div>

      {loading ? (
        <div style={{ color: C.muted }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: C.muted, textAlign: "center", padding: 40 }}>
          No presets yet. Run <code style={{ fontFamily: "monospace", background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>npm run seed:ai-battles</code> or create one above.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", opacity: item.isActive ? 1 : 0.55 }}>
              <div style={{ flexShrink: 0, width: 64, textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: (DIFF_COLORS[item.difficulty] ?? C.blue) + "22", color: DIFF_COLORS[item.difficulty] ?? C.blue }}>
                  {item.difficulty.toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.displayName}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>{item.id}</span>
                  {!item.isActive && <span style={{ fontSize: 10, fontWeight: 700, color: C.faint, background: C.bg3, padding: "1px 6px", borderRadius: 4 }}>INACTIVE</span>}
                </div>
                {item.description && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{item.description}</div>}
                <div style={{ fontSize: 11, color: C.faint, marginTop: 3, display: "flex", gap: 12 }}>
                  {item.defaultBeybladeId && <span>Bey: <span style={{ color: C.muted }}>{beyOptions.find(b => b.value === item.defaultBeybladeId)?.label ?? item.defaultBeybladeId}</span></span>}
                  {item.defaultArenaId && <span>Arena: <span style={{ color: C.muted }}>{arenaOptions.find(a => a.value === item.defaultArenaId)?.label ?? item.defaultArenaId}</span></span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => toggleActive(item)}
                  style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>
                  {item.isActive ? "Disable" : "Enable"}
                </button>
                <button onClick={() => openEdit(item)}
                  style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}>
                  Edit
                </button>
                <button onClick={() => setConfirmDelete(item)}
                  style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", border: `1px solid ${C.red}66`, background: "transparent", color: C.red }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 500 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>
              {editing ? "Edit Preset" : "New AI Battle Preset"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Difficulty</span>
                <SearchableSelect value={form.difficulty} options={DIFFICULTIES} onChange={v => setForm(f => ({ ...f, difficulty: v as any }))} />
              </div>

              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Display Name *</span>
                <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} style={inputStyle} placeholder="e.g. Hard AI Battle" />
              </label>

              <label>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Description</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </label>

              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Default Beyblade (optional)</span>
                <SearchableSelect value={form.defaultBeybladeId} options={[{ value: "", label: "— Random / player picks —" }, ...beyOptions]}
                  onChange={v => setForm(f => ({ ...f, defaultBeybladeId: v }))} placeholder="Auto-pick…" />
              </div>

              <div>
                <span style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Default Arena (optional)</span>
                <SearchableSelect value={form.defaultArenaId} options={[{ value: "", label: "— Random / player picks —" }, ...arenaOptions]}
                  onChange={v => setForm(f => ({ ...f, defaultArenaId: v }))} placeholder="Auto-pick…" />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <span style={{ fontSize: 13, color: C.text }}>Active (visible to players)</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
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
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.displayName}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>This will remove the preset from the AI battle quick-launch list.</p>
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
