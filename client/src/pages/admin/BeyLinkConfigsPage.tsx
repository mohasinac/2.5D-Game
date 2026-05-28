import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type BeyLinkConfigDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { cn } from "@/lib/cn";
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

const inputCls = "w-full px-[10px] py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

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
    <div className="p-6 w-full box-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">BeyLink Configs</h1>
          <p className="text-theme-faint text-[13px] mt-1">
            {loading ? "Loading…" : `${items.length} configs across ${CATEGORY_OPTIONS.filter(c => countByCategory(c.value) > 0).length} categories`}
          </p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer">
          + New Config
        </button>
      </div>

      <div className="grid gap-2 mb-3 grid-cols-[1fr_220px]">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by label or ID…" className={inputCls} />
        <SearchableSelect value={categoryFilter} onChange={setCategoryFilter} options={catFilterOpts} placeholder="Category…" />
      </div>

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No configs found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => {
            const cc = item.color ?? "#60a5fa";
            return (
              <div key={item.id} className="flex items-center gap-[14px] bg-bg1 border border-border-c rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-theme-text text-[14px]">{item.label}</span>
                    <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-[6px] py-[1px] rounded">{item.id}</span>
                    <span className="text-[11px] px-[7px] py-[2px] rounded-[4px] hud-type-bg hud-type-text" style={{ "--tc": cc } as React.CSSProperties}>{item.category}</span>
                    {item.color && (
                      <span className="inline-block w-4 h-4 rounded-[3px] border border-border-c shrink-0 [background:var(--swatch-color)]" style={{ "--swatch-color": item.color } as React.CSSProperties} />
                    )}
                  </div>
                  {item.description && <div className="text-[12px] text-theme-muted mt-[3px]">{item.description}</div>}
                </div>
                <button onClick={() => openEdit(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
                <button onClick={() => setConfirmDelete(item)} className="px-[14px] py-[6px] rounded-[7px] text-[12px] cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit BeyLink Config" : "New BeyLink Config"}</h3>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">ID <span className="text-theme-faint">(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing} className={cn(inputCls, editing && "opacity-50")} placeholder="e.g. tip_stack" />
            </label>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Label</span>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} />
            </label>

            <div className="mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Category</span>
              <SearchableSelect value={form.category} onChange={v => setForm(f => ({ ...f, category: v as BeyLinkCategory }))} options={CATEGORY_OPTIONS} placeholder="Category…" />
            </div>

            <label className="block mb-[14px]">
              <span className="text-[12px] text-theme-muted block mb-1">Color (hex, optional)</span>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color || "#888888"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-9 border border-border-c rounded-md cursor-pointer p-[2px]" />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className={cn(inputCls, "flex-1 w-auto")} placeholder="#60a5fa (optional)" />
              </div>
            </label>

            <label className="block mb-5">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={cn(inputCls, "resize-y")} />
            </label>

            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setShowModal(false)} className="px-[18px] py-2 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className={cn("px-[18px] py-2 rounded-lg text-[13px] border-none bg-theme-blue text-white cursor-pointer", saving && "opacity-60")}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-4 sm:p-7 max-w-[400px] w-[90%]">
            <h3 className="text-[16px] font-bold text-theme-text mb-[10px]">Delete "{confirmDelete.label}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">Arena links referencing this config will need to be updated manually.</p>
            <div className="flex gap-[10px] justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
