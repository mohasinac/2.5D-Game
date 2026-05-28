import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGameDataStore, type ArenaFeatureConfigDoc } from "@/stores/gameDataStore";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
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

const CATEGORY_BADGE_COLOR: Record<string, "red" | "blue" | "purple" | "green"> = {
  hazard: "red",
  effect_zone: "blue",
  particle: "purple",
  env_preset: "green",
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
    <div className="p-6 w-full box-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Arena Feature Configs</h1>
          <p className="text-faint text-xs mt-1">
            {loading ? "Loading…" : `${items.length} configs — ${CATEGORY_OPTIONS.map(c => `${countByCategory(c.value)} ${c.label}`).join(", ")}`}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Config</Button>
      </div>

      <div className="grid gap-2 mb-3 grid-cols-[1fr_200px]">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by label or ID…"
          className="w-full bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm box-border" />
        <SearchableSelect value={categoryFilter} onChange={setCategoryFilter} options={catFilterOpts} placeholder="Category…" />
      </div>

      {loading ? <div className="text-muted">Loading…</div> : filtered.length === 0 ? <div className="text-muted">No configs found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => {
            const cc = CATEGORY_COLORS[item.category] ?? C.blue;
            const badgeColor = CATEGORY_BADGE_COLOR[item.category] ?? "blue";
            return (
              <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border rounded-xl px-4 py-3">
                {(item.icon || item.color) && (
                  <div
                    className="w-9 h-9 rounded-[8px] shrink-0 flex items-center justify-center text-[18px] hud-type-bg border-2 hud-type-border"
                    style={{ "--tc": item.color ?? cc } as React.CSSProperties}
                  >
                    {item.icon ?? ""}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-text text-sm">{item.label}</span>
                    <span className="font-mono text-xs text-faint bg-bg2 px-1.5 py-0.5 rounded">{item.id}</span>
                    <Badge color={badgeColor}>{item.category}</Badge>
                  </div>
                  {item.description && <div className="text-xs text-muted mt-0.5">{item.description}</div>}
                </div>
                <Button variant="outline" size="xs" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" size="xs" onClick={() => setConfirmDelete(item)}>Delete</Button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/[.75] flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border rounded-2xl p-4 sm:p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-text mb-5">{editing ? "Edit Feature Config" : "New Feature Config"}</h3>

            <label className="block mb-3.5">
              <span className="text-xs text-muted block mb-1">ID <span className="text-faint">(slug, no spaces)</span></span>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                disabled={!!editing}
                className="w-full bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm box-border disabled:opacity-50"
                placeholder="e.g. lava_floor" />
            </label>

            <div className="grid gap-3 mb-3.5 grid-cols-[1fr_auto]">
              <Input label="Label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
              <div>
                <label className="text-xs text-muted block mb-1.5">Icon</label>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-14 bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-xl text-center box-border"
                  placeholder="🔥" />
              </div>
            </div>

            <div className="mb-3.5">
              <span className="text-xs text-muted block mb-1">Category</span>
              <SearchableSelect value={form.category} onChange={v => setForm(f => ({ ...f, category: v as ArenaFeatureConfigDoc["category"] }))} options={CATEGORY_OPTIONS} placeholder="Category…" />
            </div>

            <label className="block mb-3.5">
              <span className="text-xs text-muted block mb-1">Color (hex, optional)</span>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color || "#888888"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-9 border border-border rounded-md cursor-pointer p-0.5 bg-bg0" />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="flex-1 bg-bg0 border border-border rounded-lg px-2.5 py-2 text-text text-sm box-border"
                  placeholder="#ff4444 (optional)" />
              </div>
            </label>

            <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="mb-5" />

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
        <div className="fixed inset-0 bg-black/[.75] flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-2xl p-4 sm:p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-text mb-2.5">Delete "{confirmDelete.label}"?</h3>
            <p className="text-muted text-sm mb-5">Arena features referencing this config ID will need to be updated manually.</p>
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
